import sessionModel from "../data/session";
import sessionTemplateModel from "../data/sessionTemplate";

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
 * Save a workout to a template
 *
 * @param {string} templateId - Template Object id
 * @param {string} sessionId - Machine Object id
 * @param {number} index - Index of workout to add
 *
 * @return {Promise} - Workout saved to template
 */
async function saveWorkout(
    templateId: string,
    sessionId: string,
    index: number,
)
{
    const workoutToSave = await sessionModel
        .findById(sessionId)
        .then((session) =>
        {
            if (session == null)
            {
                throw new Error("Session not found");
            }
            if (index >= session.workout.length || index < 0)
            {
                throw new Error("Index not in list");
            }
            return session.workout[index].toObject();
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
    if (workoutToSave == null)
    {
        return null;
    }
    return sessionTemplateModel
        .findByIdAndUpdate(
            templateId,
            {
                $push: {workout: workoutToSave},
            },
            {new: true},
        )
        .then((template) =>
        {
            if (template == null)
            {
                throw new Error("Template not found");
            }
            return template.workout[template.workout.length - 1];
        })
        .catch((error) =>
        {
            console.log(error);
            return null;
        });
}

/**
 * Remove a saved workout from a template
 *
 * @param {string} templateId - Template Object Id
 * @param {number} index - Index of workout to delete
 *
 * @return {Promise} - Remove workout from tempalte
 */
async function removeSavedWorkout(templateId: string, index: number)
{
    const template = await sessionTemplateModel.findById(templateId);
    if (template == null)
    {
        return null;
    }
    if (index >= template.workout.length || index < 0)
    {
        return null;
    }
    template.workout.splice(index, 1);
    return template.save();
}

/**
 * Get saved workouts from a template
 *
 * @param {string} templateId - Temp;ate object id
 *
 * @returns {Promise} - List of all workouts in a template
 */
async function getSavedWorkout(templateId: string)
{
    return sessionTemplateModel
        .findById(templateId)
        .then((template) =>
        {
            if (template == null)
            {
                throw new Error("No template found");
            }
            return template.workout;
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
    saveWorkout,
    getSavedWorkout,
    removeWorkout,
    removeSavedWorkout,
};
