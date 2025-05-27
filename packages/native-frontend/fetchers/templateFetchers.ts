import Constants from "expo-constants";
const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL;

/**
 * Returns all Templates for the authenticated User.
 * @returns
 */
function fetchGetTemplates(): Promise<Response>
{
    return fetch(`${BACKEND_URL}/templates`);
}

/**
 * Deep deletes the template from the user (both reference and actual data).
 * @param id
 * @returns
 */
function fetchDeleteTemplate(id: string): Promise<Response>
{
    return fetch(`${BACKEND_URL}/templates/${id}`, {
        method: "DELETE",
    });
}

/**
 * Creates template based on either a session or an existing template.
 *      if fromSession==False Id is a templateId and will create a deep copy of the template.
 *      if fromSession==True Id is a sessionId and will create a template from the session.
 * @param sessionId
 * @param templateName
 * @returns
 */
function fetchCreateTemplate(
    id: string,
    templateName: string,
    fromSession: boolean,
): Promise<Response>
{
    return fetch(`${BACKEND_URL}/templates`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: `${id}`,
            name: `${templateName}`,
            fromSession: `${fromSession}`,
        }),
    });
}

/**
 * Upadates the Template name for the given templateId.
 * @param templateId
 * @param newName
 * @returns
 */
function fecthUpdateTemplateName(
    templateId: string,
    newName: string,
): Promise<Response>
{
    return fetch(`${BACKEND_URL}/templates`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            newName: `${newName}`,
        }),
    });
}

export {
    fetchGetTemplates,
    fetchDeleteTemplate,
    fetchCreateTemplate,
    fecthUpdateTemplateName,
};
