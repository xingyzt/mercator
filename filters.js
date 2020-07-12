// ==UserScript==
// @name         Mercator Filters
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply filters & transforms to your Google Meet webcam
// @author       Xing
// @match        https://meet.google.com/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict'

    const form = document.createElement('form')
    form.style='position:fixed;left:0;top:0;width:50px;z-index:9999999'

    const video = document.createElement('video')
    video.style='height:50px;background:black'
    video.setAttribute('playsinline','')
    video.setAttribute('autoplay','')

    const filter = document.createElement('textarea')

    const sliders = {
        rotate: document.createElement('input'),
        scale: document.createElement('input'),
        movex: document.createElement('input'),
        movey: document.createElement('input')
    }

    form.appendChild(filter)
    Object.values(sliders).forEach(slider=>{
        slider.type = 'range'
        slider.step = 0.001
        slider.min = -1
        slider.max = 1
        slider.value = 0
        slider.style = 'width: 300px'
        form.appendChild(slider)
    })

    filter.placeholder='filter'
    filter.value = 'brightness(1) contrast(1) saturate(100%) blur(0px) hue-rotate(0deg)'
    filter.style = 'width: 300px'

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

            function draw(){

                canvas_ctx.setTransform(1,0,0,1,0,0)
                canvas_ctx.clearRect(0,0,w,h)

                canvas_ctx.translate(w/2,h/2)

                canvas_ctx.filter = filter.value || 'brightness(1)'

                let rotate = sliders.rotate.value+1-1

                canvas_ctx.rotate(-rotate*2*Math.PI)

                let scale = 4**sliders.scale.value

                canvas_ctx.scale(scale,scale)

                canvas_ctx.translate(-sliders.movex.value*w,sliders.movey.value*h)
                canvas_ctx.translate(-w/2,-h/2)

                canvas_ctx.drawImage(video,0,0,w,h)

                requestAnimationFrame(draw)

            }

            draw()

            return canvas.captureStream(10)

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
