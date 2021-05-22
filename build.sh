cd mercator-studio
curl -X POST -s --data-urlencode 'input@script.js' https://javascript-minifier.com/raw > script.min.js
sed -i "s/'/\`/g" script.min.js
sed -i 's/\\n\(\\t\)*//g' script.min.js
sed -i 's/!/(/' script.min.js
sed -i 's/();$/)()/' script.min.js
export BOOKMARKLET="$(cat script.min.js)"
export README="$(cat README)"
cd ..
envsubst < index.template.html > index.html
