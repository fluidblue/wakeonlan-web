# Frontend
rm -rf src/httpdocs
cd ../frontend
rm -rf build
yarn build
cp -R build ../backend/build/httpdocs
cd ../backend

# Docs
cp ../*.md .
cp -R ../docs ./docs

# Backend
tsc
