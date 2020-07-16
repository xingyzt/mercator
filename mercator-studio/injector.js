// Mercator Studio is made by Xing in 2020 under the MIT License

const host = document.createElement('aside')
const shadow = host.attachShadow({mode:'closed'})
const script = document.createElement('script')
script.src = chrome.runtime.getURL('script.js')
shadow.append(script)
document.body.append(host)

// Thanks to Rob--W on Github.
