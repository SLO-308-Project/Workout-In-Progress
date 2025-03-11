// import { ObjectId } from "mongoose";
import sessionModel from "../data/session";
// import {machineType} from "../data/machine";

// gets all workouts for a session id
// returns the array of json workouts or null if it failed
async function getWorkout(session_id: string) {
    return sessionModel.findById(session_id)
        .then((session) => {
            if (!session) {
                throw new Error("Session not found");
            }
            return session.workout;
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}

// Creates a new empty workout for a session
async function addWorkout(machineId: string, sessionId: string) {
    return sessionModel.findOne({ _id: sessionId })
        .then((session) => {
            if (!session) {
                throw new Error("Session not found.");
            }
            console.log("adding to the workout");
            session.workout.push({ machineId: machineId, sets: [] });
            return session.save();
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}

async function removeWorkout(sessionId: string, workoutId: string) {
    if (!sessionId || !workoutId) {
        console.log(`sessionId: ${sessionId} workoutId: ${workoutId}`)
        throw new Error("Session or workout were null.");
    }
    return sessionModel
        .findOne({ _id: sessionId })
        .then((session) => {
            if (!session) {
                throw new Error()
            }
            console.log("removing workout");
            console.log(`sessionId: ${sessionId} workoutId: ${workoutId}`)
            console.log(`${session.workout.constructor.name}`);
            session.workout.pull({ _id: workoutId })
            return session.save();
        })
        .catch((error) => {
            console.log(error);
            return null;
        });
}

// Removes a workout given a session id 

export default {
    getWorkout,
    addWorkout,
    removeWorkout,
};
