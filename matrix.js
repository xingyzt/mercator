// ==UserScript==
// @name         Mercator Matrix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Google Meet Matrix Rain
// @author       Xing
// @match        https://meet.google.com/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict'

    const video = document.createElement('video')
    video.style='position:fixed;left:0;top:0;height:50px;z-index:9999999;background:black'
    video.setAttribute('playsinline','')
    video.setAttribute('autoplay','')


    const toggle = document.createElement('input')
    toggle.type='checkbox'
    toggle.checked=true
    toggle.style='position:fixed;left:0;top:0;width:50px;height:10px;z-index:9999999'

    class mercatorMediaStream extends MediaStream {
        constructor(old_stream) {
            super(old_stream)

            const camera = document.createElement('canvas')
            const matrix = document.createElement('canvas')
            const comp = document.createElement('canvas')

            // Matrix rain
            const katakana = `1234567890ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺーヽヾヿ`;

            document.body.appendChild(video)
            document.body.appendChild(toggle)

            const constraints = {audio: false, video: true}

            video.srcObject = old_stream

            const old_stream_settings = old_stream.getVideoTracks()[0].getSettings()

            const w = old_stream_settings.width
            const h = old_stream_settings.height
            const aspect_ratio = w/h
            const r = w/64
            matrix.width = w*1.5
            matrix.height = h
            comp.width = w
            comp.height = h
            camera.width = w/r
            camera.height = h/r
            const matrix_ctx = matrix.getContext('2d')
            const camera_ctx = camera.getContext('2d')
            const comp_ctx = comp.getContext('2d')
            matrix_ctx.font = 0.9*r+'px monospace'
            matrix_ctx.textAlign = 'center'
            matrix_ctx.translate(w*1.5, 0)
            matrix_ctx.scale(-1,1)
            camera_ctx.filter = 'brightness(0.8) contrast(2.5)'

            matrix_ctx.fillStyle='#020'
            matrix_ctx.fillRect(0,0,w*1.5,h)
            matrix_ctx.fillStyle = '#8f8'
            matrix_ctx.lineWidth = r/10
            matrix_ctx.strokeStyle = '#080'
            matrix_ctx.textBaseline = 'ideographic'

            const text_offset = r*1.5/2
            for(let x = text_offset; x < w*1.5+1; x+=r*1.5){
                for(let y = 0; y < h+1; y+=r){
                    const rand_text = katakana[Math.floor(Math.random()*katakana.length)]
                    matrix_ctx.strokeText(rand_text,x,y)
                    matrix_ctx.fillText(rand_text,x,y)
                }
            }
            let rainx = 0
            let rainy = 0
            let rain_text = ['Z',text_offset,0]

            function draw(){

                if(toggle.checked){

                    comp_ctx.imageSmoothingEnabled = false

                    matrix_ctx.fillStyle = '#020'
                    matrix_ctx.fillRect(rainx,rainy,r*1.5,-r)

                    matrix_ctx.strokeStyle = '#080'
                    matrix_ctx.fillStyle = '#8f8'
                    matrix_ctx.strokeText(...rain_text)
                    matrix_ctx.fillText(...rain_text)

                    rainx = Math.floor(Math.random()*(w+1)/r)*r*1.5
                    rainy = Math.floor(Math.random()*(h+1)/r)*r
                    rain_text = [
                        katakana[Math.floor(Math.random()*katakana.length)],
                        rainx+text_offset,
                        rainy
                    ]

                    matrix_ctx.strokeStyle = '#0f0'
                    matrix_ctx.fillStyle = '#fff'
                    matrix_ctx.strokeText(...rain_text)
                    matrix_ctx.fillText(...rain_text)

                    camera_ctx.drawImage(video, 0, 0, w/r, h/r)

                    comp_ctx.clearRect(0,0,w,h)
                    comp_ctx.globalCompositeOperation = 'source_over'
                    comp_ctx.drawImage(camera,0,0,w,h)
                    comp_ctx.globalCompositeOperation = 'color'
                    comp_ctx.drawImage(matrix,0,0,w,h)
                    comp_ctx.globalCompositeOperation = 'multiply'
                    comp_ctx.drawImage(matrix,0,0,w,h)

                } else {

                    comp_ctx.globalCompositeOperation = 'source_over'
                    comp_ctx.clearRect(0,0,w,h)
                    comp_ctx.drawImage(video,0,0,w,h)

                }

                requestAnimationFrame(draw)

            }

            draw()

            return comp.captureStream(10)

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
