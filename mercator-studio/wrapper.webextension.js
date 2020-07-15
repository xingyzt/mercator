// Mercator Studio is made by Xing in 2020 under the MIT License
{{script.js}}

if ( window.wrappedJSObject ) {

	// If the browser supports using window.wrappedJSObject to manipulate
	// global variables, just do it.

	await mercator_studio()

} else {
	
	// Else, inject as a script element

	const code = '(' + mercator_studio.toString() +')()'

	const script = document.createElement('script')
	script.textContent = code
	document.documentElement.appendChild(script)
	script.remove()

}
