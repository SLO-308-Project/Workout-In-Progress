import sessionTemplateModel, {
    sessionTemplateType,
} from "../data/sessionTemplate";

// CRUD machines, workouts, templates

/**
 * Adds A Template
 *
 * @param {sessionTemplateType} template - Template to add
 * @returns {Promise} - Template to add
 */
function addTemplate(template: sessionTemplateType)
{
    console.log(`In SESSIONSERVICES ${JSON.stringify(template)}`);
    const templateToAdd = new sessionTemplateModel(template);
    return templateToAdd.save();
}

/**
 * Returns A Template By Id
 *
 * @param {String} id - Id of template object
 * @returns {Promise} - Template object if found or Undefined
 */
function getTemplateById(id: string)
{
    return sessionTemplateModel.findById(id);
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
 * @param {String} id - ID of template to delete
 * @returns {Promise} - Removes template object
 */
function deleteTemplate(id: string)
{
    return sessionTemplateModel.findByIdAndDelete(id);
}

export default {
    addTemplate,
    deleteTemplate,
    getTemplateById,
    getTemplates,
};
