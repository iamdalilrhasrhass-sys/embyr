#!/usr/bin/env bash
set -euo pipefail

base="${EMBIR_BASE_URL:-http://127.0.0.1:3200}"
password="${EMBIR_QA_PASSWORD:-Qa-Connection-2026!}"
run_id="${EMBIR_QA_RUN_ID:-$(date +%s)}"

for command in curl jq node; do
  command -v "$command" >/dev/null || {
    echo "Missing required command: $command" >&2
    exit 1
  }
done

register() {
  local email="$1" name="$2" gender="$3"
  curl -sS -X POST "$base/api/auth/register" \
    -H 'Content-Type: application/json' \
    --data "$(jq -nc \
      --arg email "$email" \
      --arg password "$password" \
      --arg name "$name" \
      --arg gender "$gender" \
      '{email:$email,password:$password,name:$name,gender:$gender,birthDate:"1994-04-10",city:"Zurich",country:"CH",locale:"fr",isAdult:true,acceptTerms:true,acceptPrivacy:true,consentSensitiveData:true,source:"qa_e2e"}')"
}

authenticated_json() {
  local method="$1" url="$2" token="$3" data="${4:-}"
  if [[ -n "$data" ]]; then
    curl -fsS -X "$method" "$base$url" \
      -H "Authorization: Bearer $token" \
      -H 'Content-Type: application/json' \
      --data "$data"
  else
    curl -fsS -X "$method" "$base$url" -H "Authorization: Bearer $token"
  fi
}

email_a="qa.connection.a.${run_id}@example.invalid"
email_b="qa.connection.b.${run_id}@example.invalid"
email_c="qa.connection.c.${run_id}@example.invalid"
a_json="$(register "$email_a" 'QA Aurore' 'male')"
b_json="$(register "$email_b" 'QA Bianca' 'female')"
c_json="$(register "$email_c" 'QA Camille' 'other')"
a_id="$(jq -er '.user.id' <<<"$a_json")"
b_id="$(jq -er '.user.id' <<<"$b_json")"
a_token="$(jq -er '.token' <<<"$a_json")"
b_token="$(jq -er '.token' <<<"$b_json")"
c_token="$(jq -er '.token' <<<"$c_json")"

profile_a='{"displayName":"QA Aurore","age":32,"city":"Zurich","country":"CH","genderIdentity":"HOMME","orientation":"HETERO","seekingGenders":["FEMME"],"primaryIntent":"AMOUR","acceptedIntents":["AMOUR","DISCUSSION"],"activities":["cinema","randonnee"],"seekingAgeMin":25,"seekingAgeMax":40,"seekingRadiusKm":50,"language":"fr","onboardingStep":10,"onboardingComplete":true,"consentSensitiveData":true}'
profile_b='{"displayName":"QA Bianca","age":31,"city":"Zurich","country":"CH","genderIdentity":"FEMME","orientation":"HETERO","seekingGenders":["HOMME"],"primaryIntent":"AMOUR","acceptedIntents":["AMOUR","DISCUSSION"],"activities":["cinema","lecture"],"seekingAgeMin":25,"seekingAgeMax":40,"seekingRadiusKm":50,"language":"fr","onboardingStep":10,"onboardingComplete":true,"consentSensitiveData":true}'
authenticated_json PUT '/api/profile/me' "$a_token" "$profile_a" >/dev/null
authenticated_json PUT '/api/profile/me' "$b_token" "$profile_b" >/dev/null

signal='{"intent":"AMOUR","socialEnergy":"OUVERTE","formats":["CAFE","BALADE"],"availabilityText":"Cette semaine","approximateArea":"Zurich centre","durationHours":48,"visible":true}'
authenticated_json POST '/api/signals' "$a_token" "$signal" >/dev/null
authenticated_json POST '/api/signals' "$b_token" "$signal" >/dev/null

feed_a="$(authenticated_json GET '/api/match/feed?intent=AMOUR&limit=5' "$a_token")"
feed_b="$(authenticated_json GET '/api/match/feed?intent=AMOUR&limit=5' "$b_token")"
jq -e --arg id "$b_id" '.profiles | any(.userId == $id)' <<<"$feed_a" >/dev/null
jq -e --arg id "$a_id" '.profiles | any(.userId == $id)' <<<"$feed_b" >/dev/null

unauthorized_response="$(curl -sS -w $'\n%{http_code}' -X POST "$base/api/conversations" \
  -H "Authorization: Bearer $a_token" \
  -H 'Content-Type: application/json' \
  --data '{"targetUserId":"not-a-real-user"}')"
unauthorized_code="${unauthorized_response##*$'\n'}"
[[ "$unauthorized_code" == '409' ]]

