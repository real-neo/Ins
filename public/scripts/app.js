/**
 * called by the HTML onload
 * showing any cached stories and declaring the service worker
 */
function initIns() {
    loadData();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
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
}

function loadData() {
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
    const user = JSON.stringify({user_id: user_id});
    $.ajax({
        url: '/stories/get_stories_by_id', //TODO
        contentType: 'application/json',
        type: 'POST',
        data: user,
        success: function (dataR) {
            cleanStories();
            for (let story of dataR)
                showStory(story);
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
 * @param dataR the data returned by the server
 */
function showStory(dataR) {
    if (document.getElementById('stories') != null) {
        const card = document.createElement('div');
        // appending a new card
        document.getElementById('stories').appendChild(card);
        // formatting the card by applying css classes
        card.classList.add('card');

        const card_body = document.createElement('div');
        card.appendChild(card_body);
        card_body.classList.add('card-body');

        const row = document.createElement('div');
        card_body.appendChild(row);
        row.classList.add('row');

        //TODO May need a good alternative
        let pictures = getPictures(dataR);
        if (!pictures) {
            console.log('No pictures!');
            pictures = '(No pictures)';
        }

        //TODO Need to use JavaScript rather than innerHTML
        row.innerHTML =
            "<div class='col-sm'><h4 class='card-title'>" + dataR.user_id + "</h4></div>" +
            "<div class='col-sm'>" + getDate(dataR) + "</div>" +
            "<div class='col-sm'>" + getText(dataR) + "</div>" +
            "<div class='col-sm'>" + pictures + "</div>" +
            "<div class='col-sm'>" + getLocation(dataR) + "</div>";
        //TODO Need to get Name of user (from server, may use POST), may read from local storage, initialized when login
    }
}

/**
 * store user id and name into local storage
 * @param user_id user ID
 */
function storeUser(user_id) { //TODO should be called after log in
    const user = JSON.stringify({user_id: user_id});
    $.ajax({
        url: '/users/get_name_by_id',
        contentType: 'application/json',
        type: 'POST',
        data: user,
        success: function (dataR) { // {user_id: user_id, name: "Neo"}
            localStorage.setItem('user', JSON.stringify(dataR));
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
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
    loadData();
}, false);

function showOfflineWarning() {
    if (document.getElementById('offline_div') != null)
        document.getElementById('offline_div').style.display = 'block';
}

function hideOfflineWarning() {
    if (document.getElementById('offline_div') != null)
        document.getElementById('offline_div').style.display = 'none';
}
