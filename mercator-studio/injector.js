const host = document.createElement('aside')
const shadow = host.attachShadow({mode:'closed'})
const script = document.createElement('script')
script.src = chrome.runtime.getURL('script.js')
shadow.append(script)
document.body.append(host)
// Thanks to Rob Wu (github.com/Rob--W) for fixing this
