import {Router, Request, Response} from "express";
import templateServices from "../services/templateServices";
import templateController from "../controllers/templateController";
import {sessionTemplateType} from "../data/sessionTemplate";

const router = Router();

// Delete a template by id
router.delete("/:id", (req: Request, res: Response) =>
{
    templateServices
        .deleteTemplate(req.params.id, req.sub?.toString() as string)
        .then((result) =>
        {
            if (result == null)
            {
                return res.status(404).send("Session not found");
            }
            else
            {
                return res.status(204).send();
            }
        })
        .catch((err) =>
        {
            console.log(err);
            return res.status(400).send("Bad Request: " + err);
        });
});

// Return all templates
router.get("/search", (_req: Request, res: Response) =>
{
    templateServices
        .getTemplates()
        .then((result) =>
        {
            if (result == null)
            {
                return res.status(204).send("No Templates At This Time");
            }
            else
            {
                return res.status(200).send(result);
            }
        })
        .catch((err) =>
        {
            console.log(err);
            return res.status(400).send("Bad request: " + err);
        });
});

// Search a template by id
router.get("/search/:id", (req: Request, res: Response) =>
{
    templateServices
        .getTemplateById(req.params.id)
        .then((result) =>
        {
            if (result == null)
            {
                return res.status(204).send("No Template Found With This Id");
            }
            else
            {
                return res.status(200).send(result);
            }
        })
        .catch((err) =>
        {
            console.log(err);
            return res.status(400).send("Bad request: " + err);
        });
});

router.get("/", (req: Request, res: Response) =>
{
    templateServices
        .getUserTemplates(req.sub?.toString() as string)
        .then((result) =>
        {
            if (result == null)
            {
                return res.status(204).send("No user templates");
            }
            else
            {
                return res.status(200).send(result);
            }
        })
        .catch((err) =>
        {
            console.log(err);
            return res.status(400).send("Bad request: " + err);
        });
});

// Overloaded Template Data Type
// Requires Either Only Template Or fromSession, name, and id
export interface templateDataType
{
    template?: sessionTemplateType;
    fromSession?: string;
    name?: string;
    id?: string;
}

// Requires Either
// {
//      template: sessionTemplateType
// }
// OR
// {
//      fromSession: boolean,
//      name: string,
//      id: string "Object Id"
// }
// Creates a template from either existing data or a new one from scratch
router.post("/", (req: Request, res: Response) =>
{
    const templateData: templateDataType = req.body as templateDataType;
    const userId = req.sub?.toString() as string;
    console.log(
        Boolean(templateData.fromSession),
        " ",
        templateData.id,
        " ",
        templateData.name,
    );
    console.log(templateData);

    if (
        templateData.fromSession === "true" &&
        templateData.id &&
        templateData.name
    )
    {
        templateController
            .saveSession(templateData.id, templateData.name, userId)
            .then((result) =>
            {
                if (result == null)
                {
                    return res.status(400).send("No user session");
                }
                else
                {
                    return res.status(201).send(result);
                }
            })
            .catch((err) =>
            {
                console.log(err);
                return res.status(400).send("Bad request: " + err);
            });
    }
    else if (templateData.fromSession === "false" && templateData.id)
    {
        templateController
            .copyTemplate(templateData.id, userId)
            .then((result) =>
            {
                if (result == null)
                {
                    return res.status(400).send("No user templates");
                }
                else
                {
                    return res.status(201).send(result);
                }
            })
            .catch((err) =>
            {
                console.log(err);
                return res.status(400).send("Bad request: " + err);
            });
    }
    else if (templateData.template)
    {
        templateServices
            .addTemplate(req.body as sessionTemplateType, userId)
            .then((result) =>
            {
                if (result == null)
                {
                    return res.status(400).send("No user templates");
                }
                else
                {
                    return res.status(201).send(result);
                }
            })
            .catch((err) =>
            {
                console.log(err);
                return res.status(400).send("Bad request: " + err);
            });
    }
    else
    {
        res.status(400).send("Bad request");
    }
});

export default router;
