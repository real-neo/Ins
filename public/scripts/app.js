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

function postNewComment() {
    const content = document.getElementById('new_comment').value;
    const event_id = document.getElementById('event_id').value;
    $.ajax({
        url: '/comments/create_new',
        contentType: 'application/json',
        type: 'post',
        data: JSON.stringify({content: content, event: event_id}),
        success: function (dataR) {
            alert(dataR);
            alert('Successfully!');
            hideOfflineWarning();
            loadComments(event_id);
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
            // cleanStoriesEvents();
            // getCachedData();
        }
    });
}

function loadComments(event_id) {
    console.log('Loading comments');
    $.ajax({
        url: '/comments/get_comments_by_event_id',
        dataType: 'json',
        type: 'get',
        data: {event_id: event_id},
        success: function (dataR) {
            console.log('Received comments:::::::' + dataR);
            // cleanStoriesEvents();
            showStoriesOrComments(dataR);
            // showEvents(dataR);
            // storeCachedData(user_id, dataR);
            hideOfflineWarning();
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
            // cleanStoriesEvents();
            // getCachedData();
        }
    });
}

function loadEvents() {
    console.log('Loading events');
    $.ajax({
        url: '/events/get_all_events',
        contentType: 'application/json',
        type: 'get',
        data: '',
        success: function (dataR) {
            console.log('Received events:::::::' + dataR);
            cleanStoriesEvents();
            // showStoriesOrComments(dataR);
            showEvents(dataR);
            // storeCachedData(user_id, dataR);
            hideOfflineWarning();
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
            cleanStoriesEvents();
            // getCachedData();
        }
    });
}

function loadAllStories() {
    console.log('Loading all stories');
    $.ajax({
        url: '/stories/get_all_stories',
        dataType: 'json',
        type: 'get',
        data: '',
        success: function (dataR) {
            cleanStoriesEvents();
            showStoriesOrComments(dataR);
            hideOfflineWarning();
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
            cleanStoriesEvents();
            showStoriesOrComments(dataR);
            showOfflineData();
            storeCachedData(user_id, dataR);
            hideOfflineWarning();
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
            cleanStoriesEvents();
            getCachedData(user_id);
        }
    });
}


///////////////////////// INTERFACE MANAGEMENT ////////////


function cleanStoriesEvents() {
    if (document.getElementById('stories_comments') != null)
        document.getElementById('stories_comments').innerHTML = '';
}

function showEvents(events) {
    if (events && events.length > 0) {
        console.log('length events:::::' + events.length);
        for (let event of events) {
            console.log('Showing::::::' + event._id);
            showEvent(event);
        }
    }
}

function showEvent(dataR) {
    if (document.getElementById('events') != null) {
        const event = document.createElement('div');
        // appending a new event
        document.getElementById('events').appendChild(event);
        // formatting by applying css classes
        event.classList.add('media');
        event.classList.add('my-3');
        event.classList.add('p-3');
        event.classList.add('bg-white');
        event.classList.add('rounded');
        event.classList.add('shadow-lg');
        event.classList.add('row');
        event.onclick = function () {
            location.href = '/events/' + dataR._id + '/show';
        };
        event.style.cursor = 'pointer';

        let pictures = showPictures(dataR);

        event.innerHTML =
            '<div class="col-12">' +
            '<p class="media-body pb-3 mb-0 lh-125 border-bottom-0 border-gray">' +
            '<strong class="d-block text-gray-dark">' + dataR.title + '</strong>' +
            showContent(dataR) + '<br>' +
            pictures +
            showLocation(dataR) +
            '</p>' +
            '<p class="media-body pb-3 mb-0 small lh-125 border-bottom-0 border-gray text-right">' +
            showDate(dataR) +
            '</p>' +
            '</div>';
    }
}

/**
 * given the stories or comments returned by the server,
 * it adds some rows of stories to the stories div
 * @param data the data returned by the server
 */
function showStoriesOrComments(data) {
    if (data && data.length > 0) {
        for (let datum of data) {
            console.log('Showing::::::::' + datum);
            showStoryOrComment(datum);
        }
    }
}

function showStoryOrComment(datum) {
    if (document.getElementById('stories_comments') != null) {
        $.ajax({
            url: '/users/get_name_by_id/' + datum.user_id,
            type: 'get',
            success: function (name) {
                showStoryOrCommentWithName(datum, name);
            },
            error: function (xhr, status, error) {
                showStoryOrCommentWithName(datum, '');
                showOfflineWarning();
            }
        });
    }
}

function showStoryOrCommentWithName(dataR, name) {
    if (document.getElementById('stories_comments') != null) {
        const datum = document.createElement('div');
        // appending a new datum
        document.getElementById('stories_comments').appendChild(datum);
        // formatting by applying css classes
        datum.classList.add('media');
        datum.classList.add('my-3');
        datum.classList.add('p-3');
        datum.classList.add('bg-white');
        datum.classList.add('rounded');
        datum.classList.add('shadow-lg');
        datum.classList.add('row');

        let pictures = showPictures(dataR);

        datum.innerHTML =
            '<div class="col-12">' +
            '<img class="mr-2 rounded-circle" src="/images/avatars/' + dataR.user_id + '" width="48" height="48" alt="avatar">' +
            '<p class="media-body pb-3 mb-0 small lh-125 border-bottom-0 border-gray">' +
            '<strong class="d-block text-gray-dark">' + name + ' @' + dataR.user_id + '</strong>' +
            showDate(dataR) + '<br>' +
            showContent(dataR) + '<br>' +
            pictures +
            showLocation(dataR) +
            '</p>' +
            '</div>';
    }
}

function search() {
    let keyword = document.getElementById('searchBox').value;
    if (keyword !== '') {
        searchByKeyword(keyword);
    }
    event.preventDefault();
}

function postNews(stories) {
    for (let story of stories)
        postNew(story);
    indexedDB.deleteDatabase(INS_STORE_NEW);
}

function postNew(story) {
    console.log(story);
    delete story['id'];
    console.log('Sending new story - 2');
    console.log(story);
    $.ajax({
        url: '/stories/create_new',
        contentType: 'application/json',
        type: 'post',
        data: JSON.stringify(story),
        success: function (dataR) {
            console.log(dataR);
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            console.log('send fail');
        }
    });
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
    getCachedDataOffline(postNews);
    // getCachedDataOffline();
}, false);

function showOfflineWarning() {
    if (document.getElementById('offline_div') != null)
        document.getElementById('offline_div').style.display = 'block';
}

function hideOfflineWarning() {
    if (document.getElementById('offline_div') != null)
        document.getElementById('offline_div').style.display = 'none';
}
