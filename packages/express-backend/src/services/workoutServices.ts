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
            return session.workout
        })
    .catch((error) => {
            console.log(error);
            return null;
        });
}

// Creates a new empty workout for a session
async function addWorkout(machineId: string, sessionId: string) {
    return sessionModel.findOne({_id: sessionId})
    .then((session) => {
            if (!session) {
                throw new Error("Session not found.");
            }
            console.log("adding to the workout");
            session.workout.push({machineId: machineId, sets: []});
            return session.save();
        })
    .catch((error) => {
            console.log(error);
            return null;
    });
}

export default {
    getWorkout,
    addWorkout,
};
