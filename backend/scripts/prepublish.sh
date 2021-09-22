rm -rf src/httpdocs

cd ../frontend
rm -rf build
yarn build

cp -R build ../backend/src/httpdocs
cd ../backend

cp ../*.md .
cp -R ../docs ./docs
