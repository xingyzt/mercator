// Mercator Studio is made by Xing in 2020 under the MIT License

const code = '(' + {{script.js}} +')()'

const script = document.createElement('script')
script.textContent = code
document.documentElement.appendChild(script)
script.remove()
