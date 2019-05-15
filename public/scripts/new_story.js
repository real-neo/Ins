'use strict';

let videoElement = document.querySelector('video');
// const audioSelect = document.querySelector('select#audioSource');
const videoSelect = document.querySelector('select#videoSource');
const canvas = document.querySelector('canvas');
const locationCheck = document.getElementById('locationCheck');
let latitude, longitude;
let hasPic = false;

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
        const videoDIV = document.getElementById('video-stream');
        const snapshotDIV = document.getElementById('snapshot-show');
        if (videoDIV.style.display === 'none') {
            videoDIV.style.display = 'block';
            snapshotDIV.style.display = 'none';
            // document.querySelector('img').src = '';
            // sendImage('neo', canvas.toDataURL());
            hasPic = false;
        } else {
            videoDIV.style.display = 'none';
            snapshotDIV.style.display = 'block';

            canvas.height = videoElement.videoHeight;
            canvas.width = videoElement.videoWidth;
            let context = canvas.getContext('2d');
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            document.querySelector('img').src = canvas.toDataURL('image/png');
            hasPic = true;
        }
    }
}

function postNewStory() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user === null) { //TODO Check if user logged in by a good way
        alert('You did not log in!');
        window.location = '/login';
    } else {
        const newStoryContent = document.getElementById('new_story').value;
        if (newStoryContent === '') {
            alert('Content can not be blank!');
            return;
        }
        const canvas = document.querySelector('canvas');
        // sendImage(user.user_id, canvas.toDataURL());
        let location = null;
        if (locationCheck.checked === true) {
            location = {latitude: latitude, longitude: longitude};
        }
        const newStory = [{
            user_id: user.user_id,
            date: new Date().getTime(),
            text: newStoryContent,
            pictures: hasPic ? canvas.toDataURL() : null,
            location: location
        }];
        const fStory = JSON.stringify(newStory[0]);
        $.ajax({
            url: '/stories/storiesMongo',
            contentType: 'application/json',
            type: 'POST',
            data: fStory,
            success: function (dataR) {
                alert(dataR)
            },
            // the request to the server has failed. Let's show the cached data
            error: function (xhr, status, error) {
                alert('Fail.'+ error.message)
            }
        });
        // const story = new Story({
        //     user_id:user.user_id,
        //     date:new Date().getTime(),
        //     text: newStoryContent,
        //     pictures: hasPic ? canvas.toDataURL() : null,
        //     location: location
        // });
        // story.save(function (err,results){
        //     console.log('wewewewewe' + results._id);
        // });
        //TODO 1.save into another db 2.send to server 3.redirect to stories page
        storeCachedData(user.user_id, newStory);
        alert('Successfully!' + fStory.date);
        window.location = '/stories';
    }
}

function sendImage(user_id, image) {
    const data = {user_id: user_id, image: image};
    $.ajax({
        dataType: "json",
        url: '/upload_img',
        type: "POST",
        data: data,
        success: function (data) {
            alert('Image upload successfully!');
        }, error: function (err) {
            alert('Error: ' + err.status + ':' + err.statusText);
        }
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotLocation);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function gotLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}
