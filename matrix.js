// ==UserScript==
// @name         Mercator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google Meet Effekz
// @author       Xing
// @match        https://meet.google.com/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    const camera = document.createElement('canvas');
    const matrix = document.createElement('canvas');
    const comp = document.createElement('canvas');

    const video = document.createElement('video');

    const katakana = `ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺーヽヾヿ`;

    video.setAttribute('playsinline','');
    video.setAttribute('autoplay','');

    document.body.appendChild(video);

    video.width = 10

    video.style='position:fixed;left:0;top:0;width:50px;height:50px;z-index:9999999;background:black';

    const constraints = {audio: false, video: true};

    const original_stream = await navigator.mediaDevices.getUserMedia(constraints)

    video.srcObject = original_stream

    const w = 400;
    const h = 300;
    const rx = 8;
    const ry = 6;
    matrix.width = comp.width = w;
    matrix.height = comp.height = h;
    camera.width = w/rx;
    camera.height = h/ry;
    const matrix_ctx = matrix.getContext('2d');
    const camera_ctx = camera.getContext('2d');
    const comp_ctx = comp.getContext('2d');
    matrix_ctx.font = '8px serif';
    camera_ctx.filter = 'brightness(0.8) contrast(2.5)'

    matrix_ctx.fillStyle='#010'
    matrix_ctx.fillRect(0,0,w,h)
    matrix_ctx.fillStyle = '#0f0'

    for(let x = 0; x < w; x+=rx){
        for(let y = 0; y < h; y+=ry){
            matrix_ctx.fillText(katakana[Math.floor(Math.random()*katakana.length)],x,y);
        }
    }
    let randx = 0
    let randy = 0
    comp_ctx.imageSmoothingEnabled = false;
    setInterval(()=>{
        matrix_ctx.fillStyle = '#010'
        matrix_ctx.fillRect(randx,randy,rx,-ry)
        matrix_ctx.fillStyle = '#0f0'
        matrix_ctx.fillText(katakana[Math.floor(Math.random()*katakana.length)],randx,randy);
        randx = Math.floor(Math.random()*w/rx)*rx
        randy = Math.floor(Math.random()*h/ry)*ry
        matrix_ctx.fillStyle = '#020'
        matrix_ctx.fillRect(randx,randy,rx,-ry)

        camera_ctx.drawImage(video, 0, 0, w/rx, h/ry)

        comp_ctx.clearRect(0,0,w,h)
        comp_ctx.globalCompositeOperation = 'source_over'
        comp_ctx.drawImage(camera,0,0,w,h)
        comp_ctx.globalCompositeOperation = 'color'
        comp_ctx.drawImage(matrix,0,0,w,h)
        comp_ctx.globalCompositeOperation = 'overlay'
        comp_ctx.drawImage(matrix,0,0,w,h)
    },1)


    const modifiedStream = comp.captureStream(10)

    MediaDevices.prototype.getUserMedia = () => { return modifiedStream }
})();
