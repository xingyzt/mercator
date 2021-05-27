cd mercator-studio
zip -r extension.zip icon.png script.js injector.js manifest.json
curl -X POST -s --data-urlencode 'input@script.js' https://javascript-minifier.com/raw > script.min.js
sed -i "s/'/\`/g" script.min.js
sed -i 's/!/(/' script.min.js
sed -i 's/();$/)()/' script.min.js
export BOOKMARKLET="$(cat script.min.js)"
export README="$(cat README)"
rm script.min.js
cd ..
envsubst < index.template.html > index.html
