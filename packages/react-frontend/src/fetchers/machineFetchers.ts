const BACKEND_URL: string = "http://localhost:8000";

/**
 * Executes a GET request to the backend to retrieve machines.
 *
 * @param {string} name - OPTIONAL parameter will filter by name
 * @param {string} muscle - OPTIONAL parameter will filter by muscle
 * @returns {Promise} Promise returned by async fetch request
 * */
function fetchGetMachine(
    name: string | undefined,
    muscle: string | undefined,
): Promise<Response>
{
    let params = "";
    if (name && !muscle)
    {
        params = `?name=${name}`;
    }
    else if (!name && muscle)
    {
        params = `?muscle=${muscle}`;
    }
    else if (name && muscle)
    {
        params = `?name=${name}&muscle={muscle}`;
    }
    return fetch(`${BACKEND_URL}/machines${params}`);
}

/**
 * Executes a DELETE request to the backend to delete the specified machine from the database.
 *
 * @param {string} name - deletes machine with this name
 * @returns {Promise} Promise returned by async fetch request
 * */
function fetchDeleteMachine(name: string): Promise<Response>
{
    return fetch(`${BACKEND_URL}/machines/${name}`, {
        method: "DELETE",
    });
}

/**
 * Executes a POST request to the backend and posts an object with values supplied by the parameters name and string.
 * @param {string} name - name of the machine
 * @param {string} muscle - primary muscle trained by this machine
 * @returns {Promise} Promise returned by async fetch request
 * */
function fetchPostMachine(name: string, muscle: string): Promise<Response>
{
    return fetch(`${BACKEND_URL}/machines/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: `${name}`, muscle: `${muscle}`}),
    });
}

/**
 * Executes a PATCH request to the backend to update either the name, muscle, or both.
 * @param {string} name - current name of the machine
 * @param {string} newName - new name of the machine
 * @param {string} muscle - new name of the muscle
 * @return {Promise} Promise returned by async fetch request
 * */
function fetchUpdateMachine(
    currentName: string,
    newName: string | undefined,
    newMuscle: string | undefined,
): Promise<Response>
{
    return fetch(`${BACKEND_URL}/machines/${name}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: `${newName}`, muscle: `${newMuscle}`}),
    });
}

export {
    fetchGetMachine,
    fetchDeleteMachine,
    fetchPostMachine,
    fetchUpdateMachine,
};
