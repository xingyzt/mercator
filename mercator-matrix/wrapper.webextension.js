// MERCATOR MATRIX is made by Xing in 2020 under the MIT License

const code = '(' + {{script.js}} +')()'

const mercator_matrix_script = document.createElement('script')
mercator_matrix_script.textContent = code
document.documentElement.appendChild(mercator_matrix_script)
mercator_matrix_script.remove()
