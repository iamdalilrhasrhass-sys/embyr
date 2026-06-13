#!/bin/bash
set -euo pipefail

TEMPLATE_FILE="/root/embyr/messages/fr/common.json"
TEMPLATE_JSON=$(cat "$TEMPLATE_FILE" | jq -c .)
API_URL="https://api.deepseek.com/v1/chat/completions"
API_KEY="${DEEPSEEK_API_KEY:-}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: DEEPSEEK_API_KEY is not set"
  exit 1
fi

# All 23 languages: code and their French name
declare -A LANG_NAMES=(
  ["es"]="espagnol"
  ["de"]="allemand"
  ["pt"]="portugais"
  ["it"]="italien"
  ["nl"]="néerlandais"
  ["ru"]="russe"
  ["zh"]="chinois simplifié"
  ["ja"]="japonais"
  ["ko"]="coréen"
  ["ar"]="arabe"
  ["hi"]="hindi"
  ["tr"]="turc"
  ["pl"]="polonais"
  ["sv"]="suédois"
  ["da"]="danois"
  ["fi"]="finnois"
  ["no"]="norvégien"
  ["th"]="thaï"
  ["vi"]="vietnamien"
  ["id"]="indonésien"
  ["ms"]="malais"
  ["ro"]="roumain"
  ["uk"]="ukrainien"
)

# Order: priority languages first, then alphabetical
ORDERED_LANGS=(
  "es" "de" "pt" "it" "nl"
  "ru" "zh" "ja" "ko" "ar"
  "hi" "tr" "pl" "sv" "da"
  "fi" "no" "th" "vi" "id"
  "ms" "ro" "uk"
)

TOTAL=${#ORDERED_LANGS[@]}
DONE=0
FAILED_LANGS=()

echo "=== Embir Translation Generator ==="
echo "Total languages: $TOTAL"
echo "Template: $TEMPLATE_FILE"
echo ""

translate_one() {
  local code="$1"
  local lang_name="${LANG_NAMES[$code]}"
  local out_dir="/root/embyr/messages/${code}"
  local out_file="${out_dir}/common.json"

  echo "[$code] Starting translation to $lang_name..."

  # Build the prompt
  local prompt="Tu es un traducteur professionnel. Traduis le JSON suivant en ${lang_name}. 
RÈGLES IMPORTANTES :
- Garde TOUTES les clés JSON exactement identiques (hero, nav, auth, etc.)
- Traduis UNIQUEMENT les valeurs (les strings entre guillemets)
- Préserve la structure JSON exacte
- Produis UNIQUEMENT le JSON, sans explications, sans markdown, sans backticks
- Assure-toi que le JSON reste valide (guillemets échappés correctement)
- Le contexte est une application de rencontre gay appelée Embir

JSON à traduire :
${TEMPLATE_JSON}"

  # Escape the prompt for JSON
  local escaped_prompt
  escaped_prompt=$(echo "$prompt" | jq -Rs .)

  local payload
  payload=$(cat <<EOF
{
  "model": "deepseek-chat",
  "messages": [{"role": "user", "content": ${escaped_prompt}}],
  "temperature": 0.3,
  "max_tokens": 4096
}
EOF
)

  # Call the API
  local response
  response=$(curl -s --max-time 120 "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d "$payload" 2>&1)

  local curl_exit=$?
  if [ $curl_exit -ne 0 ]; then
    echo "[$code] ERROR: curl failed with exit code $curl_exit"
    echo "[$code] Response: $response"
    return 1
  fi

  # Extract the content from the API response
  local content
  content=$(echo "$response" | jq -r '.choices[0].message.content // empty' 2>/dev/null)

  if [ -z "$content" ] || [ "$content" = "null" ]; then
    echo "[$code] ERROR: Could not extract content from API response"
    echo "[$code] Response: $(echo "$response" | jq -c . 2>/dev/null || echo "$response")"
    return 1
  fi

  # Clean up: remove markdown code blocks if present
  local cleaned
  cleaned=$(echo "$content" | sed -E 's/^```(json)?\s*//; s/```\s*$//')

  # Validate JSON
  if ! echo "$cleaned" | jq empty 2>/dev/null; then
    echo "[$code] WARNING: Invalid JSON, trying to extract JSON block..."
    # Try to extract just the JSON part
    cleaned=$(echo "$content" | sed -n '/^{/,/^}/p' | head -1)
    if ! echo "$cleaned" | jq empty 2>/dev/null; then
      # Try multiline extraction
      cleaned=$(echo "$content" | awk '/^{/{p=1} p{print} /^}$/{if(p) exit}')
      if ! echo "$cleaned" | jq empty 2>/dev/null; then
        echo "[$code] FATAL: Cannot extract valid JSON from response"
        echo "[$code] Raw content (first 500 chars): ${content:0:500}"
        return 1
      fi
    fi
  fi

  # Write to file
  mkdir -p "$out_dir"
  echo "$cleaned" | jq . > "$out_file"

  # Verify the file has all expected top-level keys
  local key_count
  key_count=$(jq 'keys | length' "$out_file")
  local template_key_count
  template_key_count=$(jq 'keys | length' "$TEMPLATE_FILE")

  if [ "$key_count" != "$template_key_count" ]; then
    echo "[$code] WARNING: Key count mismatch: got $key_count, expected $template_key_count"
  fi

  echo "[$code] ✓ SUCCESS — Written to $out_file ($(wc -c < "$out_file") bytes, $key_count top-level keys)"
  return 0
}

# Process in batches of 5 in parallel
BATCH_SIZE=5
for ((i=0; i<TOTAL; i+=BATCH_SIZE)); do
  batch_end=$((i + BATCH_SIZE))
  if [ $batch_end -gt $TOTAL ]; then
    batch_end=$TOTAL
  fi

  echo ""
  echo "=== BATCH $((i/BATCH_SIZE + 1)): ${ORDERED_LANGS[$i]} to ${ORDERED_LANGS[$((batch_end-1))]} ==="

  pids=()
  for ((j=i; j<batch_end; j++)); do
    lang="${ORDERED_LANGS[$j]}"
    translate_one "$lang" &
    pids+=($!)
  done

  # Wait for all in this batch
  for pid in "${pids[@]}"; do
    if ! wait "$pid"; then
      FAILED_LANGS+=("unknown_pid_$pid")
    fi
  done

  DONE=$batch_end
  echo "Progress: $DONE/$TOTAL done"
done

echo ""
echo "=== ALL DONE ==="
echo "Successful: $((TOTAL - ${#FAILED_LANGS[@]}))/$TOTAL"

if [ ${#FAILED_LANGS[@]} -gt 0 ]; then
  echo "FAILED: ${FAILED_LANGS[*]}"
  exit 1
else
  echo "All translations completed successfully!"
  exit 0
fi
