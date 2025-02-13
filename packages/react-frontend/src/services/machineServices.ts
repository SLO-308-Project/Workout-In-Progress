const BACKEND_URL: string = 'localhost:8000';

/**
 * Executes a GET request to the backend to retrieve machines.
 *
 * @param {string} name - OPTIONAL parameter will filter by name
 * @param {string} muscle - OPTIONAL parameter will filter by muscle
 * @returns {Promise} Promise returned by async fetch request
 * */
function fetchGetMachine(name: string | undefined, muscle: string | undefined) {
    let params = ""
    if (name && !muscle) {
        params = `?name=${name}`;
    } else if (!name && muscle) {
        params = `?muscle=${muscle}`;
    } else if (name && muscle) {
        params = `?name=${name}&muscle={muscle}`
    }
    return fetch(`${BACKEND_URL}/machines${params}`);
}

/**
 * Executes a DELETE request to the backend to delete the specified machine from the database.
 * 
 * @param {string} name - deletes machine with this name
 * */
function fetchDeleteMachine(name: string) {
    return fetch(`${BACKEND_URL}/machines/${name}`);
}

/**
 * Executes a POST request to the backend and posts an object with values supplied by the parameters name and string.
 * @param {string} name - name of the machine
 * @param {stirng} muscle - primary muscle trained by this machine
 * @returns {Promise} Promise returned by async fetch request
 * */
function fetchPostMachine(name: string, muscle: string) {
    return fetch(`${BACKEND_URL}/machines/`, {
        method: "POST",
        body: JSON.stringify({ name: ${name}, muscle: ${muscle} })
    });
}


