// ==UserScript==
// @name         Google Meet Filters & Transforms
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Change how you look on Google Meet.
// @author       Xing
// @match        https://meet.google.com/*
// @grant        none
// ==/UserScript==

// MERCATOR FILTERS

(async function() {
    'use strict'

    const form = document.createElement('form')
    form.style=`
position: fixed;
left: 0;
top: 0;
width: 400px;
z-index: 9999999;
background: #fff4;
backdrop-filter: blur(1rem);
border-radius: 1vmin;
padding: 1rem
`

    const video = document.createElement('video')
    video.style=`
height: 50px;
background: magenta;
cursor: pointer;
transform: scaleX(-1)
`
    video.setAttribute('playsinline','')
    video.setAttribute('autoplay','')

    const sliders = {

        brightness: '',
        contrast: '',
        sepia: '',
        hue: '',
        saturate: '',
        blur: '',

        rotate: '',
        scale: '',
        x: '',
        y: '',
    }

    Object.keys(sliders).forEach(key=>{
        let slider = document.createElement('input')
        sliders[key] = slider
        slider.type = 'range'
        slider.min = ['sepia','scale'].includes(key) ? 0 : -1
        slider.max = 1
        slider.step = 0.001
        slider.value = 0
        slider.style = 'width: 300px'

        let label = document.createElement('label')
        label.style = `
display: flex;
justify-content: space-between
`
        label.innerText = key
        slider.title = key

        form.appendChild(label)
        label.appendChild(slider)
    })

    video.title = 'reset'
    video.addEventListener('click',event=>{
        event.preventDefault()
        Object.values(sliders).forEach(slider=>{
            slider.value = 0
        })
    })


    form.appendChild(video)
    document.body.appendChild(form)

    class mercatorMediaStream extends MediaStream {
        constructor(old_stream) {
            super(old_stream)

            const canvas = document.createElement('canvas')

            const constraints = {audio: false, video: true}

            video.srcObject = old_stream

            const old_stream_settings = old_stream.getVideoTracks()[0].getSettings()

            const w = old_stream_settings.width
            const h = old_stream_settings.height
            canvas.width = w
            canvas.height = h
            const canvas_ctx = canvas.getContext('2d')

            const amp = 8

            function draw(){

                canvas_ctx.setTransform(1,0,0,1,0,0)
                canvas_ctx.clearRect(0,0,w,h)

                canvas_ctx.translate(w/2,h/2)

                canvas_ctx.filter = `
 brightness(${amp**sliders.brightness.value})
 contrast(${amp**sliders.contrast.value})
 sepia(${sliders.sepia.value*100}%)
 hue-rotate(${180*sliders.hue.value}deg)
 saturate(${amp**sliders.saturate.value*100}%)
 blur(${amp**sliders.blur.value}px)
`

                canvas_ctx.rotate(-sliders.rotate.value*2*Math.PI)

                let scale = amp**sliders.scale.value

                canvas_ctx.scale(scale,scale)

                canvas_ctx.translate(-sliders.x.value*w,sliders.y.value*h)
                canvas_ctx.translate(-w/2,-h/2)

                canvas_ctx.drawImage(video,0,0,w,h)

                requestAnimationFrame(draw)

            }

            draw()

            return canvas.captureStream(30)

        }
    }

    async function newGetUserMedia(constraints) {
        if (constraints && constraints.video && !constraints.audio ) {
            return new mercatorMediaStream(await navigator.mediaDevices.oldGetUserMedia(constraints))
        } else {
            return navigator.mediaDevices.oldGetUserMedia(constraints)
        }
    }

    MediaDevices.prototype.oldGetUserMedia = MediaDevices.prototype.getUserMedia
    MediaDevices.prototype.getUserMedia = newGetUserMedia

})()
