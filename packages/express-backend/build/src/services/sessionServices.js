"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = __importDefault(require("../data/session"));
/**
 * Returns all sessions
 *
 * @returns {Promise} - All sessions
 */
function getAllSessions() {
    return session_1.default.find();
}
/**
 * Adds a session
 *
 * @param {SessionType} session - Session to add
 * @returns {Promise} - Session Added
 */
function addSession(session) {
    const sessionToAdd = new session_1.default(session);
    return sessionToAdd.save();
}
/**
 * Gets a session by id
 *
 * @param {String} id - Id of session object
 * @returns {Promise} - Session object if found or Undefined
 */
function getSessionById(id) {
    return session_1.default.findById(id);
}
/**
 * Gets most recent session with no time
 *
 * @returns {Promise<SessionType[]>} - Gets the current session
 */
function getCurrentSession() {
    return session_1.default.aggregate([
        {
            $sort: { date: -1 },
        },
        {
            $limit: 1,
        },
        {
            $match: { time: 0 },
        },
    ]);
}
/**
 * Ends a session
 *
 * @param {String} id - Id of session to end
 * @returns {Promise} - Updates Duration Of Session Object
 */
function endSession(id) {
    return session_1.default.findOneAndUpdate({ _id: id }, [{ $set: { time: { $subtract: ["$$NOW", "$date"] } } }], { new: true });
}
/**
 * Delete a session by id
 *
 * @param {String} id - ID of session to delete
 * @returns {Promise} - Removes Session Object
 */
function deleteSession(id) {
    return session_1.default.findByIdAndDelete(id);
}
exports.default = {
    getAllSessions,
    addSession,
    deleteSession,
    endSession,
    getSessionById,
    getCurrentSession,
};
