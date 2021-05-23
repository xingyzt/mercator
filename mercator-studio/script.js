// ==UserScript==
// @name	Mercator Studio for Google Meet
// @version	2.0.1
// @description	Change how you look on Google Meet.
// @author	Xing <dev@x-ing.space> (https://x-ing.space)
// @copyright	2020-2021, Xing (https://x-ing.space)
// @license	MIT License; https://x-ing.space/mercator/LICENSE
// @namespace	https://x-ing.space
// @homepageURL	https://x-ing.space/mercator
// @icon	https://x-ing.space/mercator/icon.png
// @match	https://meet.google.com/*
// @grant	none
// ==/UserScript==
(async function mercator_studio() {

	'use strict'

	// Create shadow root

	const host = document.createElement('aside')
	host.style.position = 'absolute'
	host.style.zIndex = 10
	const shadow = host.attachShadow({ mode: 'open' })

	const isFirefox = navigator.userAgent.includes('Firefox')

	// Create form

	const main = document.createElement('main')
	const style = document.createElement('style')
	const font_family = `"Google Sans", Roboto, RobotDraft, Helvetica, sans-serif, serif`
	style.textContent = `
* {
	box-sizing: border-box;
	transition-duration: 200ms;
	transition-property: opacity, background, transform, border-radius, border-color;
}
:not(input) {
	user-select: none;
}
@media (prefers-reduced-motion) {
	* {
		transition-duration: 0s;
	}
}
:focus {
	outline: 0;
}
main {
	--bg: #3C4042;
	--dark: black;
	--txt: white;	

	font-family: ${font_family};
	font-size: 0.9rem;
	width: 25rem;
	height: 100vh;
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 0.5rem;
	display: flex;
	flex-direction: column-reverse;
	overflow: hidden;
	pointer-events: none;
}
main>*{
	background: var(--bg);
	color: var(--txt);
	box-shadow: 0 .1rem .25rem #0004;
	border-radius: .5rem;
	pointer-events: all;
}
main>#previews{
	cursor: pointer;
	margin-top: .5rem;
	overflow: hidden;
	display: flex;
	flex: 0 0 auto;
}
main>form{
	display: flex;
	flex-direction: column;
	overflow: hidden scroll;
	padding: 1rem;
	flex: 0 1 auto;
}
:not(.focus)>form{
	opacity: 0;
	pointer-events: none;
}
:not(.focus)>#previews{
	border-radius: 2rem;
	flex-basis: 4rem;
}
button{
	font-family: inherit;
	font-size: .8rem;
	background: transparent;
}
.focus #minimize,
.focus #donate{
	display: none;
}
.minimize #previews {
	width: 1rem;
	padding-right: 0;
}
#minimize,
#donate {
	font-family: inherit;
	font-size: .5rem;
	font-weight: bold;
	color: inherit;
	background: transparent;
	flex: 0 0 1rem;
	width: var(--radius);
	text-align: center;
	border: 0;
	cursor: pointer;
	overflow-wrap: anywhere;
}
#minimize::before,
#donate::before{
	transition-duration: inherit;
	transition-property: margin;
}
#minimize::before{
	content: "◀";
}
#donate::before{
content: "🤍";
}
#minimize:hover::before,
.minimize #minimize::before{
	margin-left: -2px;
	margin-right: 2px;
}
#donate:hover::before{
	margin-right: -2px;
	margin-left: 2px;
}
.minimize #minimize::before{
	content: "▶";
}
.minimize #minimize:hover::before{
	margin-left: 0;
}
#previews>video,
#previews>canvas {
	width: auto;
	height: auto;
	background-image: linear-gradient(90deg,
		hsl( 18, 100%, 68%) 16.7%,	hsl(-10, 100%, 80%) 16.7%,
		hsl(-10, 100%, 80%) 33.3%,	hsl(5,90%, 72%) 33.3%,
		hsl(5,90%, 72%) 50%,	hsl( 48, 100%, 75%) 50%,
		hsl( 48, 100%, 75%) 66.7%,	hsl( 36, 100%, 70%) 66.7%,
		hsl( 36, 100%, 70%) 83.3%,	hsl( 20,90%, 70%) 83.3%
	);
}
#previews>h1 {
	flex-basis: 1rem;
	flex-grow: 1;
	font-size: .9rem;
	font-weight: normal;
	color: inherit;
	display: flex;
	text-align: center;
	align-items: center;
	justify-content: center;
}
#previews:hover>h1 {
	transform: translateY(-.1rem); /* Tiny nudge upwards */
}
.focus>#previews>h1 {
	font-size: 0;
}
.focus>#previews>video,
.focus>#previews>canvas {
	height: auto;
	max-width: 50%;
	object-fit: contain;
}
#presets,
label {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
#presets {
	overflow: hidden;
	height: 1.3rem;
	margin-bottom: -0.15rem;
}
#presets>* {
	border: 0;
	border-radius: 0;
	background: transparent;
	flex-grow: 1;
	color: inherit;
	height: 100%;
}
#presets>:first-child {
	border-radius: 100px 0 0 100px;
}
#presets>:last-child {
	border-radius: 0 100px 100px 0;
}
label+label {
	margin-top: 0.5rem;
	color: inherit;
}
label>*{
	width: calc(100% - 4.5rem);
}
label>* {
	height: 1rem;
	border-radius: 0.5rem;
	border: 0.15rem solid var(--txt);
}
#presets>:hover {
	background: var(--dark);
}
#presets>:focus {
	background: var(--txt);
	color: var(--bg);
}
#presets:focus-within,
label>:focus,
label>:hover {
	border-color: var(--dark);
}
textarea {
	text-align: center;
	font-family: inherit;
	font-weight: bold;
	font-size: 0.8rem;
	resize: none;
	line-height: 1.1;
	overflow: hidden scroll;
	color: inherit;
	background: var(--bg);
	height: auto;
}
textarea::placeholder {
	color: var(--txt);
}
textarea::selection {
	color: var(--dark);
	background: var(--txt);
}
input[type=range] {
	-webkit-appearance: none;
	cursor: ew-resize;
	--gradient: transparent, transparent;
	--rainbow: hsl(0, 80%, 75%), hsl(30, 80%, 75%), hsl(60, 80%, 75%), hsl(90, 80%, 75%), hsl(120, 80%, 75%), hsl(150, 80%, 75%), hsl(180, 80%, 75%), hsl(210, 80%, 75%), hsl(240, 80%, 75%), hsl(270, 80%, 75%), hsl(300, 80%, 75%), hsl(330, 80%, 75%);
	background: linear-gradient(90deg, var(--gradient)), linear-gradient(90deg, var(--rainbow));
}
input[type=range]::-webkit-slider-thumb {
	-webkit-appearance: none;
	background: var(--bg);
	width: 1rem;
	height: 1rem;
	border: 0.1rem solid var(--txt);
	transform: scale(1.5);
	border-radius: 100%;
}
input[type=range]:hover::-webkit-slider-thumb {
	background: var(--dark);
}
input[type=range]:focus::-webkit-slider-thumb {
	border-color: var(--dark);
	background: var(--txt);
}
input#light,
input#fade,
input#vignette {
	--gradient: black, #8880, white
}
input#contrast {
	--gradient: gray, #8880
}
input#warmth {
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
input#color {
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

	const minimize = document.createElement('button')
	minimize.id = 'minimize'
	minimize.title = 'toggle super tiny mode'
	minimize.addEventListener('click', event => {
		event.stopPropagation()
		main.classList.toggle('minimize')
	})
	const donate = document.createElement('button')
	donate.id = 'donate'
	donate.title = 'donate to the developer'
	donate.addEventListener('click', () => {
		window.open('https://ko-fi.com/xingyzt')
	})

	const form = document.createElement('form')

	// Create inputs

	const default_values = {
		light: 0,
		contrast: 0,
		warmth: 0,
		tint: 0,
		sepia: 0,
		hue: 0,
		saturate: 0,
		blur: 0,
		fade: 0,
		vignette: 0,
		rotate: 0,
		scale: 0,
		pan: 0,
		tilt: 0,
		pillarbox: 0,
		letterbox: 0,
		text: '',
		mirror: false,
		freeze: false,
		presets: 'reset',
	}

	const saved_values = JSON.parse(window.localStorage.getItem('mercator-studio-values-20')) || {}

	const preset_values = {
		reset: {},
		concorde: {
			contrast: 0.1,
			warmth: -0.25,
			tint: -0.05,
			color: 0.2,
		},
		mono: {
			light: 0.1,
			contrast: -0.1,
			sepia: 0.8,
			color: -1,
			vignette: -0.5,
		},
		matcha: {
			light: 0.1,
			tint: -0.75,
			sepia: 1,
			hue: 0.2,
			vignette: 0.3,
			fade: 0.3,
		},
		deepfry: {
			contrast: 1,
			color: 0.5,
		}
	}

	// Clone default values into updating object
	const values = {
		...default_values,
		...saved_values
	}

	const inputs = Object.fromEntries(
		Object.entries(values)
		.map(([key, value]) => {
			let input
			switch (key) {
				case 'text':
					input = document.createElement('textarea')
					input.rows = 3
					input.placeholder = '\n🌈 Write text here 🌦️'
					input.addEventListener('input', () => {
						// String substitution
						update_values(input, (input.value + '')
							.replace(/--/g, '―')
							.replace(/\\sqrt/g, '√')
							.replace(/\\pm/g, '±')
							.replace(/\\times/g, '×')
							.replace(/\\cdot/g, '·')
							.replace(/\\over/g, '∕')
							// Numbers starting with ^ (superscript) or _ (subscript)
							.replace(/(\^|\_)(\d+)/g, (_, sign, number) =>
								number.split('').map(digit =>
									String.fromCharCode(digit.charCodeAt(0) + (
										// Difference in character codes between subscript numbers and their regular equivalents.
										sign === '_' ? 8272 :
										// Superscript 1, 2 & 3 are in separate ranges.
										digit === '1' ? 136 :
										'23'.includes(digit) ? 128 : 8256
									))
								).join('')
							)
						)
					})
					break
				case 'mirror':
				case 'freeze':
					input = document.createElement('input')
					input.type = 'checkbox'
					input.addEventListener('change', () =>
						update_values(input, input.checked)
					)
					break
				case 'presets':
					input = document.createElement('label')
					input.append(...Object.keys(preset_values).map(key => {
						const button = document.createElement('button')
						button.textContent = key
						button.addEventListener('click', event => {
							event.preventDefault()
							Object.entries({...default_values,...preset_values[key]})
								.forEach(([key, value]) => update_values(inputs[key], value))
						})
						return button
					}))
					break
				default:
					input = document.createElement('input')
					input.type = 'range'

					// These inputs go from 0 to 1, the rest -1 to 1
					input.min = [
						'blur',
						'sepia',
						'scale',
						'pillarbox',
						'letterbox'
					].includes(key) ? 0 : -1
					input.max = 1

					// Use 32 steps normally, 128 if CTRL, 512 if SHIFT
					const range = input.max - input.min
					input.step = range / 32
					input.addEventListener('keydown', ({
						ctrlKey,
						shiftKey
					}) => {
						input.step = range / (shiftKey ? 512 : ctrlKey ? 128 : 32)
					})
					input.addEventListener('keyup', () =>
						input.step = range / 32
					)

					input.addEventListener('input', () =>
						update_values(input, input.valueAsNumber)
					)
					// Scroll to change values
					input.addEventListener('wheel', event => {
						event.preventDefault()
						input.focus()
						const width = input.getBoundingClientRect().width
						const dx = -event.deltaX
						const dy = event.deltaY
						const ratio = (Math.abs(dx) > Math.abs(dy) ? dx : dy) / width
						const range = input.max - input.min
						const raw_value = input.valueAsNumber + ratio * range
						const clamped_value = Math.min(Math.max(raw_value, input.min), input.max)
						const stepped_value = Math.round(clamped_value / input.step) * input.step
						const value = stepped_value
						update_values(input, value)
					})

					// Right click to individually reset
					input.addEventListener('contextmenu', event => {
						event.preventDefault()
						update_values(input, default_values[input.id] )
					})
			}

			input.classList.add('input')
			input.value = value

			if (!(isFirefox && ['warmth', 'tint'].includes(key))) {
				// Disable the SVG filters for Firefox
				let label = document.createElement('label')
				label.textContent = input.id = key

				form.append(label)
				label.append(input)
			}
			return [key, input]
		})
	)

	function update_values(input, value) {
		values[input.id] = input.value = value
		window.localStorage.setItem('mercator-studio-values-20', JSON.stringify(values))
	}

	// Create color balance matrix
	const svgNS = 'http://www.w3.org/2000/svg'
	const svg = document.createElementNS(svgNS, 'svg')
	const filter = document.createElementNS(svgNS, 'filter')
	filter.id = 'filter'
	const component_transfer = document.createElementNS(svgNS, 'feComponentTransfer')
	const components = Object.fromEntries(
		['R', 'G', 'B'].map(hue => {
			const func = document.createElementNS(svgNS, 'feFunc' + hue)
			func.setAttribute('type', 'table')
			func.setAttribute('tableValues', '0 1')
			return [hue, func]
		}))
	component_transfer.append(...Object.values(components))
	filter.append(component_transfer)
	svg.append(filter)

	// Create previews
	const previews = document.createElement('div')
	previews.id = 'previews'
	previews.addEventListener('click', () =>
		main.classList.toggle('focus')
	)

	// Create preview video
	const video = document.createElement('video')
	video.setAttribute('playsinline', '')
	video.setAttribute('autoplay', '')
	video.setAttribute('muted', '')

	// Create canvases
	const canvases = Object.fromEntries(['buffer', 'freeze', 'display'].map(name => {
		const element = document.createElement('canvas')
		const context = element.getContext('2d')
		return [name, {
			element,
			context
		}]
	}))

	// Create title
	const h1 = document.createElement('h1')
	h1.innerHTML = 'Mercator Studio'

	previews.append(minimize, video, h1, canvases.buffer.element, donate)

	// Add UI to page
	main.append(style, previews, form)
	shadow.append(main, svg)
	document.body.append(host)

	// Define mappings of linear values
	const polynomial_map = (value, degree) => (value + 1) ** degree
	const polynomial_table = (factor, steps = 32) => Array(steps).fill(0)
		.map((_, index) => Math.pow(index / (steps - 1), 2 ** factor)).join(' ')
	const percentage = (value) => value * 100 + '%'

	const amp = 8

	let task = 0

	// Background Blur for Google Meet does this (hello@brownfoxlabs.com)

	class mercator_studio_MediaStream extends MediaStream {

		constructor(old_stream) {

			// Copy original stream settings

			super(old_stream)

			video.srcObject = old_stream

			const old_stream_settings = old_stream.getVideoTracks()[0].getSettings()

			const w = old_stream_settings.width
			const h = old_stream_settings.height
			const center = [w / 2, h / 2]
			Object.values(canvases).forEach(canvas => {
				canvas.element.width = w
				canvas.element.height = h
			})
			const canvas = canvases.buffer.buffer
			const context = canvases.buffer.context
			const freeze = {
				state: false,
				init: false,
				image: document.createElement('img'),
				canvas: canvases.freeze,
			}
			inputs.freeze.addEventListener('change', e => {
				freeze.state = freeze.init = e.target.checked
			})

			// Amp: for values that can range from 0 to +infinity, amp**value does the mapping.

			context.textAlign = 'center'
			context.textBaseline = 'middle'

			function draw() {

				context.clearRect(0, 0, w, h)

				// Get values

				inputs.hue.value %= 1
				inputs.rotate.value %= 1

				let v = values

				let light = percentage(polynomial_map(v.light, 2))
				let contrast = percentage(polynomial_map(v.contrast, 3))
				let warmth = isFirefox ? 0 : v.warmth
				let tint = isFirefox ? 0 : v.tint
				let sepia = percentage(v.sepia)
				let hue = 360 * v.hue + 'deg'
				let saturate = percentage(amp ** v.saturate)
				let blur = v.blur * w / 16 + 'px'
				let fade = v.fade
				let vignette = v.vignette
				let rotate = v.rotate * 2 * Math.PI
				let scale = polynomial_map(v.scale, 2)
				let mirror = v.mirror
				let move_x = v.pan * w
				let move_y = v.tilt * h
				let pillarbox = v.pillarbox * w / 2
				let letterbox = v.letterbox * h / 2
				let text = v.text.split('\n')

				// Color balance

				components.R.setAttribute('tableValues', polynomial_table(-warmth + tint / 2))
				components.G.setAttribute('tableValues', polynomial_table(-tint))
				components.B.setAttribute('tableValues', polynomial_table( warmth + tint / 2))

				// CSS filters

				context.filter = (`
					brightness(${light})
					contrast(${contrast})
					${'url(#filter)'.repeat(Boolean(warmth||tint))}
					sepia(${sepia})
					hue-rotate(${hue})
					saturate(${saturate})
					blur(${blur})
				`)

				// Linear transformations: rotation, scaling, translation
				context.translate(...center)
				if (rotate) context.rotate(rotate)
				if (scale - 1) context.scale(scale, scale)
				if (mirror) context.scale(-1, 1)
				if (move_x || move_y) context.translate(move_x, move_y)
				context.translate(-w / 2, -h / 2)

				// Apply CSS filters & linear transformations
				if (freeze.init) {
					freeze.canvas.context.drawImage(video, 0, 0, w, h)
					let data = freeze.canvas.element.toDataURL('image/png')
					freeze.image.setAttribute('src', data)
					freeze.init = false
				} else if (freeze.state) {
					// Draw frozen image
					context.drawImage(freeze.image, 0, 0, w, h)
				} else if (video.srcObject) {
					// Draw video
					context.drawImage(video, 0, 0, w, h)
				} else {
					// Draw preview stripes if video doesn't exist
					'18, 100%, 68%; -10,100%,80%; 5, 90%, 72%; 48, 100%, 75%; 36, 100%, 70%; 20, 90%, 70%'
					.split(';')
						.forEach((color, index) => {
							context.fillStyle = `hsl(${color})`
							context.fillRect(index * w / 6, 0, w / 6, h)
						})
				}

				// Clear transforms & filters
				context.setTransform(1, 0, 0, 1, 0, 0)
				context.filter = 'brightness(1)'

				// Fade: cover the entire image with a single color
				if (fade) {
					let fade_lum = Math.sign(fade) * 100
					let fade_alpha = Math.abs(fade)

					context.fillStyle = `hsla(0,0%,${fade_lum}%,${fade_alpha})`
					context.fillRect(0, 0, w, h)
				}

				// Vignette: cover the edges of the image with a single color
				if (vignette) {
					let vignette_lum = Math.sign(vignette) * 100
					let vignette_alpha = Math.abs(vignette)
					let vignette_gradient = context.createRadialGradient(
						...center, 0,
						...center, Math.sqrt((w / 2) ** 2 + (h / 2) ** 2)
					)

					vignette_gradient.addColorStop(0, `hsla(0,0%,${vignette_lum}%,0`)
					vignette_gradient.addColorStop(1, `hsla(0,0%,${vignette_lum}%,${vignette_alpha}`)

					context.fillStyle = vignette_gradient
					context.fillRect(0, 0, w, h)

				}

				// Pillarbox: crop width
				if (pillarbox) {
					context.clearRect(0, 0, pillarbox, h)
					context.clearRect(w, 0, -pillarbox, h)
				}

				// Letterbox: crop height
				if (letterbox) {
					context.clearRect(0, 0, w, letterbox)
					context.clearRect(0, h, w, -letterbox)
				}

				// Text:
				if (text) {

					// Find out the font size that just fits

					const vw = 0.9 * (w - 2 * pillarbox)
					const vh = 0.9 * (h - 2 * letterbox)

					context.font = `bold ${vw}px ${font_family}`

					let char_metrics = context.measureText('0')
					let line_height = char_metrics.actualBoundingBoxAscent + char_metrics.actualBoundingBoxDescent
					let text_width = text.reduce(
						(max_width, current_line) => Math.max(
							max_width,
							context.measureText(current_line).width
						), 0 // Accumulator starts at 0
					)

					const font_size = Math.min(vw ** 2 / text_width, vh ** 2 / line_height / text.length)

					// Found the font size. Time to draw!

					context.font = `bold ${font_size}px ${font_family}`

					char_metrics = context.measureText('0')
					line_height = 1.5 * (char_metrics.actualBoundingBoxAscent + char_metrics.actualBoundingBoxDescent)

					context.lineWidth = font_size / 8
					context.strokeStyle = 'black'
					context.fillStyle = 'white'

					text.forEach((line, index) => {
						let x = center[0]
						let y = center[1] + line_height * (index - text.length / 2 + 0.5)
						context.strokeText(line, x, y)
						context.fillText(line, x, y)
					})
				}

				canvases.display.context.clearRect(0, 0, w, h)
				canvases.display.context.drawImage(canvases.buffer.element, 0, 0)
			}
			clearInterval(task)
			task = setInterval(draw, 33)
			const new_stream = canvases.display.element.captureStream(30)
			new_stream.addEventListener('inactive', () => {
				old_stream.getTracks().forEach(track => {
					track.stop()
				})
				canvases.display.context.clearRect(0, 0, w, h)
				video.srcObject = null
			})
			return new_stream
		}
	}

	MediaDevices.prototype.old_getUserMedia = MediaDevices.prototype.getUserMedia
	MediaDevices.prototype.getUserMedia = async constraints =>
		(constraints && constraints.video && !constraints.audio) ?
		new mercator_studio_MediaStream(await navigator.mediaDevices.old_getUserMedia(constraints)) :
		navigator.mediaDevices.old_getUserMedia(constraints)
})()
