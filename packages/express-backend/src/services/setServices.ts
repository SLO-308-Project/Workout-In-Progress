import sessionModel from "../data/session";
import mongoose from "mongoose";

type AttributeValue = {
    name: string;
    value: number;
};

// gets the sets for a workout under a session
async function getSets(sessionId: string, workoutId: string)
{
    if (!sessionId)
    {
        throw new Error("No sessionId provided");
    }
    else if (!workoutId)
    {
        throw new Error("No workoutId provided");
    }

    return sessionModel.findOne(
        {_id: sessionId},
        {
            workout: {$elemMatch: {_id: workoutId}},
        },
    );
}

async function addSet(
    sessionId: string,
    workoutId: string,
    attributeValues: AttributeValue[],
)
{
    if (!sessionId)
    {
        console.log(
            `sessionId=${sessionId} workoutId=${workoutId}, attributeValues=${JSON.stringify(attributeValues)}`,
        );
        throw new Error("No sessionId provided");
    }
    else if (!workoutId)
    {
        console.log(
            `sessionId=${sessionId} workoutId=${workoutId}, attributeValues=${JSON.stringify(attributeValues)}`,
        );
        throw new Error("No workoutId provided");
    }
    else if (!attributeValues || attributeValues.length === 0)
    {
        console.log(
            `sessionId=${sessionId} workoutId=${workoutId}, attributeValues=${JSON.stringify(attributeValues)}`,
        );
        throw new Error("No attribute values for the set provided");
    }

    const newSetId = new mongoose.Types.ObjectId();

    const session = await sessionModel.findOneAndUpdate(
        // find the workout in the session
        {_id: sessionId, "workout._id": workoutId},
        {
            // push the new set to the workouts sets
            $push: {
                "workout.$.sets": {
                    _id: newSetId,
                    attributeValues: attributeValues,
                },
            },
        },
    );

    if (!session || session.workout.length === 0)
    {
        throw new Error("No session or workout found for the given ID");
    }

    // we want to return the id of the set that was just added
    return newSetId;
}

function removeSet(sessionId: string, workoutId: string, setId: string)
{
    if (!sessionId)
    {
        throw new Error("No sessionId provided");
    }
    else if (!workoutId)
    {
        throw new Error("No workoutId provided");
    }
    else if (!setId)
    {
        throw new Error("No setId provided");
    }

    return sessionModel.updateOne(
        {
            _id: sessionId,
            "workout._id": workoutId,
        },
        {
            $pull: {
                "workout.$.sets": {_id: setId},
            },
        },
    );
}

async function updateSet(
    sessionId: string,
    workoutId: string,
    setId: string,
    newAttributeValues: AttributeValue[],
)
{
    if (!setId)
    {
        throw new Error("No setId provided");
    }
    if (!sessionId)
    {
        throw new Error("No sessionId provided");
    }
    else if (!workoutId)
    {
        throw new Error("No workoutId provided");
    }

    return sessionModel.updateOne(
        {
            _id: sessionId,
        },
        {
            $set: {
                "workout.$[workoutEl].sets.$[setEl].attributeValues":
                    newAttributeValues,
            },
        },
        {
            arrayFilters: [
                {"workoutEl._id": new mongoose.Types.ObjectId(workoutId)},
                {"setEl._id": new mongoose.Types.ObjectId(setId)},
            ],
        },
    );
}

export default {
    getSets,
    addSet,
    removeSet,
    updateSet,
};
