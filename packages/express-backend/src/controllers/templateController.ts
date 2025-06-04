import {SessionType} from "../data/session";
import sessionServices from "../services/sessionServices";
import templateServices from "../services/templateServices";
import machineServices from "../services/machineServices";
import sessionTemplateModel from "../data/sessionTemplate";
import mongoose, {Types} from "mongoose";
import {sessionTemplateType} from "../data/sessionTemplate";
import {MachineType} from "../data/machine";

type WorkoutType = sessionTemplateType["workout"];

/**
 * Save A Session In A Template
 *
 * @param {string} sessionId - id asssociated with session
 * @param {string} templateName - Name of template
 * @param {stirng} userId - Id of session
 * @return {Pomise} - To updated template
 */
async function saveSession(
    sessionId: string,
    templateName: string,
    userId: string,
)
{
    // Ensure session is owned by user
    const retrievedSession = await sessionServices.getSessionById(
        sessionId,
        userId,
    );
    if (retrievedSession.length === 0)
    {
        return null;
    }
    const sessionData: SessionType = retrievedSession[0];
    // Ensure template exists
    return await copyTemplateData(sessionData.workout, userId, templateName);
}

/**
 * Copys an existing template
 *
 * @param {stirng} templateId - Id associated with template
 * @param {string} userId - Id associated with user
 * @return {Promise} - New template copy
 */
async function copyTemplate(templateId: string, userId: string)
{
    const retrievedTemplate =
        await templateServices.getTemplateById(templateId);
    if (retrievedTemplate == null)
    {
        return null;
    }
    const newTemplateName = "Copy of " + retrievedTemplate.name;
    return await copyTemplateData(
        retrievedTemplate.workout,
        userId,
        newTemplateName,
        templateId,
    );
}

/**
 * Helper function to create a new template with mapped ids
 *
 * @param {WorkoutType} workoutData - Source of Workout Data to be mapped
 * @param {string} templateName - Name of new template
 * @param {string} userId - Id associated with user
 * @param {string} [sourceId] - Optional parameter to source for machine to be found
 * @return {Promise} - New template with mapped ids
 */
async function copyTemplateData(
    workoutData: WorkoutType,
    userId: string,
    templateName: string,
    sourceId?: string,
)
{
    const uniqueMachineIds: Types.ObjectId[] = [
        ...new Set(workoutData.map((workout) => workout.machineId)),
    ];
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();
    try
    {
        const template = await templateServices.addTemplate(
            new sessionTemplateModel({name: templateName}),
            userId,
            {session: mongoSession},
        );
        if (template === null)
        {
            throw new Error("Unable to create template");
        }
        const mapOfMachineIds: [Types.ObjectId[], Types.ObjectId[]] = [[], []];
        // GET ALL MACHINES AND PORT INFO INTO TEMPLATE
        uniqueMachineIds.forEach((id) =>
        {
            mapOfMachineIds[0].push(id);
            mapOfMachineIds[1].push(new Types.ObjectId());
        });
        let machines;
        if (sourceId)
        {
            machines = await machineServices.getSavedMachines(sourceId);
        }
        else
        {
            machines = await machineServices.getMachinesByIds(
                uniqueMachineIds.map((id) => id.toString()),
                userId,
                {session: mongoSession},
            );
        }
        if (machines)
        {
            const updatedMachines = machines.map((machine) =>
            {
                const oldId = (machine as MachineType)._id;
                const index = mapOfMachineIds[0].findIndex((id) =>
                    id.equals(oldId),
                );
                const newId = mapOfMachineIds[1][index];
                return {
                    ...machine.toObject(),
                    _id: newId,
                    attributes: machine.attributes.map((attr) => ({
                        ...attr.toObject(),
                        _id: new Types.ObjectId(),
                    })),
                };
            });
            template.set("machines", updatedMachines);
        }

        const updatedWorkouts = workoutData.map((workout) =>
        {
            const mappedWorkout = {
                ...workout,
                _id: new Types.ObjectId(),
                machineId:
                    mapOfMachineIds[1][
                        mapOfMachineIds[0].indexOf(workout.machineId)
                    ],
                sets: workout.sets.map((set) =>
                {
                    return {
                        ...set,
                        _id: new Types.ObjectId(),
                        attributeValues: set.attributeValues.map((attr) => ({
                            ...attr,
                            _id: new Types.ObjectId(),
                        })),
                    };
                }),
            };

            return mappedWorkout;
        });
        template.set("workout", updatedWorkouts);
        await template.save({session: mongoSession});

        await mongoSession.commitTransaction();
        await mongoSession.endSession();
        return template;
    }
    catch (error)
    {
        await mongoSession.abortTransaction();
        await mongoSession.endSession();
        console.error("Transaction failed:", error);
        return null;
    }
}

export default {
    saveSession,
    copyTemplate,
};
