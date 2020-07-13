// MERCATOR FILTERS

const code = '(' + {{FILTERS}} +')()'

const mercator_filter_script = document.createElement('script')
mercator_filter_script.textContent = code
document.documentElement.appendChild(mercator_filter_script)
mercator_filter_script.remove()
