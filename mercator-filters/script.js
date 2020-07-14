async function() {
    'use strict'

    const canvas = document.createElement('canvas')


    // Create form

    const form = document.createElement('form')

    const style = document.createElement('style')
    style.innerText = `
form{
position: fixed;
left: 0;
top: 0;
width: 400px;
z-index: 9999999;
background: #fff8;
backdrop-filter: blur(1rem);
border-radius: 0 0 1vmin 0;
padding: 1rem;
transition: opacity 200ms;
opacity: .2
}

label{
display: flex;
justify-content: space-between
}

input{
width: 300px;
-webkit-appearance: none;
--gradient: transparent, transparent;
--rainbow:
hsl(0,80%,75%),
hsl(30,80%,75%),
hsl(60,80%,75%),
hsl(90,80%,75%),
hsl(120,80%,75%),
hsl(150,80%,75%),
hsl(180,80%,75%),
hsl(210,80%,75%),
hsl(240,80%,75%),
hsl(270,80%,75%),
hsl(300,80%,75%),
hsl(330,80%,75%);

background:
linear-gradient(90deg,var(--gradient)),
linear-gradient(90deg,var(--rainbow));

border-radius: 100px
}

input#exposure,
input#fog,
input#vignette
{
--gradient: black,#8880,white
}

input#contrast{
--gradient: gray, #8880
}

input#temperature{
--gradient: #4af, #8880, #fa4
}

input#tint{
--gradient: #f8f, #8880, #8f8
}

input#sepia{
--gradient: #8880, #aa8
}

input#hue,
input#rotate{

background: linear-gradient(90deg,hsl(0,80%,75%),
hsl(30,80%,75%),
hsl(60,80%,75%),
hsl(90,80%,75%),
hsl(120,80%,75%),
hsl(150,80%,75%),
hsl(180,80%,75%),
hsl(210,80%,75%),
hsl(240,80%,75%),
hsl(270,80%,75%),
hsl(300,80%,75%),
hsl(330,80%,75%),
hsl(0,80%,75%),
hsl(30,80%,75%),
hsl(60,80%,75%),
hsl(90,80%,75%),
hsl(120,80%,75%),
hsl(150,80%,75%),
hsl(180,80%,75%),
hsl(210,80%,75%),
hsl(240,80%,75%),
hsl(270,80%,75%),
hsl(300,80%,75%),
hsl(330,80%,75%)
)
}

input#saturate{
--gradient: gray, #8880 50%, blue, magenta
}

input#blur{
--gradient: #8880, gray
}

input#scale,
input#x,
input#y,
input#pillarbox,
input#letterbox
{
--gradient: black , white
}
video{
height: 50px;
background: magenta;
cursor: pointer;
transform: scaleX(-1)
}


`
    form.appendChild(style)

    form.addEventListener('mouseenter',()=>{
        form.style.opacity = 1
    })

    form.addEventListener('mouseleave',()=>{
        form.style.opacity = 0.2
    })

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


    // Create preview video

    const video = document.createElement('video')
    video.style=`
`
    video.setAttribute('playsinline','')
    video.setAttribute('autoplay','')

    video.title = 'reset'
    video.addEventListener('click',event=>{
        event.preventDefault()
        Object.values(sliders).forEach(slider=>{
            slider.value = 0
        })
    })

    // Create color balance matrix

    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
    const filter = document.createElementNS('http://www.w3.org/2000/svg','filter')
    filter.id = 'mercator-filters-svg-filter'
    const filter_matrix = document.createElementNS('http://www.w3.org/2000/svg','feColorMatrix')
    filter_matrix.setAttribute('in','SourceGraphic')

    // Add UI to page

    filter.appendChild(filter_matrix)
    svg.appendChild(filter)
    form.appendChild(svg)
    form.appendChild(video)
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

            function draw(){

                // Reset canvas

                canvas_ctx.setTransform(1,0,0,1,0,0)
                canvas_ctx.clearRect(0,0,w,h)

                canvas_ctx.translate(w/2,h/2)

                // Reset values

                sliders.hue.value %= 1
                sliders.rotate.value %= 1


                // BALANCE

                let temperature = sliders.temperature.value*255
                let tint = sliders.tint.value*255
                filter_matrix.setAttribute('value',`
1 0 0 0 0
0 1 0 0 0
0 0 2 0 0
0 0 0 1 0
`)

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

}
