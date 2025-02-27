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

// Get a session by _id
function findSessionById(id: string) {
    return sessionModel.findById(id);
}

// End a session
function endSession(id: string) 
{
    return sessionModel.findOneAndUpdate(
        { _id: id}, 
        [ { $set: { time: { $subtract: ["$$NOW", "$date" ] } } } ],
        { new: true }
    );
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
    endSession,
    findSessionById,
};
