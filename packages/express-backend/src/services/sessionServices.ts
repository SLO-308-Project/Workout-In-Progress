import sessionModel, {sessionType} from "../data/session";

// Returns all sessions
function getAllSessions()
{
    return sessionModel.find();
}

// Adds a session
function addSession(session: sessionType)
{
    const sessionToAdd = new sessionModel(session);
    return sessionToAdd.save();
}

// Delete a session by _id
function deleteSession(id: string)
{
    return sessionModel.findByIdAndDelete(id);
}

export default {
    getAllSessions,
    addSession,
    deleteSession,
};
