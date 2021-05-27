// ==UserScript==
// @name	Mercator Studio for Google Meet
// @version	2.1.1
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
try{
	'use strict'

	// Create shadow root

	const host = document.createElement('aside')
	host.style.position = 'absolute'
	host.style.zIndex = 10
	host.style.pointerEvents = 'none'
	const shadow = host.attachShadow({ mode: 'open' })

	const isFirefox = navigator.userAgent.includes('Firefox')

	// Create form

	const main = document.createElement('main')
	const style = document.createElement('style')
	const body_fonts = 'Roboto, RobotDraft, Helvetica, sans-serif, serif'
	const display_fonts = '"Google Sans", ' + body_fonts
	style.textContent = `
a, button {
	all: unset;
	cursor: pointer;
	text-align: center;
}
main, main *, a, button {
	box-sizing: border-box;
	transition-duration: 200ms;
	transition-property: opacity, background, transform, padding, border-radius, border-color;

	color: inherit;
	font-family: inherit;
	font-size: inherit;
	font-weight: inherit;
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

/* -- */

main {
	--bg: #3C4042;
	--bg-x: #434649;
	--bg-xx: #505457;
	--dark: black;
	--txt: white;	

	font-family: ${display_fonts};
	font-size: 0.9rem;
	width: 25rem;
	max-width: 100vw;
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
main > * {
	color: var(--txt);
}
#fields,
#bar,
#labels > * {
	border-radius: .5rem;
	box-shadow: 0 .1rem .25rem #0004;
	pointer-events: all;
}
:not(.edit)>#fields{
	opacity: 0;
	pointer-events: none;
}
:not(.edit)>#bar{
	border-radius: 1.5rem;
	flex-basis: 4rem;
}
#text:hover, #text:focus,
#presets:hover,
#bar>:hover, #bar>:focus {
	background: var(--bg-x);
}
#text:hover:focus,
#presets:hover,
#bar>:hover:focus {
	background: var(--bg-xx);
}

/* -- */

#tips {
	position: relative;
	font-family: ${body_fonts};
	font-size: 0.8rem;
	z-index: 10;
}
#tips > * {
	display: block;
	position: absolute;
	bottom: 0rem;
	height: 1.5rem;
	padding: 0.25rem;
	border-radius: 0.25rem;
}
#tips > :not(.show) {
	opacity: 0;
}
#tips > [for="minimize"] {
	left: 0;
}
#tips > [for="previews"] {
	left: 50%;
	transform: translateX(-50%);
}
#tips > [for="donate"] {
	right: 0;
}
.edit > #tips > * {
	top: 1rem;
}

/* -- */

#bar {
	margin-top: .5rem;
	overflow: hidden;
	flex: 0 0 auto;
	display: flex;
}
.minimize #bar {
	width: 1rem;
}
#bar > *,
#tips > * {
	background: var(--bg);
}
#bar #minimize,
#bar #donate {
	font-size: .5rem;
	flex: 0 0 1.5rem;
	width: var(--radius);
	text-align: center;
	line-height: 4rem;
	height: 100%;
	overflow-wrap: anywhere;
}
.edit #bar #minimize,
.edit #bar #donate,
.edit #bar h2,
.minimize #bar :not(#minimize) {
	display: none;
}
:not(.minimize) #minimize:hover,
.minimize #minimize:not(:hover) {
	padding-right: 2px;
}
#donate:hover {
	padding-left: 2px;
}
.minimize #minimize{
	flex-basis: 1rem;
}
#previews {
	flex: 1 0 0;
	width: 0;
	display: flex;
}
#previews video,
#previews canvas {
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
.edit #previews video,
.edit #previews canvas {
	height: auto;
	max-width: 50%;
	object-fit: contain;
}
#previews>h2 {
	flex-grow: 1;
	font-size: .9rem;
	line-height: 1.4;
	display: flex;
	text-align: center;
	align-items: center;
	justify-content: center;
}
#previews:hover>h2 {
	transform: translateY(-2px);
}

/* -- */

#fields {
	display: flex;
	flex-direction: column;
	overflow: hidden scroll;
	padding: 1rem;
	flex: 0 1 auto;
	background: var(--bg);
}
#presets,
#fields > label {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
#fields > label+label {
	margin-top: 0.5rem;
}
#fields > label:focus-within{
	font-weight: bold;
}
#fields > label > * {
	width: calc(100% - 4.5rem);
	height: 1rem;
	border-radius: 0.5rem;
	border: 0.15rem solid var(--bg-x);
	font-size: 0.8rem;
}
#presets {
	overflow: hidden;
	height: auto;
	margin-bottom: -0.15rem;
}
#presets>* {
	border: 0;
	border-radius: 0;
	background: transparent;
	flex-grow: 1;
	height: 1.3rem;
	font-weight: normal;
}
#presets>:first-child {
	border-radius: 0.25rem 0 0 0.25rem;
}
#presets>:last-child {
	border-radius: 0 0.25rem 0.25rem 0;
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
	border-width: 0.15rem;
	border-color: var(--txt);
}
#fields > label > #text {
	text-align: center;
	font-weight: bold;
	resize: none;
	line-height: 1.1;
	overflow: hidden scroll;
	background: var(--bg);
	height: auto;
}
#text::placeholder {
	color: inherit;
}
#text::selection {
	color: var(--dark);
	background: var(--txt);
}
input[type=checkbox] {
	cursor: pointer;
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
	background: var(--bg-x);
}
input[type=range]:focus::-webkit-slider-thumb {
	border-color: var(--bg);
	background: var(--txt);
}
input[type=range]::-moz-range-thumb {
	background: var(--bg);
	width: 1rem;
	height: 1rem;
	border: 0.1rem solid var(--txt);
	transform: scale(1.5);
	border-radius: 100%;
	box-sizing: border-box;
}
input[type=range]:hover::-moz-range-thumb {
	background: var(--bg-x);
}
input[type=range]:focus::-moz-range-thumb {
	border-color: var(--bg);
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
input#warmth,
input#tilt {
	--gradient: #88f, #8880, #ff8
}
input#tint,
input#pan {
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
input#pillarbox,
input#letterbox {
	--gradient: black, white
}
`

	const fields = document.createElement('section')
	fields.id= 'fields'

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
			saturate: 0.2,
		},
		mono: {
			light: 0.1,
			contrast: -0.1,
			sepia: 0.8,
			saturate: -1,
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
			saturate: 0.5,
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
						set_value(input, (input.value + '')
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
						set_value(input, input.checked)
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
								.forEach(([key, value]) => set_value(inputs[key], value))
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
					input.addEventListener('keydown', ({ code, ctrlKey, shiftKey }) => {
						if(code === 'Digit0') reset_value(input)
						input.step = range / (shiftKey ? 512 : ctrlKey ? 128 : 32)
					})
					input.addEventListener('keyup', () =>
						input.step = range / 32
					)

					input.addEventListener('input', () => {
						input.focus()
						set_value(input, input.valueAsNumber)
					})

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
						set_value(input, value)
					})

					// Right click to individually reset
					input.addEventListener('contextmenu', event => {
						event.preventDefault()
						reset_value(input)
					})
			}

			input.value = value

			if (!(isFirefox && ['warmth', 'tint'].includes(key))) {
				// Disable the SVG filters for Firefox
				let label = document.createElement('label')
				label.textContent = input.id = key

				fields.append(label)
				label.append(input)
			}
			return [key, input]
		})
	)

	function set_value(input, value) {
		values[input.id] = input.value = value
		window.localStorage.setItem('mercator-studio-values-20', JSON.stringify(values))
	}
	function reset_value(input) {
		set_value(input, default_values[input.id])
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

	// Create labels
	
	const minimize_tip = document.createElement('label')
	minimize_tip.htmlFor = 'minimize'
	minimize_tip.dataset.off = 'Minimize previews (ctrl + shift + m)'
	minimize_tip.dataset.on = 'Open previews (ctrl + shift + m)'
	minimize_tip.textContent = minimize_tip.dataset.off

	const previews_tip = document.createElement('label')
	previews_tip.htmlFor = 'previews'
	previews_tip.dataset.off = 'Open studio (ctrl + m)'
	previews_tip.dataset.on = 'Close studio (ctrl + m)'
	previews_tip.textContent = previews_tip.dataset.off

	const donate_tip = document.createElement('label')
	donate_tip.htmlFor = 'donate'
	donate_tip.textContent = 'Donate to the dev'

	const tips = document.createElement('section')
	tips.id = 'tips'
	tips.append(minimize_tip,previews_tip,donate_tip)

	// Mimic Google Meet tooltip behavior where hover gets priority over focused
	const update_tips = () => {
		tips.querySelectorAll('.show').forEach(tip=>tip.classList.remove('show'))
		const show = tips.querySelector('.hover') || tips.querySelector('.focus')
		if(show) show.classList.add('show')
	}
	const link_tip = ( original, tip ) => {
		original.addEventListener('mouseenter',()=>{
			tip.classList.add('hover')
			update_tips()
		})
		original.addEventListener('mouseleave',()=>{
			tip.classList.remove('hover')
			update_tips()
		})
		original.addEventListener('focus',()=>{
			tip.classList.add('focus')
			update_tips()
		})
		original.addEventListener('blur',()=>{
			tip.classList.remove('focus')
			update_tips()
		})
	}

	// create bottom bar

	const bar = document.createElement('section')
	bar.id = 'bar'

	const minimize = document.createElement('button')
	minimize.id = 'minimize'
	minimize.textContent = '◀'
	const toggleMinimize = () => {
		main.classList.remove('edit')
		main.classList.toggle('minimize')
		minimize.focus()
		const state = main.classList.contains('minimize')
		minimize.textContent = state ? '▶' : '◀'
		minimize_tip.textContent = minimize_tip.dataset[ state ? 'on' : 'off' ]
		minimize_tip.classList.remove('focus')
		update_tips()
	}
	minimize.addEventListener('click', toggleMinimize)
	link_tip(minimize,minimize_tip)

	const donate = document.createElement('a')
	donate.id = 'donate'
	donate.href = 'https://ko-fi.com/xingyzt'
	donate.target = '_blank'
	donate.textContent = '🤍'
	link_tip(donate,donate_tip)


	// Create previews
	const previews = document.createElement('button')
	previews.id = 'previews'
	const toggleEdit = () => {
		main.classList.remove('minimize')
		main.classList.toggle('edit')
		previews.focus()
		const state = main.classList.contains('edit')
		state ? Object.values(inputs)[0].focus() : previews.focus()
		previews_tip.textContent = previews_tip.dataset[state ? 'on' : 'off']
		previews_tip.classList.remove('focus')
		update_tips()
	}
	previews.addEventListener('click', toggleEdit)
	link_tip(previews,previews_tip)

	// Ctrl+m to toggle
	window.addEventListener('keydown', event => {
		if (event.code=='KeyM' && event.ctrlKey) {
			event.preventDefault()
			event.shiftKey ? toggleMinimize(event) : toggleEdit(event)
		}
	})

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
	const title = document.createElement('h2')
	title.id = 'title'
	title.innerText = 'Mercator\nStudio'

	previews.append(video, title, canvases.buffer.element)
	bar.append(minimize, previews, donate)

	// Add UI to page
	main.append(bar, tips, fields)
	shadow.append(main, style, svg)
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

					context.font = `bold ${vw}px ${display_fonts}`

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

					context.font = `bold ${font_size}px ${display_fonts}`

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
}catch(e){alert(e)}
})()
