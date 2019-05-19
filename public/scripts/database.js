let dbPromise;
let dbPromiseNew;

const INS_DB_NAME = 'ins_db_1';
const INS_STORE_NAME = 'ins_store';
const INS_STORE_NEW = 'ins_store_new';

/**
 * it inits the database
 */
function initDatabase() {
    dbPromise = idb.openDb(INS_DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(INS_STORE_NAME)) {
            const storyDB = upgradeDb.createObjectStore(INS_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            storyDB.createIndex('id', 'id', {unique: true});
            storyDB.createIndex('user_id', 'user_id');
        }
    });
    dbPromiseNew = idb.openDb(INS_STORE_NEW, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(INS_STORE_NEW)) {
            const storyDB_new = upgradeDb.createObjectStore(INS_STORE_NEW, {keyPath: 'id', autoIncrement: true});
            storyDB_new.createIndex('id', 'id', {unique: true});
            storyDB_new.createIndex('user_id', 'user_id');
        }
    });
}

/**
 * it saves the stories for a user in database or localStorage
 * @param user_id
 * @param stories
 */
function storeCachedData(user_id, stories) {
    console.log('inserting: ' + JSON.stringify(stories));
    if (dbPromise) {
        dbPromise.then(async db => {
            const tx = db.transaction(INS_STORE_NAME, 'readwrite');
            const storyDB = tx.objectStore(INS_STORE_NAME);
            for (let story of stories)
                await storyDB.put(story);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! ' + JSON.stringify(stories));
        }).catch(function (error) {
            console.log('error: ' + error);
            localStorage.setItem(user_id, JSON.stringify(stories));
        });
    } else
        localStorage.setItem(user_id, JSON.stringify(stories));
}

function getCachedDataOffline(next) {
    let user_id_new = JSON.parse(localStorage.getItem('user')).user_id;
    if (dbPromiseNew) {
        dbPromiseNew.then(function (db) {
            console.log('fetching: ' + user_id_new);
            const tx = db.transaction(INS_STORE_NEW, 'readonly');
            const store = tx.objectStore(INS_STORE_NEW);
            const index = store.index('id');
            return index.getAll();
        }).then(function (stories) {
            if (stories && stories.length > 0) {
                console.log('get offline stories');
                next(stories);
                // for (let story of stories)
                //     showStoryOrComment(story);
            } else {
                return JSON.parse(localStorage.getItem(user_id_new));
            }
        });
    } else {
        return JSON.parse(localStorage.getItem(user_id_new));
    }
}

function showOfflineData() {
    let user_id_new = JSON.parse(localStorage.getItem('user')).user_id;
    if (dbPromiseNew) {
        dbPromiseNew.then(function (db) {
            console.log('fetching: ' + user_id_new);
            const tx = db.transaction(INS_STORE_NEW, 'readonly');
            const store = tx.objectStore(INS_STORE_NEW);
            const index = store.index('id');
            return index.getAll();
        }).then(function (stories) {
            if (stories && stories.length > 0) {
                // console.log('get offline stories');
                // next(stories);
                // JSON.parse(stories);
                for (let story of stories) {
                    story.user_id = user_id_new;
                    showStoryOrComment(story);
                }
            }
        });
    }
}

/**
 * it offline saves the stories for a user in indexedDB or localStorage
 * @param story
 */
function storeCachedDataNew(story) {
    let user_id_new = JSON.parse(localStorage.getItem('user')).user_id;
    if (dbPromiseNew) {
        dbPromiseNew.then(async db => {
            const tx = db.transaction(INS_STORE_NEW, 'readwrite');
            const storyDB_new = tx.objectStore(INS_STORE_NEW);
            await storyDB_new.put(story);
            return tx.complete;
        }).catch(function (error) {
            alert('IndexedDb error, store story in local storage');
            localStorage.setItem(user_id_new, JSON.stringify(story));
        });
    } else {
        localStorage.setItem(user_id_new, JSON.stringify(story));
    }
}

/**
 * it retrieves the stories for a user from database
 * @param user_id
 */
function getCachedData(user_id) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: ' + user_id);
            const tx = db.transaction(INS_STORE_NAME, 'readonly');
            const store = tx.objectStore(INS_STORE_NAME);
            const index = store.index('user_id');
            return index.getAll(IDBKeyRange.only(user_id));
        }).then(function (stories) {
            if (stories && stories.length > 0) {
                for (let story of stories)
                    showStoryOrComment(story);
            } else {
                getCachedDataFromLocalStorage(user_id);
            }
        });
    } else {
        getCachedDataFromLocalStorage(user_id);
    }
}

/**
 * it retrieves the stories for a user from localStorage
 * @param user_id
 */
function getCachedDataFromLocalStorage(user_id) {
    const stories = JSON.parse(localStorage.getItem(user_id));
    if (stories == null)
        showStoryOrComment({user_id: 'Ins', text: 'You don\'t have any stories!'});
    else {
        showStoriesOrComments(stories);
    }
}

function searchByKeyword(keyword) {
    $.ajax({
        url: '/stories/searchMongo', //TODO
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({keyword: keyword}),
        success: function (dataR) {
            cleanStoriesEvents();
            hideOfflineWarning();
            showStoriesOrComments(dataR)
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
            cleanStoriesEvents();
            offlineSearch(keyword);
        }
    });
}

function offlineSearch(keyword) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('searching: ' + keyword);
            db.transaction(INS_STORE_NAME, 'readonly')
                .objectStore(INS_STORE_NAME)
                .getAll()
                .then(function (stories) {
                    document.getElementById('title').innerText = 'Search result';
                    cleanStoriesEvents();
                    for (let story of stories) {
                        console.log(story);
                        if (story.content.toLowerCase().search(keyword.toLowerCase()) > -1)
                            showStoryOrComment(story);
                    }
                });
        });
    } else {
        const user = JSON.parse(localStorage.getItem('user'));
        const stories = JSON.parse(localStorage.getItem(user.user_id));
        if (stories == null)
            showStoryOrComment({user_id: 'Ins', content: 'You don\'t have any stories!'});
        else {
            for (let story of stories) {
                if (story.content.toLowerCase().search(keyword.toLowerCase()) > -1)
                    showStoryOrComment(story);
            }
        }
    }
}

function showDate(dataR) {
    if (dataR.date == null && dataR.date === undefined)
        return 'Unknown time';
    else
        return dataR.date;
}

function showContent(dataR) {
    if (dataR.content == null && dataR.content === undefined)
        return '(No content)';
    else
        return dataR.content;
}

function showPictures(dataR) {
    let pictures = '';
    if (dataR.pictures == null && dataR.content === undefined) {
    } else {
        console.log(dataR.pictures);
        for (let pic of dataR.pictures) {
            pictures += ('<img src="' + pic + '" alt=""><br>');
        }
    }
    return pictures;
}

function showLocation(dataR) {
    if (dataR.location.length === 2) {
        return '<a href="/map/' + dataR.location[0] + '/' + dataR.location[1] + '">Show Location</a>';
    } else
        return '';
}
