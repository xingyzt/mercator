// MERCATOR FILTERS is made by Xing in 2020 under the MIT License

const code = '(' + async function() {
	'use strict'

	// Create form

	const form = document.createElement('form')
	form.id = 'mercator-filters'

	const style = document.createElement('style')
	style.innerText = `
#mercator-filters, form * {
	box-sizing: border-box
}

#mercator-filters {
	position: fixed;
	left: 0;
	top: 0;
	width: 480px;
	max-width: 100vw;
	height: 110vh;
	z-index: 9999999;
	background: #fffa;
	backdrop-filter: blur(1rem);
	padding: 1rem;
	transition: trans#mercator-filters 200ms;
	trans#mercator-filters: translateY(-100vh);
	box-shadow: 0 0 4rem #0004;
	border-bottom-right-radius: 10vh;
}

#mercator-filters:hover {
	trans#mercator-filters: none;
}

#previews {
	position: absolute;
	cursor: pointer;
	width: 400px;
	height: calc(10vh - 1rem);
	bottom: 1rem;
	display: flex;
}

#previews>* {
	height: 100%;
	width: auto;
	background: magenta;
	trans#mercator-filters: scaleX(-1);
}

#previews>:first-child {
	margin-right: 1rem;
}

#mercator-filters:hover>#previews {
	bottom: calc(10vh + 1rem);
	height: fit-content;
}

#mercator-filters:hover>#previews>* {
	width: 50%;
	height: auto;
}

#mercator-filters label {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

#mercator-filters input[type=range] {
	width: 80%;
	-webkit-appearance: none;
	--gradient: transparent, transparent;
	--rainbow: hsl(0, 80%, 75%), hsl(30, 80%, 75%), hsl(60, 80%, 75%), hsl(90, 80%, 75%), hsl(120, 80%, 75%), hsl(150, 80%, 75%), hsl(180, 80%, 75%), hsl(210, 80%, 75%), hsl(240, 80%, 75%), hsl(270, 80%, 75%), hsl(300, 80%, 75%), hsl(330, 80%, 75%);
	background: linear-gradient(90deg, var(--gradient)), linear-gradient(90deg, var(--rainbow));
	border-radius: 100px;
	border: 4px solid lightgray;
}

#mercator-filters input[type=range]:focus{
	border-color: black
}

#mercator-filters input[type=range]::-webkit-slider-thumb {
	-webkit-appearance: none;
	background: white;
	width: 16px;
	height: 16px;
	border: 4px solid black;
	border-radius: 8px
}

#mercator-filters input[type=range]:focus::-webkit-slider-thumb {
	border-color: white;
	background: black;
}

#mercator-filters #exposure,
#mercator-filters #fog,
#mercator-filters #vignette {
	--gradient: black, #8880, white
}

#mercator-filters #contrast {
	--gradient: gray, #8880
}

#mercator-filters #temperature {
	--gradient: #88f, #8880, #ff8
}

#mercator-filters #tint {
	--gradient: #f8f, #8880, #8f8
}

#mercator-filters #sepia {
	--gradient: #8880, #aa8
}

#mercator-filters #hue, #rotate {
	background: linear-gradient(90deg, hsl(0, 80%, 75%), hsl(60, 80%, 75%), hsl(120, 80%, 75%), hsl(180, 80%, 75%), hsl(240, 80%, 75%), hsl(300, 80%, 75%), hsl(0, 80%, 75%), hsl(60, 80%, 75%), hsl(120, 80%, 75%), hsl(180, 80%, 75%), hsl(240, 80%, 75%), hsl(300, 80%, 75%), hsl(0, 80%, 75%))
}

#mercator-filters #saturate {
	--gradient: gray, #8880 50%, blue, magenta
}

#mercator-filters #blur {
	--gradient: #8880, gray
}

#mercator-filters #scale,
#mercator-filters #x,
#mercator-filters #y,
#mercator-filters #pillarbox,
#mercator-filters #letterbox
{
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

			label.innerText = slider.title = slider.id = key

			form.appendChild(label)
			label.appendChild(slider)

			return [key,slider]
		})
	)

	const reset = document.createElement('button')
	reset.innerText = 'reset'
	reset.addEventListener('click',event=>{
		event.preventDefault()
		Object.values(sliders).forEach(slider=>{
			slider.value = 0
		})
	})
	form.appendChild(reset)

	// Create color balance matrix

	const filter = document.createElementNS('http://www.w3.org/2000/svg','filter')
	filter.id = 'mercator-filters-svg-filter'
	const filter_matrix = document.createElementNS('http://www.w3.org/2000/svg','feColorMatrix')
	filter_matrix.setAttribute('in','SourceGraphic')

	const previews = document.createElement('div')
	previews.id = 'previews'
	form.appendChild(previews)

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

	filter.appendChild(filter_matrix)
	form.appendChild(filter)
	document.body.appendChild(form)

	class mercator_filters_MediaStream extends MediaStream {
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
url('#mercator-filters-svg-filter')
url('#mercator-filters-svg-filter')
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

	async function mercator_filters_newGetUserMedia(constraints) {
		if (constraints && constraints.video && !constraints.audio ) {
			return new mercator_filters_MediaStream(await navigator.mediaDevices.mercator_filters_oldGetUserMedia(constraints))
		} else {
			return navigator.mediaDevices.mercator_filters_oldGetUserMedia(constraints)
		}
	}

	MediaDevices.prototype.mercator_filters_oldGetUserMedia = MediaDevices.prototype.getUserMedia
	MediaDevices.prototype.getUserMedia = mercator_filters_newGetUserMedia

} +')()'

const mercator_filter_script = document.createElement('script')
mercator_filter_script.textContent = code
document.documentElement.appendChild(mercator_filter_script)
mercator_filter_script.remove()
