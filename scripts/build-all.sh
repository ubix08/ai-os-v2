#!/usr/bin/env bash
# Multi-product build script
# Builds all product variants into dist/<product-id>/

set -e

PRODUCTS=("personal-os" "resume-os" "freelancer-os")

echo "🧹 Cleaning dist..."
rm -rf dist

for PRODUCT in "${PRODUCTS[@]}"; do
  echo "🏗️  Building $PRODUCT..."
  VITE_PRODUCT_ID=$PRODUCT npx vite build --mode production
  mv dist "dist/$PRODUCT"
done

echo ""
echo "✅ All products built!"
echo ""
for PRODUCT in "${PRODUCTS[@]}"; do
  SIZE=$(du -sh "dist/$PRODUCT" | cut -f1)
  echo "  📦 $PRODUCT: $SIZE"
done
echo ""
echo "Deploy each dist/<product-id> directory separately."
