import {getEnv} from "../util/env";
import {Attribute} from "../types/attribute";
import {Machine} from "../types/machine";

const BACKEND_URL: string = getEnv("VITE_SERVER_URL");

// TEMPORARY USER FOR MAKING BACKEND CALLS WORK
// CURRENT ROUTING PATHS RELY ON EMAIL
// WE HAVE NO WAY OF AUTHENTICATING YET

// IF THIS USER DOES NOT EXIST IN YOUR LOCAL DB THEN MAKE A
// POST REQUEST TO http://localhost:8000/users/ WITH BODY:
// {
//  "name": "test1",
//  "email": "test1@gmail.com",
//  "units": "lbs"
// }
const USER_EMAIL: string = "test1@gmail.com";

/**
 * Executes a GET request to the backend to retrieve machines.
 *
 * @param {string} name - OPTIONAL parameter will filter by name
 * @param {string} muscle - OPTIONAL parameter will filter by muscle
 * @returns {Promise} Promise returned by async fetch request
 * */
function fetchGetMachine(
    name: string | undefined = undefined,
    muscle: string | undefined = undefined,
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
    return fetch(`${BACKEND_URL}/machines/${USER_EMAIL}${params}`);
}

/**
 * Executes a DELETE request to the backend to delete the specified machine from the database.
 *
 * @param {string} name - deletes machine with this name
 * @returns {Promise} Promise returned by async fetch request
 * */
function fetchDeleteMachine(name: string): Promise<Response>
{
    return fetch(`${BACKEND_URL}/machines/${USER_EMAIL}/${name}`, {
        method: "DELETE",
    });
}

/**
 * Executes a POST request to the backend and posts an object with values supplied by the parameters name and string.
 * @param {string} name - name of the machine
 * @param {string} muscle - primary muscle trained by this machine
 * @returns {Promise} Promise returned by async fetch request
 * */
function fetchPostMachine(machine: Machine): Promise<Response>
{
    console.log(`fetchPostMachine: ${JSON.stringify(machine)}`);
    return fetch(`${BACKEND_URL}/machines/${USER_EMAIL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: `${machine.name}`,
            muscle: `${machine.muscle}`,
            attributes: machine.attributes,
        }),
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
    return fetch(`${BACKEND_URL}/machines/${USER_EMAIL}/${currentName}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: `${newName}`, muscle: `${newMuscle}`}),
    });
}

/*
 * Gets the attributes for the passed in machineid
 *
 * @param {string} machineId - id of the machine you want attributes for
 * @return {Promise} - Promise returned by the async fetch request
 * */
function fetchGetAttributes(machineId: string)
{
    return fetch(`${BACKEND_URL}/machines/${machineId}/attributes`);
}

/*
 * Adds an attribute
 */
function fetchPostAttribute(machineId: string, attribute: Attribute)
{
    console.log(`MACHINE_ID: ${machineId}`);
    return fetch(`${BACKEND_URL}/machines/${machineId}/attributes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: `${attribute.name}`,
            unit: `${attribute.unit}`,
        }),
    });
}

/*
 * Delete an attribute
 * */
function fetchDeleteAttribute(machineId: string, attributeName: string)
{
    return fetch(
        `${BACKEND_URL}/machines/${machineId}/attributes/${attributeName}`,
        {
            method: "DELETE",
        },
    );
}

export {
    fetchGetMachine,
    fetchDeleteMachine,
    fetchPostMachine,
    fetchUpdateMachine,
    fetchGetAttributes,
    fetchPostAttribute,
    fetchDeleteAttribute,
};
