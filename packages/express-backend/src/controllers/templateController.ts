import {SessionType} from "../data/session";
import sessionServices from "../services/sessionServices";
import templateServices from "../services/templateServices";
import machineServices from "../services/machineServices";
import sessionTemplateModel from "../data/sessionTemplate";
import mongoose, {Types} from "mongoose";
import {sessionTemplateType} from "../data/sessionTemplate";
import {MachineType} from "../data/machine";

type WorkoutType = sessionTemplateType["workout"];
type MachineTypeWithId = MachineType & {_id: Types.ObjectId};

/**
 * Save A Session In A Template
 *
 * @param {string} sessionId - id asssociated with session
 * @param {string} templateName - Name of template
 * @param {string} userId - Id of session
 * @return {Promise} - To updated template
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
    const templateSourceId = sessionData.templateId?.toString();
    // Ensure template exists
    return await copyTemplateData(
        sessionData.workout,
        userId,
        templateName,
        templateSourceId,
    );
}

/**
 * Copies an existing template
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
 * Helper function to copy workout data with new ids
 *
 * @param {WorkoutType} workoutData - Source of Workout Data to be mapped
 * @param {Map<string, Types.ObjectId>()} machineMap - Map to ensure consistent machine ids
 * @return {WorkoutType[]}
 */
function copyWorkoutData(
    workoutData: WorkoutType,
    machineMap: Map<string, Types.ObjectId>,
)
{
    return workoutData.map((workout) =>
    {
        const mappedWorkout = {
            ...workout,
            _id: new Types.ObjectId(),
            machineId: machineMap.get(workout.machineId.toString()),
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
}

/**
 * Helper function to copy machine data with new ids
 *
 * @param {MachineType[]} machines - Source of machines to be mapped
 * @param {Map<string, Types.ObjectId>()} machineMap - Map to ensure consistent machine ids
 * @returns {MachineType[]}
 */
function copyMachineData(
    machines: MachineTypeWithId[],
    machineMap: Map<string, Types.ObjectId>,
)
{
    return machines.map((machine) =>
    {
        const oldId = machine._id.toString();
        const newId = machineMap.get(oldId);
        return {
            ...machine,
            _id: newId,
            attributes: machine.attributes.map((attr) => ({
                ...attr,
                _id: new Types.ObjectId(),
            })),
        };
    });
}

/**
 * Helper function to retrieve correct machine data
 *
 * @param {string} sourceId - template source id
 * @param {Types.ObjectId[]} machineIds - machines to retrieve via id
 * @param {string} userId - user associated id
 * @param {mongoose.mongo.ClientSession} mongoSession - session for transaction
 * @returns {Promise}
 */
async function retrieveMachines(
    sourceId: string | undefined,
    machineIds: Types.ObjectId[],
    userId: string,
    mongoSession: mongoose.mongo.ClientSession,
)
{
    let machines: MachineType[] = [];
    const userMachines = await machineServices.getMachinesByIds(
        machineIds.map((id) => id.toString()),
        userId,
        {session: mongoSession},
    );
    const plainUserMachines = userMachines?.map((m) => m.toObject()) ?? [];
    machines = machines.concat(plainUserMachines);
    if (sourceId)
    {
        const templateMachines =
            await machineServices.getSavedMachines(sourceId);
        const plainAdditionalMachines =
            templateMachines?.map((m) => m.toObject()) ?? [];
        machines = machines.concat(plainAdditionalMachines);
    }
    console.log("MARKER");
    console.log(machines);
    return machines;
}

/**
 * Generate a 1 to 1 mapping of machine ids with new unique ids
 *
 * @param {Types.ObjectId[]} uniqueMachineIds - machine ids to populate map with
 * @return {Map<string, Types.ObjectId>}
 */
function generateMachineMap(uniqueMachineIds: Types.ObjectId[])
{
    const mapOfMachineIds = new Map<string, Types.ObjectId>();
    uniqueMachineIds.forEach((id) =>
    {
        if (!mapOfMachineIds.has(id.toString()))
        {
            mapOfMachineIds.set(id.toString(), new Types.ObjectId());
        }
    });
    return mapOfMachineIds;
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
        const mapOfMachineIds = generateMachineMap(uniqueMachineIds);
        const machines = (await retrieveMachines(
            sourceId,
            uniqueMachineIds,
            userId,
            mongoSession,
        )) as MachineTypeWithId[];

        if (machines)
        {
            const updatedMachines = copyMachineData(machines, mapOfMachineIds);
            template.set("machines", updatedMachines);
        }

        const updatedWorkouts = copyWorkoutData(workoutData, mapOfMachineIds);
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
