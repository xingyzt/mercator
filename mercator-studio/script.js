async function() {
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
	overflow: scroll;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: white;
	padding: 1rem;
	transform: translateY(calc(-100% + 4rem));
	box-shadow: 0 0 2rem #0002;
	border-radius: 0 0 1rem 0;
	border: 1px solid #aaa;
	border-top: 0;
	border-left: 0;
	transition: transform 200ms;
}

main:hover {
	transform: none;
	border-radius: 0;
	height: 100vh;
}

#previews {
	margin-top: 1rem;
}

#previews>* {
	height: 3rem;
	width: auto;
	background: magenta;
	transform: scaleX(-1);
}

#previews>:first-child {
	margin-right: 1rem;
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
	form.appendChild(style)

	// Create sliders

	const sliders = Object.fromEntries(
		'exposure,contrast,temperature,tint,sepia,hue,saturate,blur,fog,vignette,rotate,scale,x,y,pillarbox,letterbox'
		.split(',')
		.map( key => {

			let slider = document.createElement('input')

			slider.type = 'range'

			slider.min = [
				'blur',
				'sepia',
				'scale',
				'pillarbox',
				'letterbox'
			].includes(key) ? 0 : -1

			slider.max = 1
			slider.step = 0.01
			slider.value = 0

			let label = document.createElement('label')

			label.textContent = slider.id = key

			form.appendChild(label)
			label.appendChild(slider)

			return [key,slider]
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
		Object.values(sliders).forEach(slider=>{
			slider.value = 0
		})

		switch(event.target.id){
			case 'concorde':
				sliders.saturate.value = 0.1
				sliders.contrast.value = 0.1
				sliders.temperature.value = -0.4
				sliders.tint.value = 0.2
				break
			case 'mono':
				sliders.saturate.value = -1
				sliders.contrast.value = -0.1
				sliders.exposure.value = 0.1
				sliders.vignette.value = -0.5
				break
			case 'stucco':
				sliders.contrast.value = -0.1
				sliders.temperature.value = -0.2
				sliders.tint.value = 0.2
				sliders.sepia.value = 0.2
				sliders.saturate.value = 0.25
				sliders.fog.value = 0.1
				break
			case 'mocha':
				sliders.sepia.value = 1
				sliders.hue.value = .25
				sliders.vignette.value = 0.3
				sliders.fog.value = 0.3
				break
			case 'deepfry':
				sliders.exposure.value = 0.3
				sliders.contrast.value = 1
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
	previews.appendChild(video)

	// Create canvas

	const canvas = document.createElement('canvas')
	previews.appendChild(canvas)

	// Add UI to page

	filter.append(filter_matrix)
	form.append(presets_label)

	main.append(form,previews)

	shadow.append(main,filter)
	document.body.append(host)

	class mercator_studio_MediaStream extends MediaStream {
		constructor(old_stream) {

			// Copy original stream settings

			super(old_stream)

			const constraints = {audio: false, video: true}

			video.srcObject = old_stream

			const old_stream_settings = old_stream.getVideoTracks()[0].getSettings()

			const w = old_stream_settings.width
			const h = old_stream_settings.height
			canvas.width = w
			canvas.height = h
			const canvas_ctx = canvas.getContext('2d')

			// Amp: for values that can range from 0 to +infinity, amp**value does the mapping.

			const amp = 8

			let time = video.currentTime

			function draw(){

				if (time != video.currentTime) {

					// Reset canvas

					canvas_ctx.setTransform(1,0,0,1,0,0)
					canvas_ctx.clearRect(0,0,w,h)

					canvas_ctx.translate(w/2,h/2)

					// Reset values

					sliders.hue.value %= 1
					sliders.rotate.value %= 1


					// BALANCE

					let temperature = sliders.temperature.value**3
					let tint = sliders.tint.value**3

					filter_matrix.setAttribute('values',[
						1+temperature-tint/2,0,0,0,0,
						0,1+tint,0,0,0,
						0,0,1-temperature-tint/2,0,0,
						0,0,0,1,0
					].join(' '))

					// CSS filters

					canvas_ctx.filter = `
brightness(${amp**sliders.exposure.value})
contrast(${amp**sliders.contrast.value})
url('#mercator-studio-svg-filter')
sepia(${sliders.sepia.value*100}%)
hue-rotate(${360*sliders.hue.value}deg)
saturate(${amp**sliders.saturate.value*100}%)
blur(${sliders.blur.value*w/32}px)
`


					// Linear transformations: rotation, scaling, translation

					let rotate = sliders.rotate.value
					if (rotate){

						canvas_ctx.rotate(-rotate*2*Math.PI)

					}

					let scale = amp**sliders.scale.value
					if (scale) {

						canvas_ctx.scale(scale,scale)

					}

					canvas_ctx.translate(-sliders.x.value*w,sliders.y.value*h)

					// Apply CSS filters & linear transformations

					canvas_ctx.translate(-w/2,-h/2)

					canvas_ctx.drawImage(video,0,0,w,h)

					// Fog: cover the entire image with a single color

					let fog = sliders.fog.value
					if (fog) {

						let fog_lum = Math.sign(fog)*100
						let fog_alpha = Math.abs(fog)

						canvas_ctx.fillStyle = `hsla(0,0%,${fog_lum}%,${fog_alpha})`
						canvas_ctx.fillRect(0,0,w,h)

					}

					// Vignette: cover the edges of the image with a single color

					let vignette = sliders.vignette.value
					if (vignette) {

						let vignette_lum = Math.sign(vignette)*100
						let vignette_alpha = Math.abs(vignette)
						let vignette_gradient = canvas_ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, ((w/2)**2+(h/2)**2)**(1/2))

						vignette_gradient.addColorStop(0, `hsla(0,0%,${vignette_lum}%,0`)
						vignette_gradient.addColorStop(1, `hsla(0,0%,${vignette_lum}%,${vignette_alpha}`)

						canvas_ctx.fillStyle = vignette_gradient
						canvas_ctx.fillRect(0,0,w,h)

					}

					// Cropping

					let pillarbox = sliders.pillarbox.value*w/2
					if (pillarbox) {

						canvas_ctx.clearRect(0,0,pillarbox,h)
						canvas_ctx.clearRect(w,0,-pillarbox,h)

					}

					let letterbox = sliders.letterbox.value*h/2
					if (letterbox) {

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

	async function mercator_studio_newGetUserMedia(constraints) {
		if (constraints && constraints.video && !constraints.audio ) {
			return new mercator_studio_MediaStream(await navigator.mediaDevices.mercator_studio_oldGetUserMedia(constraints))
		} else {
			return navigator.mediaDevices.mercator_studio_oldGetUserMedia(constraints)
		}
	}

	MediaDevices.prototype.mercator_studio_oldGetUserMedia = MediaDevices.prototype.getUserMedia
	MediaDevices.prototype.getUserMedia = mercator_studio_newGetUserMedia

}
