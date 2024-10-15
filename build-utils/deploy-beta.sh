#! /bin/sh
mkdir npm
cd npm

rm -rf *
cp -rf ../npm_package.json ./package.json
cp -rf ../README.md ./README.md
cp -rf ../lib/ ./lib/
cp -rf ../icon.json ./lib/

old_path=src/components/theme-onesait
new_path=packages/theme-onesait/src

mkdir -p ${new_path}

cp -rf ../$old_path/* $new_path
rm -rf $new_path/ThemeOnesait.vue