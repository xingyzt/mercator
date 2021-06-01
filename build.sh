zip -r dist/extension.zip src/icon.png src/script.js src/injector.js src/manifest.json

curl -X POST -s --data-urlencode 'input@script.js' https://javascript-minifier.com/raw > dist/bookmarklet.js
sed -i "s/'/\`/g" dist/bookmarklet.js
sed -i 's/!/(/' dist/bookmarklet.js
sed -i 's/();$/)()/' dist/bookmarklet.js

export BOOKMARKLET="$(cat dist/bookmarklet.js)"
export README="$(cat README)"
envsubst < src/template.html > index.html
