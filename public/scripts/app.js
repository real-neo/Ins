/**
 * called by the HTML onload
 * showing any cached stories and declaring the service worker
 */
function initIns() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch(function (error) {
                console.log('Service Worker NOT Registered ' + error.message);
            });
    }
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }

    getMyId();
}

function getMyId() {
    $.ajax({
        url: '/users/get_my_id',
        contentType: 'application/json',
        type: 'get',
        data: '',
        success: function (dataR) {
            console.log(dataR);
            console.log(dataR.logged);
            if (dataR.logged) {
                delete dataR['logged'];
                localStorage.setItem('user', JSON.stringify(dataR));
            }
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
        }
    });
}

function loadMyStories() {
    console.log('Loading my stories');
    let user = JSON.parse(localStorage.getItem('user'));
    if (user !== null)
        loadStoriesById(user.user_id);
}

/**
 * given user id, it queries the server via Ajax to get the stories for that user
 * if the request to the server fails, it shows the data stored in the database
 * @param user_id
 */
function loadStoriesById(user_id) {
    console.log('Loading stories ::: ' + user_id);
    const user = {user_id: user_id};
    $.ajax({
        url: '/stories/get_stories_by_id',
        dataType: 'json',
        type: 'get',
        data: user,
        success: function (dataR) {
            cleanStories();
            showStories(dataR);
            storeCachedData(user_id, dataR);
            hideOfflineWarning();
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
            cleanStories();
            getCachedData(user_id);
        }
    });
}


///////////////////////// INTERFACE MANAGEMENT ////////////


function cleanStories() {
    if (document.getElementById('stories') != null)
        document.getElementById('stories').innerHTML = '';
}

/**
 * given the stories returned by the server,
 * it adds some rows of stories to the stories div
 * @param stories the data returned by the server
 */
function showStories(stories) {
    if (stories && stories.length > 0) {
        for (let story of stories)
            showStory(story);
    }
}

function showStory(story) {
    if (document.getElementById('stories') != null) {
        $.ajax({
            url: '/users/get_name_by_id/' + story.user_id,
            type: 'get',
            success: function (name) {
                showStoryWithName(story, name);
            },
            error: function (xhr, status, error) {
                showStoryWithName(story, '');
                showOfflineWarning();
            }
        });
    }
}

function showStoryWithName(dataR, name) {
    if (document.getElementById('stories') != null) {
        const story = document.createElement('div');
        // appending a new story
        document.getElementById('stories').appendChild(story);
        // formatting by applying css classes
        story.classList.add('media');
        story.classList.add('my-3');
        story.classList.add('p-3');
        story.classList.add('bg-white');
        story.classList.add('rounded');
        story.classList.add('shadow-sm');

        //TODO May need a good alternative
        let pictures = showPictures(dataR);
        let imgDisplay = 'block';
        if (!pictures) {
            console.log('No pictures!');
            pictures = '';
            imgDisplay = 'none';
        }

        //TODO Need to use JavaScript rather than innerHTML
        story.innerHTML =
            '<img class="mr-2 rounded-circle" src="/images/avatars/' + dataR.user_id + '" width="48" height="48" alt="avatar">' +
            '<p class="media-body pb-3 mb-0 small lh-125 border-bottom-0 border-gray">' +
            '<strong class="d-block text-gray-dark">' + name + ' @' + dataR.user_id + '</strong>' +
            new Date(dataR.date).toUTCString() + '<br>' +
            showText(dataR) + '<br>' +
            '<img src="' + pictures + '" width="128" height="128" alt="" style="display: ' + imgDisplay + ';">' + '<br>' +
            showLocation(dataR) +
            '</p>';
        //TODO Need to get Name of user (from server, may use POST), may read from local storage, initialized when login
    }
}

function search() {
    let keyword = document.getElementById('searchBox').value;
    if (keyword !== '') {
        searchByKeyword(keyword);
    }
    event.preventDefault();
}

/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function (e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function (e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
}, false);

function showOfflineWarning() {
    if (document.getElementById('offline_div') != null)
        document.getElementById('offline_div').style.display = 'block';
}

function hideOfflineWarning() {
    if (document.getElementById('offline_div') != null)
        document.getElementById('offline_div').style.display = 'none';
}
