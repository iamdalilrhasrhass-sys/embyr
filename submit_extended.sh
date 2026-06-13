#!/bin/bash
# Extended directory discovery for embir.xyz
RESULTS_FILE="/root/embyr/backlinks_results.md"

log_result() {
  local dir="$1"
  local url="$2"
  local status="$3"
  local note="$4"
  echo "- **$dir** | [$url]($url) | $status | $note" >> "$RESULTS_FILE"
}

echo "" >> "$RESULTS_FILE"
echo "### Extended Directory Check" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Check more directories
dirs=(
  "https://startupbase.io/submit:StartupBase"
  "https://projectify.io/submit:Projectify"
  "https://www.appvita.com/submit:AppVita"
  "https://www.launchlist.net/submit:LaunchList"
  "https://startupregistry.com/submit:StartupRegistry"
  "https://startupcollections.com/submit:StartupCollections"
  "https://www.madewithvuejs.com/submit:MadeWithVueJS"
  "https://www.indiehackers.com/submit:IndieHackers"
  "https://allstartup.info/submit:AllStartup"
  "https://startup88.com/submit:Startup88"
  "https://betafy.co/submit:Betafy"
  "https://toolsnav.com/submit:ToolsNav"
  "https://listofstartups.com/submit:ListOfStartups"
  "https://startupstash.com/submit:StartupStash"
  "https://www.startupblink.com/submit:StartupBlink"
  "https://startupsfairy.com/submit-startup:StartupsFairy"
  "https://allstartups.info/submit:AllStartups"
  "https://startupbizlist.com/submit:StartupBizList"
  "https://appsonreview.com/submit:AppsOnReview"
  "https://www.appvita.com/submit:AppVita2"
)

for item in "${dirs[@]}"; do
  url="${item%%:*}"
  name="${item##*:}"
  
  HTTP_CODE=$(curl -sL -o /tmp/submit_check.html -w "%{http_code}" --max-time 15 "$url" 2>/dev/null)
  
  if [ "$HTTP_CODE" = "200" ]; then
    # Check what the page contains
    TITLE=$(grep -oP '<title>[^<]+' /tmp/submit_check.html | head -1 | sed 's/<title>//' | head -c 80)
    HAS_FORM=$(grep -c 'form\|input\|submit\|Submit' /tmp/submit_check.html)
    if [ "$HAS_FORM" -gt 0 ]; then
      log_result "$name" "$url" "✅ Found (200)" "Page has form - $TITLE"
    else
      log_result "$name" "$url" "✅ Found (200)" "$TITLE"
    fi
  elif [ "$HTTP_CODE" = "403" ]; then
    log_result "$name" "$url" "🔒 Blocked (403)" "Cloudflare/protected"
  elif [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "301" ]; then
    REDIR=$(grep -i 'location:' /tmp/submit_check.html 2>/dev/null || echo "unknown")
    log_result "$name" "$url" "↪️ Redirect ($HTTP_CODE)" ""
  elif [ "$HTTP_CODE" = "404" ]; then
    log_result "$name" "$url" "❌ 404" "Page not found"
  else
    log_result "$name" "$url" "⚠️ HTTP $HTTP_CODE" ""
  fi
done

echo "" >> "$RESULTS_FILE"
echo "### Directories with Simple/Free Submission Forms" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

log_result "StartupCollections" "https://startupcollections.com/submit-product/" "✅ SUBMITTED" "AJAX form - name, URL, description, email. Submitted: 'Free gay dating app, 25 languages, translation, safe space'"
log_result "NextBigWhat" "https://nextbigwhat.com/submit-your-startup/do/" "✅ Google Form" "Embedded Google Form for product submission"
log_result "KillerStartups" "https://www.killerstartups.com/submit-startup/" "📝 Contact Form 7" "WordPress CF7 form - requires manual browser submission"
log_result "Postmake" "https://postmake.io/submit-badge-listing" "🔖 Free badge listing" "Place badge on embir.xyz → get free listing"
log_result "BetaList" "https://betalist.com/submit" "👤 Requires account" "Register at betalist.com then submit"
log_result "SaaSHub" "https://www.saashub.com/submit" "👤 Requires account" "Register at saashub.com then submit"
log_result "Product Hunt" "https://www.producthunt.com/" "👤 Requires account" "Maker account required to post"
log_result "AlternativeTo" "https://www.alternativeto.net/" "👤 Requires account" "Cloudflare + account needed"
log_result "G2" "https://www.g2.com/products/new" "👤 Vendor account" "Publisher account required"
log_result "Capterra" "https://www.capterra.com/publishers/new-listing" "👤 Vendor account" "Publisher account required"
log_result "GetApp" "https://www.getapp.com/publishers/new-listing" "👤 Vendor account" "Publisher account required"
log_result "Software Advice" "https://www.softwareadvice.com/publishers/new-listing" "👤 Vendor account" "Publisher account required"
log_result "AppSumo" "https://www.appsumo.com/" "👤 Requires account" "Must create AppSumo account"
log_result "F6S" "https://www.f6s.com/" "👤 Requires account" "Login required"
log_result "PeerList" "https://peerlist.io/" "🔒 Cloudflare" "Cloudflare protected"

echo "" >> "$RESULTS_FILE"
echo "### Additional Niche Directories" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

log_result "Uneeb" "https://www.uneeb.com/" "🔒 Enterprise" "AI chatbot platform, not a directory"
log_result "ErliBird" "https://erlibird.com/" "❌ Unreachable" "Domain may be inactive"
log_result "Startups.fyi" "https://startups.fyi/" "❌ No submit page" "No /submit endpoint found"
log_result "LaunchingNext" "https://launchingnext.com/" "📝 Contact form" "Submit via their contact page"

echo "" >> "$RESULTS_FILE"
echo "---" >> "$RESULTS_FILE"
echo "**Total directories checked:** 35+" >> "$RESULTS_FILE"
echo "**Automated submissions completed:** 1 (StartupCollections)" >> "$RESULTS_FILE"
echo "**Google Form submissions available:** 1 (NextBigWhat)" >> "$RESULTS_FILE"
echo "**Free badge listing available:** 1 (Postmake)" >> "$RESULTS_FILE"
echo "**Account-requiring directories (manual):** 12+" >> "$RESULTS_FILE"
echo "**Summary:** Direct submission forms are rare — most major directories require account registration or are behind Cloudflare protection. Focus on the accessible ones first, then batch-create accounts for the others." >> "$RESULTS_FILE"

echo "Done! Extended results saved."
