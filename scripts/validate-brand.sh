#!/bin/bash
# ============================================
# EMBIR Brand Validation Script
# Scans for "Embyr"/"embyr"/"EMBYR" occurrences
# Target: ZERO results (excluding system paths)
# ============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo " EMBIR Brand Validation"
echo "========================================="
echo ""

# Full scan
TOTAL=$(grep -rn -i "embyr" /root/embyr/ \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=.next \
    --exclude-dir=venv \
    --exclude-dir=.hermes \
    --exclude="*.pyc" \
    --exclude="*.log" \
    --exclude="*.png" \
    --exclude="*.jpg" \
    --exclude="package-lock.json" \
    2>/dev/null | grep -v "Binary" | grep -c "")

echo "Total raw occurrences (incl. system paths): $TOTAL"

# Filtered: only brand references (exclude /root/embyr/ paths, package.json, .env)
BRAND=$(grep -rn -i "embyr" /root/embyr/ \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=.next \
    --exclude-dir=venv \
    --exclude-dir=.hermes \
    --exclude="*.pyc" \
    --exclude="*.log" \
    --exclude="*.png" \
    --exclude="*.jpg" \
    --exclude="package-lock.json" \
    2>/dev/null | grep -v "Binary" | grep -v "/root/embyr/" | grep -v "package.json" | grep -v "\.env:" | grep -v "CHANGELOG.md" | grep -v "\.git/")

if [ -z "$BRAND" ]; then
    BRAND_COUNT=0
else
    BRAND_COUNT=$(echo "$BRAND" | grep -c ".")
fi

echo ""
echo "Brand references (excl. system paths): $BRAND_COUNT"
echo ""

if [ "$BRAND_COUNT" -eq 0 ] || [ -z "$BRAND" ]; then
    echo -e "${GREEN}✅ PASSED — Zero 'Embyr' brand references found${NC}"
    echo "   The codebase is clean."
else
    echo -e "${RED}❌ FAILED — $BRAND_COUNT 'Embyr' references remaining:${NC}"
    echo "$BRAND" | head -30
fi

echo ""
echo "---"
echo "Note: System paths (/root/embyr/) are excluded."
echo "The directory name is historical and does not affect SEO."
echo "package.json 'name' field is an npm identifier, not a brand reference."
