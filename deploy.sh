#! /bin/bash
echo "clearing directory"
rm -rf * .*

echo "cloning backend"
git clone https://github.com/palpriyanshu/library-backend.git  2> /dev/null
cd library-backend

echo 'installing'
npm install 2> /dev/null
echo 'running backend tests'
npm run test
cd ..

echo 'cloning frontend'
git clone https://github.com/palpriyanshu/Library-react.git  2> /dev/null
cd Library-react

echo 'installing'
npm install 2> /dev/null

echo 'running frontend tests'
npm run test

echo 'creating build'
npm run build 2> /dev/null

mkdir -p ../public

echo 'moving build from frontend to backend'
mv build/* ../public/.
cd ..

mv library-backend/* library-backend/.* .

rm -rf Library-react library-backend