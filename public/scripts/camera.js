'use strict';

let videoElement = document.querySelector('video');
// const audioSelect = document.querySelector('select#audioSource');
const videoSelect = document.querySelector('select#videoSource');
const canvas = document.querySelector('canvas');

navigator.mediaDevices.enumerateDevices().then(gotDevices).then(getStream).catch(handleError);

// audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

function gotDevices(deviceInfos) {
    for (let i = 0; i < deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            // option.text = deviceInfo.label || 'microphone ' + (audioSelect.length + 1);
            // audioSelect.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
            videoSelect.appendChild(option);
        } else {
            console.log('Found one other kind of source/device: ', deviceInfo);
        }
    }
}

function getStream() {
    if (window.stream) {
        window.stream.getTracks().forEach(function (track) {
            track.stop();
        });
    }

    const constraints = {
        audio: true,
        video: {
            deviceId: videoSelect.value ? {exact: videoSelect.value} : true,
            frameRate: {min: 10}
        }
    };

    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}

function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
}

function handleError(error) {
    console.log('Error: ', error);
}

function snapshot() {
    if (window.stream) {
        let context = canvas.getContext('2d');
        // context.fillRect(0,0, 640, 480);
        context.drawImage(videoElement, 0, 0, 640, 480);
        document.querySelector('img').src = canvas.toDataURL('image/png');

    }
}
