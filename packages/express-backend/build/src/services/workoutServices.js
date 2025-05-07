"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = __importDefault(require("../data/session"));
const sessionTemplate_1 = __importDefault(require("../data/sessionTemplate"));
/**
 * Gets all workouts for a session
 * @param {String} session_id - Object id of session to search
 * @returns {Proimse} - List of workout or Null on failure
 */
function getWorkout(session_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return session_1.default
            .findById(session_id)
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
    });
}
/**
 * Creates a new workout for a session
 *
 * @param {String} machineId - Machine id to add for a workout
 * @param {String} sessionId - Session id for workout to be added to
 * @returns {Promise} - Workout added
 */
function addWorkout(machineId, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        return session_1.default
            .findOne({ _id: sessionId })
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
function saveWorkout(templateId, sessionId, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const workoutToSave = yield session_1.default
            .findById(sessionId)
            .then((session) => {
            if (session == null) {
                throw new Error("Session not found");
            }
            if (index >= session.workout.length || index < 0) {
                throw new Error("Index not in list");
            }
            return session.workout[index].toObject();
        })
            .catch((error) => {
            console.log(error);
            return null;
        });
        if (workoutToSave == null) {
            return null;
        }
        return sessionTemplate_1.default
            .findByIdAndUpdate(templateId, {
            $push: { workout: workoutToSave },
        }, { new: true })
            .then((template) => {
            if (template == null) {
                throw new Error("Template not found");
            }
            return template.workout[template.workout.length - 1];
        })
            .catch((error) => {
            console.log(error);
            return null;
        });
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
function removeSavedWorkout(templateId, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const template = yield sessionTemplate_1.default.findById(templateId);
        if (template == null) {
            return null;
        }
        if (index >= template.workout.length || index < 0) {
            return null;
        }
        template.workout.splice(index, 1);
        return template.save();
    });
}
/**
 * Get saved workouts from a template
 *
 * @param {string} templateId - Temp;ate object id
 *
 * @returns {Promise} - List of all workouts in a template
 */
function getSavedWorkout(templateId) {
    return __awaiter(this, void 0, void 0, function* () {
        return sessionTemplate_1.default
            .findById(templateId)
            .then((template) => {
            if (template == null) {
                throw new Error("No template found");
            }
            return template.workout;
        })
            .catch((error) => {
            console.log(error);
            return null;
        });
    });
}
/**
 * Removes a workout given a session id
 *
 * @param {String} sessionId - Session id of workout to be removed
 * @param {String} workoutId - Workout id of workout of the session that is removed
 * @returns {Promise} - Remove workout
 */
function removeWorkout(sessionId, workoutId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!sessionId || !workoutId) {
            console.log(`sessionId: ${sessionId} workoutId: ${workoutId}`);
            throw new Error("Session or workout were null.");
        }
        return session_1.default
            .findOne({ _id: sessionId })
            .then((session) => {
            if (!session) {
                throw new Error();
            }
            console.log("removing workout");
            console.log(`sessionId: ${sessionId} workoutId: ${workoutId}`);
            console.log(`${session.workout.constructor.name}`);
            session.workout.pull({ _id: workoutId });
            return session.save();
        })
            .catch((error) => {
            console.log(error);
            return null;
        });
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
exports.default = {
    getWorkout,
    addWorkout,
    saveWorkout,
    getSavedWorkout,
    removeWorkout,
    removeSavedWorkout,
};
