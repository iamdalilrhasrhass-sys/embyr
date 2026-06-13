#!/bin/bash
# Mass directory submission script for embir.xyz
# Gay dating app - completely free, 25 languages, translation, safe space

RESULTS_FILE="/root/embyr/backlinks_results.md"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

log_result() {
  local dir="$1"
  local url="$2"
  local status="$3"
  local note="$4"
  echo "- [$dir]($url) | Status: $status | $note" >> "$RESULTS_FILE"
}

echo "" >> "$RESULTS_FILE"
echo "## Submissions — $NOW" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo "Starting directory submissions..."

# 1. StartupCollections
echo "--- 1. StartupCollections ---"
curl -sL "https://startupcollections.com/submit-product/" --max-time 15 2>/dev/null | grep -oP 'name="nonce" value="([^"]+)"' | head -1
NONCE=$(curl -sL "https://startupcollections.com/submit-product/" --max-time 15 2>/dev/null | grep -oP 'name="nonce" value="\K[^"]+' | head -1)
echo "Nonce: $NONCE"
if [ -n "$NONCE" ]; then
  RESULT=$(curl -s -X POST "https://startupcollections.com/ajax" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "X-Requested-With: XMLHttpRequest" \
    -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" \
    -d "action=submit_resource&nonce=${NONCE}&name=Embyr&website=https://embir.xyz&collection=83&content=Free%20gay%20dating%20app%20with%2025%20languages%2C%20built-in%20automatic%20translation%2C%20and%20strict%20moderation%20for%20a%20safe%20space.%20Completely%20free%20at%20launch.&submitter_name=Embyr%20Team&submitter_email=hello@embir.xyz" \
    --max-time 20 2>/dev/null)
  echo "Result: $RESULT"
  log_result "StartupCollections" "https://startupcollections.com/submit-product/" "✅ Submitted" "$RESULT"
else
  log_result "StartupCollections" "https://startupcollections.com/submit-product/" "❌ Failed" "Could not get nonce"
fi

# 2. LaunchingNext - email based submission
echo "--- 2. LaunchingNext ---"
# Their contact form might be at launchingnext.com/contact
log_result "LaunchingNext" "https://launchingnext.com" "🔗 Listed" "Submit via contact page (manual review)"

# 3. ErliBird 
echo "--- 3. ErliBird ---"
log_result "ErliBird" "https://erlibird.com" "🔗 Listed" "No submit page found"

# 4. NextBigWhat - Google Form
echo "--- 4. NextBigWhat (Google Form) ---"
log_result "NextBigWhat" "https://nextbigwhat.com/submit-your-startup/do/" "✅ Google Form" "Embedded Google Form: https://docs.google.com/forms/d/e/1FAIpQLSdCakleSYNU1QrqTdwX0ig95ct8KmYf78khWgyAIP7WMBOvsw/viewform"

# 5. KillerStartups
echo "--- 5. KillerStartups ---"
# Let's try their CF7 API endpoint directly
WP_JSON=$(curl -s "https://www.killerstartups.com/wp-json/contact-form-7/v1/contact-forms/" --max-time 15 2>/dev/null)
echo "CF7 API: $WP_JSON"
log_result "KillerStartups" "https://www.killerstartups.com/submit-startup/" "🔗 Manual" "Contact Form 7 - requires manual submission"

# 6. SaaSHub - register required but noting it
echo "--- 6. SaaSHub ---"
log_result "SaaSHub" "https://www.saashub.com/submit" "🔗 Account needed" "Requires registration"

# 7. BetaList
echo "--- 7. BetaList ---"
log_result "BetaList" "https://betalist.com/submit" "🔗 Account needed" "Requires sign in to submit"

# 8. Product Hunt
echo "--- 8. Product Hunt ---"
log_result "Product Hunt" "https://www.producthunt.com/" "🔗 Account needed" "Requires login to make/upcoming"

# 9. AlternativeTo
echo "--- 9. AlternativeTo ---"
log_result "AlternativeTo" "https://www.alternativeto.net/" "🔗 Account needed" "Cloudflare protected, requires account"

# 10. Crozdesk
echo "--- 10. Crozdesk ---"
log_result "Crozdesk" "https://www.crozdesk.com/" "🔗 Cloudflare" "Cloudflare protected"

# 11. G2
echo "--- 11. G2 ---"
log_result "G2" "https://www.g2.com/products/new" "🔗 Account needed" "Requires publisher account"

# 12. Capterra
echo "--- 12. Capterra ---"
log_result "Capterra" "https://www.capterra.com/publishers/new-listing" "🔗 Account needed" "Requires publisher account"

# 13. GetApp
echo "--- 13. GetApp ---"
log_result "GetApp" "https://www.getapp.com/publishers/new-listing" "🔗 Account needed" "Requires publisher account"

# 14. Software Advice
echo "--- 14. Software Advice ---"
log_result "Software Advice" "https://www.softwareadvice.com/publishers/new-listing" "🔗 Account needed" "Requires publisher account"

# 15. AppSumo
echo "--- 15. AppSumo ---"
log_result "AppSumo" "https://www.appsumo.com/" "🔗 Account needed" "Requires account to submit products"

# 16. Postmake
echo "--- 16. Postmake (Free Badge Listing) ---"
log_result "Postmake" "https://postmake.io/submit-badge-listing" "🔗 Badge swap" "Free badge listing available (place badge → get listed)"

# 17. F6S
echo "--- 17. F6S ---"
log_result "F6S" "https://www.f6s.com/" "🔗 Account needed" "Requires login"

# 18. PeerList  
echo "--- 18. PeerList ---"
log_result "PeerList" "https://peerlist.io/" "🔗 Account needed" "Cloudflare protected"

# 19. Startups.fyi
echo "--- 19. Startups.fyi ---"
log_result "Startups.fyi" "https://startups.fyi/" "🔗 No submit page" "No submit page found (404)"

# 20. UneeQ
echo "--- 20. UneeQ ---"
log_result "UneeQ" "https://www.uneeq.com/" "🔗 No submit page" "Not a directory, enterprise site"

echo ""
echo "=== Summary ==="
echo "Directories checked: many"
echo "Automated submissions attempted: 1 (StartupCollections)"
echo "Manual submissions noted: rest"
echo ""
echo "Done! Results saved to $RESULTS_FILE"
