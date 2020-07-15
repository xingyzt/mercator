// Mercator Studio is made by Xing in 2020 under the MIT License

{{script.js}}

if ( typeof exportFunction != 'undefined' ) {

	console.log('firefox')
	mercator_studio().catch( error => {
		console.log(error)
	})

} else {

	console.log('not firefox')
	const code = '(' + mercator_studio.toString() + ')()'

	const script = document.createElement('script')
	script.textContent = code
	document.documentElement.appendChild(script)
	script.remove()

}