spark_a="$(jq -nc --arg id "$b_id" '{targetUserId:$id,action:"like",targetType:"ACTIVITY",targetId:"cinema",note:"Le cinema partage me donne envie de discuter."}')"
spark_b="$(jq -nc --arg id "$a_id" '{targetUserId:$id,action:"like",targetType:"ACTIVITY",targetId:"cinema",note:"Parlons de notre prochain film prefere."}')"
first="$(authenticated_json POST '/api/match/action' "$a_token" "$spark_a")"
second="$(authenticated_json POST '/api/match/action' "$b_token" "$spark_b")"
jq -e '.matched == false and .state == "SIGNAL_SENT"' <<<"$first" >/dev/null
jq -e '.matched == true and .state == "REVEAL_PENDING"' <<<"$second" >/dev/null
match_id="$(jq -er '.matchId' <<<"$second")"

wait_a="$(authenticated_json POST "/api/connections/$match_id/reveal" "$a_token" '{"content":"Une balade au bord du lac puis un cafe."}')"
complete_b="$(authenticated_json POST "/api/connections/$match_id/reveal" "$b_token" '{"content":"Un film puis une longue discussion."}')"
jq -e '.waiting == true and .bothResponded == false' <<<"$wait_a" >/dev/null
jq -e '.waiting == false and .bothResponded == true and (.responses | length) == 2' <<<"$complete_b" >/dev/null
conversation_id="$(jq -er '.conversationId' <<<"$complete_b")"

third_party_response="$(curl -sS -w $'\n%{http_code}' -X GET "$base/api/conversations/$conversation_id/messages" \
  -H "Authorization: Bearer $c_token")"
third_party_code="${third_party_response##*$'\n'}"
[[ "$third_party_code" == '404' ]]

message="$(authenticated_json POST "/api/conversations/$conversation_id/messages" "$a_token" '{"content":"Bonjour Bianca, ravi que notre etincelle soit reciproque."}')"
jq -e '.message.content | contains("Bonjour Bianca")' <<<"$message" >/dev/null
notifications_b="$(authenticated_json GET '/api/notifications?limit=20' "$b_token")"
jq -e '.notifications | any(.type == "new_message")' <<<"$notifications_b" >/dev/null

plan_time="$(node -e 'process.stdout.write(new Date(Date.now() + 2 * 86400000).toISOString())')"
plan_payload="$(jq -nc --arg at "$plan_time" '{proposedAt:$at,format:"CAFE",approximateArea:"Zurich centre"}')"
plan="$(authenticated_json POST "/api/connections/$match_id/plans" "$a_token" "$plan_payload")"
plan_id="$(jq -er '.plan.id' <<<"$plan")"
accepted="$(authenticated_json PATCH "/api/connections/$match_id/plans" "$b_token" "$(jq -nc --arg id "$plan_id" '{planId:$id,action:"accept"}')")"
jq -e '.plan.status == "CONFIRMED"' <<<"$accepted" >/dev/null

outcome="$(authenticated_json POST "/api/connections/$match_id/outcome" "$a_token" '{"outcome":"CONTINUE","note":"Echange agreable."}')"
jq -e '.outcome.outcome == "CONTINUE"' <<<"$outcome" >/dev/null

authenticated_json POST "/api/blocks/$b_id" "$a_token" '{}' >/dev/null
blocked_message_response="$(curl -sS -w $'\n%{http_code}' -X POST "$base/api/conversations/$conversation_id/messages" \
  -H "Authorization: Bearer $b_token" \
  -H 'Content-Type: application/json' \
  --data '{"content":"Ce message doit être refusé après le blocage."}')"
blocked_message_code="${blocked_message_response##*$'\n'}"
[[ "$blocked_message_code" == '403' ]]
blocked_feed_a="$(authenticated_json GET '/api/match/feed?intent=AMOUR&limit=5' "$a_token")"
blocked_feed_b="$(authenticated_json GET '/api/match/feed?intent=AMOUR&limit=5' "$b_token")"
jq -e --arg id "$b_id" '.profiles | all(.userId != $id)' <<<"$blocked_feed_a" >/dev/null
jq -e --arg id "$a_id" '.profiles | all(.userId != $id)' <<<"$blocked_feed_b" >/dev/null

echo "registration=3 onboarding=2 signals=2 reciprocal_feed=ok unauthorized_conversation=$unauthorized_code third_party_conversation=$third_party_code reciprocal_match=ok reveal=complete conversation=created message=sent notification=received plan=confirmed private_outcome=saved block_enforced=$blocked_message_code blocked_feed=ok"

if [[ "${EMBIR_QA_CLEANUP:-false}" == 'true' ]]; then
  delete_payload="$(jq -nc --arg password "$password" '{password:$password,confirm:"DELETE"}')"
  authenticated_json DELETE '/api/account' "$a_token" "$delete_payload" >/dev/null
  authenticated_json DELETE '/api/account' "$b_token" "$delete_payload" >/dev/null
  authenticated_json DELETE '/api/account' "$c_token" "$delete_payload" >/dev/null
  echo 'cleanup=soft_deleted'
fi
