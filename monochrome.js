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

    const canvas = document.createElement('canvas');

    const video = document.createElement('video');

    video.setAttribute('playsinline','');
    video.setAttribute('autoplay','');

    document.body.appendChild(video);

    video.style='position:fixed;left:0;top:0;width:50px;height:50px;z-index:9999999;background:black';

    const constraints = {audio: false, video: true};

    navigator.mediaDevices.getUserMedia(constraints).then(stream=>{
        video.srcObject = stream;
    });

    const w = 400
    const h = 300
    const alpha = 50
    canvas.width = w
    canvas.height = h
    const context = canvas.getContext('2d');
    setInterval(()=>{
        context.filter = 'saturate(0%) contrast(2)'
        context.drawImage(video, 0, 0, w, h)
		const grd = context.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w)
		grd.addColorStop(0, '#0000')
		grd.addColorStop(1, '#000f')

		context.fillStyle = grd;
		context.fillRect(0,0,w,h);
    },100)

    const stream = canvas.captureStream(20);

    MediaDevices.prototype.getUserMedia = ()=>{
        return stream
    }
})();
