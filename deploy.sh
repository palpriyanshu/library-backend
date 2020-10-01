#!/bin/bash

git clone https://github.com/palpriyanshu/Library-react.git 2> /dev/null
cd Library-react
echo "installing"
npm install 2> /dev/null
npm run test

cd ..
git clone https://github.com/palpriyanshu/library-backend.git 2> /dev/null
cd library-backend
echo "installing"
npm install 2> /dev/null
npm run test

mkdir ./public

cd ../Library-react
echo "building"
npm run build 2> /dev/null

cp -r ./build/* ../library-backend/public
