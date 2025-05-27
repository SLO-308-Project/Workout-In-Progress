import sessionTemplateModel, {
    sessionTemplateType,
} from "../data/sessionTemplate";
import mongoose, {PipelineStage, Types} from "mongoose";
import userModel from "../data/user";
import templateListModel from "../data/templateList";

// CRUD machines, workouts, templates

/**
 * Gets list of all machines associated with a user
 *
 * @param {String} userId - The user associated id
 * @return {Promise} - List of user sessions
 */
function aggregateUserTemplates(userId: string)
{
    return [
        {$match: {_id: new Types.ObjectId(userId)}}, // Find user by email
        {
            //Attach all machineLogs as an array called collectedMachineLogs.
            $lookup: {
                from: "templateLists",
                localField: "templateListId",
                foreignField: "_id",
                as: "collectedTemplateLists",
            },
        },
        //Turn collectedMachineLogs from an array into multiple objects.
        {$unwind: "$collectedTemplateLists"},
        {
            //Attach all machines as an array called collectedMachines.
            $lookup: {
                from: "sessionTemplates",
                localField: "collectedTemplateLists.templateIds",
                foreignField: "_id",
                as: "collectedTemplates",
            },
        },
        //Turn collectedMachines from an array into multiple objects.
        {$unwind: "$collectedTemplates"},
        {
            //renames "$collectedMachines.name" and "$collectedMachines.muscle" as top level fields called name and muscle.
            $project: {
                machines: "$collectedTemplates.machines",
                workout: "$collectedTemplates.workout",
                _id: "$collectedTemplates._id",
            },
        },
    ];
}

/**
 * Adds A Template
 *
 * @param {sessionTemplateType} template - Template to add
 * @param {string} userId - User associated id
 * @param {mongoose.ClientSession} [session] - Optional Mongoose Session
 * @returns {Promise} - Template to add
 */
function addTemplate(
    template: sessionTemplateType,
    userId: string,
    options?: {session?: mongoose.ClientSession},
)
{
    console.log(`In SESSIONSERVICES ${JSON.stringify(template)}`);
    const templateToAdd = new sessionTemplateModel(template);

    return userModel
        .findById(userId, null, options)
        .then((user) =>
        {
            return templateListModel.findByIdAndUpdate(
                {_id: user?.templateListId},
                {$push: {templateIds: templateToAdd._id}},
                options,
            );
        })
        .then((template) =>
        {
            if (template == null)
            {
                throw new Error("Unable to create new session");
            }
            return templateToAdd.save(options);
        })
        .catch((err) =>
        {
            console.log(err);
            return null;
        });
}

/**
 * Returns A Template By Id
 *
 * @param {string} id - Id of template object
 * @returns {Promise} - Template object if found or Undefined
 */
function getTemplateById(id: string)
{
    return sessionTemplateModel.findById(id);
}

/**
 * Get a user's template
 *
 * @param {string} userId - User associated id
 * @returns {Promise} - Array of templates
 */
function getUserTemplates(userId: string)
{
    const listOfTemplates: PipelineStage[] = aggregateUserTemplates(userId);
    return userModel.aggregate(listOfTemplates);
}

/**
 * Returns All Templates
 *
 * @returns {Promise} - All templates
 */
function getTemplates()
{
    return sessionTemplateModel.find();
}

/**
 * Deletes a Template By id
 *
 * @param {string} userId - User associated id
 * @param {string} id - ID of template to delete
 * @returns {Promise} - Removes template object
 */
function deleteTemplate(id: string, userId: string)
{
    return userModel
        .findOne({_id: userId})
        .then((user) =>
        {
            templateListModel.findOneAndUpdate(
                {_id: user?.templateListId},
                {$pull: {templateIds: id}},
            );
        })
        .then(() =>
        {
            return sessionTemplateModel.findByIdAndDelete(id);
        })
        .catch((error) =>
        {
            console.log(error);
        });
}

export default {
    addTemplate,
    deleteTemplate,
    getTemplateById,
    getTemplates,
    getUserTemplates,
};
