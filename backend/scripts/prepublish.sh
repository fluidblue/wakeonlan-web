# Frontend
cd ../frontend
rm -r build
yarn build
rm -r ../backend/build/httpdocs
cp -R build ../backend/build/httpdocs
cd ../backend

# Docs
rm *.md
cp ../*.md .
rm -r ./docs
cp -R ../docs ./docs

# Backend
tsc
