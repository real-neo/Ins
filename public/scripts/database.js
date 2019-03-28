let dbPromise;

const INS_DB_NAME = 'ins_db_1';
const INS_STORE_NAME = 'ins_store';

/**
 * it inits the database
 */
function initDatabase() {
    dbPromise = idb.openDb(INS_DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(INS_STORE_NAME)) {
            const storyDB = upgradeDb.createObjectStore(INS_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            storyDB.createIndex('user_id', 'user_id', {unique: true});
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
    } else localStorage.setItem(user_id, JSON.stringify(stories));
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
                    showStory(story);
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
    const stories = localStorage.getItem(user_id);
    if (stories == null)
        showStory({user_id: 'Ins', text: 'You don\'t have any stories!'});
    else {
        for (let story of stories)
            showStory(story);
    }
}

function getDate(dataR) {
    if (dataR.date == null && dataR.date === undefined)
        return 'Unknown time';
    else
        return dataR.date;
}

function getText(dataR) {
    if (dataR.text == null && dataR.text === undefined)
        return '(No content)';
    else
        return dataR.text;
}

function getPictures(dataR) {
    if (dataR.pictures == null && dataR.pictures === undefined)
        return null; //TODO Check pictures before show them
    else
        return dataR.pictures;
}

function getLocation(dataR) {
    if (dataR.location == null && dataR.location === undefined)
        return '';
    else
        return 'Google Maps Address'; //TODO Use Google Maps to get address from GPS
}
