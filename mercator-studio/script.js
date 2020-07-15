async function mercator_studio () {

	'use strict'

	// Create shadow root

	const host = document.createElement('aside')

	const shadow = host.attachShadow({mode: 'open'})

	// Create form

	const main = document.createElement('main')

	const form = document.createElement('form')

	const style = document.createElement('style')

	style.textContent = `
* {
	box-sizing: border-box;
	transition: all 200ms;
}
:focus {
	outline: 0;
}
main {
	z-index: 99999;
	position: fixed;
	left: 0;
	top: 0;
	width: 480px;
	max-width: 100vw;
	height: auto;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: white;
	transform: translateY(calc(-100% + 3rem));
	box-shadow: 0 .1rem .25rem #0004;
	border-radius: 0 0 1rem 0;
	padding: 1rem 1rem 0 1rem;
	overflow-y: scroll;
}
main:hover {
	transform: none;
	border-radius: 0;
	height: 100vh;
	padding: 1rem;
}
#previews {
	margin-top: 1rem;
	height: 3rem
}
#previews>* {
	height: 100%;
	width: auto;
	background: magenta;
}
#previews>:first-child {
	margin-right: 1rem;
}
main:hover>#previews {
	height: auto
	transform: scaleX(-1);
}
main:hover>#previews>* {
	height: auto;
	width: calc(50% - .5rem);
}
#presets,
label {
	display: flex;
	justify-content: space-between;
	align-items: center
}
#presets:focus-within,
input:focus {
	border-color: black
}
#presets>* {
	border: 0;
	background: transparent;
	flex-grow: 1;
}
#presets>:focus {
	background: black;
	color: white
}
#presets>:first-child {
	border-radius: 100px 0 0 100px
}
#presets>:last-child {
	border-radius: 0 100px 100px 0
}
label {
	height: 2rem
}
label>* {
	width: 80%;
	height: 1.5rem;
	border-radius: 100px;
	border: 0.25rem solid lightgray;
}
input[type=text] {
	text-align: center
}
input[type=range] {
	-webkit-appearance: none;
	--gradient: transparent, transparent;
	--rainbow: hsl(0, 80%, 75%), hsl(30, 80%, 75%), hsl(60, 80%, 75%), hsl(90, 80%, 75%), hsl(120, 80%, 75%), hsl(150, 80%, 75%), hsl(180, 80%, 75%), hsl(210, 80%, 75%), hsl(240, 80%, 75%), hsl(270, 80%, 75%), hsl(300, 80%, 75%), hsl(330, 80%, 75%);
	background: linear-gradient(90deg, var(--gradient)), linear-gradient(90deg, var(--rainbow));
}
input[type=range]::-webkit-slider-thumb {
	-webkit-appearance: none;
	background: white;
	width: 1rem;
	height: 1rem;
	border: 0.25rem solid black;
	border-radius: 0.5rem
}
input[type=range]:focus::-webkit-slider-thumb {
	border-color: white;
	background: black;
}
input#exposure,
input#fog,
input#vignette {
	--gradient: black, #8880, white
}
input#contrast {
	--gradient: gray, #8880
}
input#temperature {
	--gradient: #88f, #8880, #ff8
}
input#tint {
	--gradient: #f8f, #8880, #8f8
}
input#sepia {
	--gradient: #8880, #aa8
}
input#hue,
input#rotate {
	background: linear-gradient(90deg, hsl(0, 80%, 75%), hsl(60, 80%, 75%), hsl(120, 80%, 75%), hsl(180, 80%, 75%), hsl(240, 80%, 75%), hsl(300, 80%, 75%), hsl(0, 80%, 75%), hsl(60, 80%, 75%), hsl(120, 80%, 75%), hsl(180, 80%, 75%), hsl(240, 80%, 75%), hsl(300, 80%, 75%), hsl(0, 80%, 75%))
}
input#saturate {
	--gradient: gray, #8880 50%, blue, magenta
}
input#blur {
	--gradient: #8880, gray
}
input#scale,
input#x,
input#y,
input#pillarbox,
input#letterbox {
	--gradient: black, white
}
`
	form.append(style)

	// Create inputs

	const inputs = Object.fromEntries(
		'exposure,contrast,temperature,tint,sepia,hue,saturate,blur,fog,vignette,rotate,scale,x,y,pillarbox,letterbox,text'
		.split(',')
		.map( key => {

			let input = document.createElement('input')

			if ( key == 'text' ) {

				input.type = 'text'
				input.placeholder = 'text'

			} else {
				input.type = 'range'

				input.min = [
					'blur',
					'sepia',
					'scale',
					'pillarbox',
					'letterbox'
				].includes(key) ? 0 : -1

				input.max = 1
				input.step = 0.01
				input.value = 0
			}

			let label = document.createElement('label')

			label.textContent = input.id = key

			form.append(label)
			label.append(input)

			return [key,input]
		})
	)


	const presets_label = document.createElement('label')

	const presets_collection = document.createElement('div')

	presets_collection.id = 'presets'

	const presets = 'reset,concorde,mono,stucco,mocha,deepfry'
		.split(',')
		.map(key=>{
			let preset = document.createElement('button')
			preset.textContent = preset.id = key
			return preset
		})

	presets_label.textContent = 'presets'

	presets_collection.append(...presets)
	presets_label.append(presets_collection)

	presets_label.addEventListener('click',event=>{

		// Cancel refresh
		event.preventDefault()

		// Reset all
		Object.values(inputs).forEach(input=>{
			input.value = 0
		})

		switch(event.target.id){
			case 'concorde':
				inputs.saturate.value = 0.1
				inputs.contrast.value = 0.1
				inputs.temperature.value = -0.4
				inputs.tint.value = 0.2
				break
			case 'mono':
				inputs.saturate.value = -1
				inputs.contrast.value = -0.1
				inputs.exposure.value = 0.1
				inputs.vignette.value = -0.5
				break
			case 'stucco':
				inputs.contrast.value = -0.1
				inputs.temperature.value = -0.2
				inputs.tint.value = 0.2
				inputs.sepia.value = 0.2
				inputs.saturate.value = 0.25
				inputs.fog.value = 0.1
				break
			case 'mocha':
				inputs.exposure.value = 0.1
				inputs.tint.value = -0.75
				inputs.sepia.value = 1
				inputs.hue.value = 0.2
				inputs.vignette.value = 0.3
				inputs.fog.value = 0.3
				break
			case 'deepfry':
				inputs.exposure.value = 0.3
				inputs.contrast.value = 1
				break
		}
	})

	// Create color balance matrix

	const filter = document.createElementNS('http://www.w3.org/2000/svg','filter')
	filter.id = 'mercator-studio-svg-filter'
	const filter_matrix = document.createElementNS('http://www.w3.org/2000/svg','feColorMatrix')
	filter_matrix.setAttribute('in','SourceGraphic')

	const previews = document.createElement('div')
	previews.id = 'previews'

	// Create preview video

	const video = document.createElement('video')
	video.setAttribute('playsinline','')
	video.setAttribute('autoplay','')
	video.setAttribute('muted','')

	// Create canvas

	const canvas = document.createElement('canvas')

	previews.append(video,canvas)

	// Add UI to page

	filter.append(filter_matrix)
	form.append(presets_label)

	main.append(form,previews)

	shadow.append(main,filter)
	document.body.append(host)

	
	// Background Blur for Google Meet does this (hello@brownfoxlabs.com)
	
	class mercator_studio_MediaStream extends MediaStream {
		
		constructor(old_stream) {

			// Copy original stream settings

			super(old_stream)

			const constraints = {audio: false, video: true}

			video.srcObject = old_stream

			const old_stream_settings = old_stream.getVideoTracks()[0].getSettings()

			const w = old_stream_settings.width
			const h = old_stream_settings.height
			const center = [w/2,h/2]
			canvas.width = w
			canvas.height = h
			const canvas_ctx = canvas.getContext('2d')

			// Amp: for values that can range from 0 to +infinity, amp**value does the mapping.

			const amp = 8

			let time = video.currentTime

			canvas_ctx.textAlign = 'center'
			canvas_ctx.textBaseline = 'middle'

			function draw(){

				if (time != video.currentTime) {

					// Get values

					inputs.hue.value %= 1
					inputs.rotate.value %= 1

					let exposure	= amp**inputs.exposure.value
					let contrast	= amp**inputs.contrast.value
					let temperature = inputs.temperature.value**3
					let tint	= inputs.tint.value**3
					let sepia	= inputs.sepia.value*100 + '%'
					let hue	= 360*inputs.hue.value + 'deg'
					let saturate	= amp**inputs.saturate.value*100 + '%'
					let blur	= inputs.blur.value*w/32 + 'px'
					let fog	= inputs.fog.value
					let vignette	= inputs.vignette.value
					let rotate	= -inputs.rotate.value*2*Math.PI
					let scale	= amp**inputs.scale.value
					let move_x	= -inputs.x.value*w
					let move_y	= inputs.y.value*h
					let pillarbox	= inputs.pillarbox.value*w/2
					let letterbox	= inputs.letterbox.value*h/2
					let text	= inputs.text.value

					// Reset canvas

					canvas_ctx.setTransform(1,0,0,1,0,0)
					canvas_ctx.clearRect(0,0,w,h)

					canvas_ctx.translate(w/2,h/2)

					// Color balance

					filter_matrix.setAttribute('values',[
						1+temperature-tint/2,0,0,0,0,
						0,1+tint,0,0,0,
						0,0,1-temperature-tint/2,0,0,
						0,0,0,1,0
					].join(' '))

					// CSS filters

					canvas_ctx.filter = (`
						brightness(${exposure})
						contrast(${contrast})
						url('#mercator-studio-svg-filter')
						sepia(${sepia})
						hue-rotate(${hue})
						saturate(${saturate})
						blur(${blur})
					`)

					// Linear transformations: rotation, scaling, translation

					if ( rotate ) {

						canvas_ctx.rotate(rotate)

					}

					if ( scale-1 ) {

						canvas_ctx.scale(scale,scale)

					}

					if ( move_x || move_y ) {

						canvas_ctx.translate(move_x,move_y)

					}

					// Apply CSS filters & linear transformations

					canvas_ctx.translate(-w/2,-h/2)

					canvas_ctx.drawImage(video,0,0,w,h)

					if ( text ) {

						canvas_ctx.font = `bold ${w}px sans-serif`
						const vw = 0.9*(w-2*pillarbox)
						const vh = 0.9*(h-2*letterbox)

						const metrics = canvas_ctx.measureText(text)
						const mw = metrics.width
						const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
						const m0w = canvas_ctx.measureText('0').width

						const font_size = Math.min(vw**2/mw,(vh**2)/m0w)

						//log.textContent = font_size

						canvas_ctx.font = `bold ${font_size}px sans-serif`

						canvas_ctx.lineWidth = font_size/10
						canvas_ctx.strokeStyle = 'black'
						canvas_ctx.fillStyle = 'white'
						canvas_ctx.strokeText(text,...center)
						canvas_ctx.fillText(text,...center)

					}

					// Fog: cover the entire image with a single color

					if ( fog ) {

						let fog_lum = Math.sign(fog)*100
						let fog_alpha = Math.abs(fog)

						canvas_ctx.fillStyle = `hsla(0,0%,${fog_lum}%,${fog_alpha})`
						canvas_ctx.fillRect(0,0,w,h)
					}

					// Vignette: cover the edges of the image with a single color

					if ( vignette ) {

						let vignette_lum = Math.sign(vignette)*100
						let vignette_alpha = Math.abs(vignette)
						let vignette_gradient = canvas_ctx.createRadialGradient(
							...center, 0,
							...center, Math.sqrt((w/2)**2+(h/2)**2)
						)

						vignette_gradient.addColorStop(0, `hsla(0,0%,${vignette_lum}%,0`)
						vignette_gradient.addColorStop(1, `hsla(0,0%,${vignette_lum}%,${vignette_alpha}`)

						canvas_ctx.fillStyle = vignette_gradient
						canvas_ctx.fillRect(0,0,w,h)

					}

					// Pillarbox: crop width

					if ( pillarbox ) {

						canvas_ctx.clearRect(0,0,pillarbox,h)
						canvas_ctx.clearRect(w,0,-pillarbox,h)

					}

					// Letterbox: crop height

					if ( letterbox ) {

						canvas_ctx.clearRect(0,0,w,letterbox)
						canvas_ctx.clearRect(0,h,w,-letterbox)

					}
				}
				// Recursive call
				requestAnimationFrame(draw)
			}
			draw()
			return canvas.captureStream(30)
		}
	}

	async function mercator_studio_getUserMedia ( constraints ) {
		if (constraints && constraints.video && !constraints.audio ) {
			return new mercator_studio_MediaStream(await navigator.mediaDevices.old_getUserMedia(constraints))
		} else {
			return navigator.mediaDevices.old_getUserMedia(constraints)
		}
	}

	// If the browser supports using exportFunction to manipulate
	// global variables. (Firefox)
	
	try{	
		// Has to do this to change a global object (developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts)
		exportFunction(
			mercator_studio_getUserMedia,
			window.MediaDevices.prototype,
			{ defineAs: 'getUserMedia' }
		)
	
	} catch ( error ) {
		console.log( error )
	}
	
	MediaDevices.prototype.old_getUserMedia = MediaDevices.prototype.getUserMedia
	MediaDevices.prototype.getUserMedia = mercator_studio_getUserMedia

}
