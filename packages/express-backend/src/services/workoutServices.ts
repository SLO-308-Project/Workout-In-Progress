import sessionModel from "../data/session";

/**
 * Gets all workouts for a session
 * @param {String} session_id - Object id of session to search
 * @returns {Proimse} - List of workout or Null on failure
 */
async function getWorkout(session_id: string)
{
    return sessionModel
        .findById(session_id)
        .then((session) =>
        {
            if (!session)
            {
                throw new Error("Session not found");
            }
            return session.workout;
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
}

/**
 * Creates a new workout for a session
 *
 * @param {String} machineId - Machine id to add for a workout
 * @param {String} sessionId - Session id for workout to be added to
 * @returns {Promise} - Workout added
 */
async function addWorkout(machineId: string, sessionId: string)
{
    return sessionModel
        .findOne({_id: sessionId})
        .then((session) =>
        {
            if (!session)
            {
                throw new Error("Session not found.");
            }
            console.log("adding to the workout");
            session.workout.push({machineId: machineId, sets: []});
            return session.save();
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
}

/**
 * Removes a workout given a session id
 *
 * @param {String} sessionId - Session id of workout to be removed
 * @param {String} workoutId - Workout id of workout of the session that is removed
 * @returns {Promise} - Remove workout
 */
async function removeWorkout(sessionId: string, workoutId: string)
{
    if (!sessionId || !workoutId)
    {
        console.log(`sessionId: ${sessionId} workoutId: ${workoutId}`);
        throw new Error("Session or workout were null.");
    }
    return sessionModel
        .findOne({_id: sessionId})
        .then((session) =>
        {
            if (!session)
            {
                throw new Error();
            }
            console.log("removing workout");
            console.log(`sessionId: ${sessionId} workoutId: ${workoutId}`);
            console.log(`${session.workout.constructor.name}`);
            session.workout.pull({_id: workoutId});
            return session.save();
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
}

// async function updateSetAttributeValues(sessionId: string, workoutId: string) {
//     if (!sessionId || !workoutId) {
//         console.log(`sessionId: ${sessionId} workoutId: ${workoutId}`);
//         throw new Error("Session or workout were null.");
//     }
//     return sessionModel
//         .findOne({ _id: sessionId })
//         .then((session) => {
//             if (!session) {
//                 throw new Error("DB failed to retrieve session");
//             }
//         });
// }

export default {
    getWorkout,
    addWorkout,
    removeWorkout,
};
