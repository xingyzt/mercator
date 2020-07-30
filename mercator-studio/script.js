// ==UserScript==
// @name	Google Meet Studio Mini
// @version	1.10.6
// @description	Change how you look on Google Meet.
// @author	Xing <dev@x-ing.space> (https://x-ing.space)
// @copyright	2020, Xing (https://x-ing.space)
// @license	MIT License; https://x-ing.space/mercator/LICENSE
// @namespace	https://x-ing.space
// @homepageURL	https://x-ing.space/mercator
// @icon	https://x-ing.space/mercator/icon.png
// @match	https://meet.google.com/*
// @grant	none
// ==/UserScript==

( async function mercator_studio () {

	'use strict'

	// Create shadow root

	const host = document.createElement('aside')
	const shadow = host.attachShadow({mode: 'open'})

	// Create form

	const main = document.createElement('main')
	main.addEventListener('click',event=>{
		if (
			!main.classList.contains('focus')
			&& event.target !== collapse
		) {
			main.classList.add('focus')
		}
	})

	const collapse = document.createElement('button')
	collapse.textContent = '↑ collapse ↑'
	collapse.id = 'collapse'
	collapse.addEventListener('click',()=>{
		main.classList.remove('focus')
	})

	const form = document.createElement('form')
	const style = document.createElement('style')
	const font_family = `'Google Sans', Roboto, RobotDraft, Helvetica, sans-serif, serif`
	style.textContent = `
* {
	box-sizing: border-box;
	transition: all 200ms;
}
*:not(input) {
	user-select: none;
}
@media (prefers-reduced-motion) {
	* {
		transition: all 0s;
	}
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
	border-radius: 0 0 .75rem 0;
	padding: 1rem 1rem 0 1rem;
	overflow: hidden scroll;
	font-family: ${font_family};
	font-size: 1rem;
	cursor: pointer;
}
button{
	font-family: inherit;
	font-size: .8rem;
}
main #collapse {
	background: white;
	cursor: pointer;
	margin-bottom: .5rem;
}
main.focus {
	transform: none;
	border-radius: 0;
	height: 100vh;
	padding: 1rem;
	cursor: default;
}
#previews {
	margin-top: 1rem;
	height: 3rem;
	display: flex;
}
#previews>video,
#previews>canvas {
	height: 100%;
	width: auto;
	background-image: linear-gradient(90deg,
		hsl( 18, 100%, 68%) 16.7%,	hsl(-10, 100%, 80%) 16.7%,
		hsl(-10, 100%, 80%) 33.3%,	hsl(  5,  90%, 72%) 33.3%,
		hsl(  5,  90%, 72%) 50%,	hsl( 48, 100%, 75%) 50%,
		hsl( 48, 100%, 75%) 66.7%,	hsl( 36, 100%, 70%) 66.7%,
		hsl( 36, 100%, 70%) 83.3%,	hsl( 20,  90%, 70%) 83.3%
	);
	margin-right: 1rem;
}
#previews>h1 {
	flex-grow: 1;
	font-size: 1rem;
	font-weight: normal;
	text-align: center;
	color: #444;
	line-height: 1.5rem;
}
:hover>#previews>h1 {
	transform: translateY(.1rem); /* Tiny nudge downwards */
}
.focus>#previews>h1 {
	display: none;
}
.focus>#previews {
	height: auto;
}
.focus>#previews>* {
	height: auto;
	width: calc(50% - .5rem);
}
#presets,
label {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
#presets>* {
	border: 0;
	background: transparent;
	flex-grow: 1;
}
#presets>:first-child {
	border-radius: 100px 0 0 100px;
}
#presets>:last-child {
	border-radius: 0 100px 100px 0;
}
label {
	height: 2rem;
}
label>*{
	width: 80%;
}
label>*,
#collapse {
	height: 1.5rem;
	border-radius: 100px;
	border: 0.25rem solid lightgray;
}
label>:hover,
#collapse:hover {
	border: 0.25rem solid gray;
}
#presets>:hover {
	background: #0003;
}
#presets>:focus {
	background: black;
	color: white;
}
#presets:focus-within,
#collapse:focus,
label>:focus {
	border-color: black;
}
input[type=text] {
	text-align: center;
	font-family: inherit;
    font-weight: bold;
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
	border-radius: 0.5rem;
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
				input.step = 0.00001
				input.value = 0
			}

			if (
				!['temperature','tint'].includes(key)
				|| !navigator.userAgent.includes('Firefox')
			) {
				// Disable the SVG filters for Firefox
				let label = document.createElement('label')
				label.textContent = input.id = key

				form.append(label)
				label.append(input)
			}
			return [key,input]
		})
	)


    form.addEventListener('wheel',event=>{
        if ( event.target.type=='range' ) {
            event.preventDefault()
            const slider = event.target
            const width = slider.getBoundingClientRect().width
            const dx = -event.deltaX
            const dy = event.deltaY
            const ratio = ( Math.abs(dx) > Math.abs(dy) ? dx : dy ) / width
            const range = slider.max - slider.min
            let old_val = Number(slider.value)
            slider.value = old_val + ratio*range
        }
    })

	const presets_label = document.createElement('label')
	const presets_collection = document.createElement('div')
	presets_collection.id = 'presets'
	const presets = 'reset,concorde,mono,stucco,matcha,deepfry'
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
			if ( input.id !== 'text') {
				input.value = 0
			}
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
			case 'matcha':
				inputs.exposure.value = 0.1
				inputs.tint.value = -0.75
				inputs.sepia.value = 1
				inputs.hue.value = 0.2
				inputs.vignette.value = 0.3
				inputs.fog.value = 0.3
				break
			case 'deepfry':
				inputs.contrast.value = 1
				break
		}
	})

	// Create color balance matrix

	const svgNS = 'http://www.w3.org/2000/svg'
	const svg = document.createElementNS(svgNS,'svg')
	const filter = document.createElementNS(svgNS,'filter')
	filter.id = 'filter'
	const filter_matrix = document.createElementNS(svgNS,'feColorMatrix')
	filter.append(filter_matrix)
	svg.append(filter)

	const previews = document.createElement('div')
	previews.id = 'previews'

	// Create preview video

	const video = document.createElement('video')
	video.setAttribute('playsinline','')
	video.setAttribute('autoplay','')
	video.setAttribute('muted','')

	// Create canvas

	const canvas = document.createElement('canvas')

	// Create title

	const h1 = document.createElement('h1')

	h1.textContent = '↓ Google Meet Studio Mini ↓'

	previews.append(video,canvas,h1)

	// Add UI to page
	form.append(presets_label)

	main.append(collapse,form,previews)

	shadow.append(main,svg)
	document.body.append(host)

	function polynomial_map(value,degree) {
		return (Number(value)+1)**degree
	}

	function percentage(value) {
		return Number(value)*100+'%'
	}

	function signed_pow(value,power){
		let number = Number(value)
		return Math.sign(number)*Math.abs(Number(number))**power
	}

	const amp = 8

	// Background Blur for Google Meet does this (hello@brownfoxlabs.com)

	class mercator_studio_MediaStream extends MediaStream {

		constructor(old_stream) {

			// Copy original stream settings

			super(old_stream)

			video.srcObject = old_stream

			const old_stream_settings = old_stream.getVideoTracks()[0].getSettings()

			const w = old_stream_settings.width
			const h = old_stream_settings.height
			const center = [w/2,h/2]
			canvas.width = w
			canvas.height = h
			const context = canvas.getContext('2d')

			// Amp: for values that can range from 0 to +infinity, amp**value does the mapping.

			let time = video.currentTime

			context.textAlign = 'center'
			context.textBaseline = 'middle'

			function draw(){

				// Avoid drawing the frame frame over and over, unless it's the preview stripes
				if ( !video.srcObject || time != video.currentTime) {
					
					time = video.currentTime
					context.clearRect(0,0,w,h)

					// Get values

					inputs.hue.value %= 1
					inputs.rotate.value %= 1

					let exposure	= percentage(polynomial_map(inputs.exposure.value,2))
					let contrast	= percentage(polynomial_map(inputs.contrast.value,3))
					let temperature = signed_pow(inputs.temperature.value,2)
					let tint	= signed_pow(inputs.tint.value,2)
					let sepia	= percentage(inputs.sepia.value)
					let hue	= 360*Number(inputs.hue.value) + 'deg'
					let saturate	= percentage(amp**inputs.saturate.value)
					let blur	= Number(inputs.blur.value)*w/16 + 'px'
					let fog	= Number(inputs.fog.value)
					let vignette	= Number(inputs.vignette.value)
					let rotate	= Number(inputs.rotate.value)*2*Math.PI
					let scale	= polynomial_map(inputs.scale.value,2)
					let move_x	= Number(inputs.x.value)*w
					let move_y	= Number(inputs.y.value)*h
					let pillarbox	= Number(inputs.pillarbox.value)*w/2
					let letterbox	= Number(inputs.letterbox.value)*h/2
					let text	= inputs.text.value.toString()

					// Color balance

					filter_matrix.setAttribute('values',[
						1+temperature-tint/2,0,0,0,0,
						0,1+tint,0,0,0,
						0,0,1-temperature-tint/2,0,0,
						0,0,0,1,0
					].join(' '))

					// CSS filters

					context.filter = (`
						brightness(${exposure})
						contrast(${contrast})
						${'url(#filter)'.repeat(temperature||tint)}
						sepia(${sepia})
						hue-rotate(${hue})
						saturate(${saturate})
						blur(${blur})
					`)

					// Linear transformations: rotation, scaling, translation

					context.translate(...center)

					if ( rotate ) context.rotate(rotate)

					if ( scale-1 ) context.scale(scale,scale)

					if ( move_x || move_y ) context.translate(move_x,move_y)

					context.translate(-w/2,-h/2)

					// Apply CSS filters & linear transformations

					if (video.srcObject) {
						// Draw video
						context.drawImage(video,0,0,w,h)
					} else {
						// Draw preview stripes if video doesn't exist
						context.fillStyle = 'hsl( 20, 100%, 68%)'
						context.fillRect(0*w/6,0,w/6,h)
						context.fillStyle = 'hsl( 10, 100%, 80%)'
						context.fillRect(1*w/6,0,w/6,h)
						context.fillStyle = 'hsl( 18, 100%, 68%)'
						context.fillRect(2*w/6,0,w/6,h)
						context.fillStyle = 'hsl(  5,  90%, 72%)'
						context.fillRect(3*w/6,0,w/6,h)
						context.fillStyle = 'hsl( 48, 100%, 75%)'
						context.fillRect(4*w/6,0,w/6,h)
						context.fillStyle = 'hsl( 36, 100%, 70%)'
						context.fillRect(5*w/6,0,w/6,h)
					}					
					
					// Apply text without transforms
					
					context.setTransform(1,0,0,1,0,0)

					if ( text ) {
						context.font = `bold ${w}px ${font_family}`
						const vw = 0.9*(w-2*pillarbox)
						const vh = 0.9*(h-2*letterbox)

						const metrics = context.measureText(text)
						const mw = metrics.width
						const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
						const m0w = context.measureText('0').width

						const font_size = Math.min(vw**2/mw,(vh**2)/m0w)
						context.font = `bold ${font_size}px ${font_family}`

						context.lineWidth = font_size/8
						context.strokeStyle = 'black'
						context.fillStyle = 'white'
						context.strokeText(text,...center)
						context.fillText(text,...center)
					}

					// Fog: cover the entire image with a single color

					if ( fog ) {
						let fog_lum = Math.sign(fog)*100
						let fog_alpha = Math.abs(fog)

						context.fillStyle = `hsla(0,0%,${fog_lum}%,${fog_alpha})`
						context.fillRect(0,0,w,h)
					}

					// Vignette: cover the edges of the image with a single color

					if ( vignette ) {
						let vignette_lum = Math.sign(vignette)*100
						let vignette_alpha = Math.abs(vignette)
						let vignette_gradient = context.createRadialGradient(
							...center, 0,
							...center, Math.sqrt((w/2)**2+(h/2)**2)
						)

						vignette_gradient.addColorStop(0, `hsla(0,0%,${vignette_lum}%,0`)
						vignette_gradient.addColorStop(1, `hsla(0,0%,${vignette_lum}%,${vignette_alpha}`)

						context.fillStyle = vignette_gradient
						context.fillRect(0,0,w,h)

					}

					// Pillarbox: crop width

					if ( pillarbox ) {
						context.clearRect(0,0,pillarbox,h)
						context.clearRect(w,0,-pillarbox,h)
					}

					// Letterbox: crop height

					if ( letterbox ) {
						context.clearRect(0,0,w,letterbox)
						context.clearRect(0,h,w,-letterbox)
					}
				}
				
				// Recursive call
				requestAnimationFrame(draw)
			}
			draw()
			const new_stream = canvas.captureStream(30)
			new_stream.addEventListener('inactive',() => {
				old_stream.getTracks().forEach(track => {
					track.stop()
				})
				context.clearRect(0,0,w,h)
				video.srcObject = null
			})
			return new_stream
		}
	}

	async function mercator_studio_getUserMedia ( constraints ) {
		if (constraints && constraints.video && !constraints.audio ) {
			return new mercator_studio_MediaStream(await navigator.mediaDevices.old_getUserMedia(constraints))
		} else {
			return navigator.mediaDevices.old_getUserMedia(constraints)
		}
	}

	MediaDevices.prototype.old_getUserMedia = MediaDevices.prototype.getUserMedia
	MediaDevices.prototype.getUserMedia = mercator_studio_getUserMedia

} ) ()
