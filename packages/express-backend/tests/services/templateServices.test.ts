import sessionTemplateModel from "../../src/data/sessionTemplate";
import templateServices from "../../src/services/templateServices";
import userModel from "../../src/data/user";
import templateListModel from "../../src/data/templateList";

describe("Template Services Tests", () =>
{
    beforeAll(() =>
    {});

    afterAll(async () =>
    {});

    // Clean up for each test
    beforeEach(() =>
    {
        jest.clearAllMocks();
    });

    afterEach(async () =>
    {});

    test("Get templates -- successful", async () =>
    {
        const templates = [
            new sessionTemplateModel(),
            new sessionTemplateModel(),
            new sessionTemplateModel(),
        ];
        sessionTemplateModel.find = jest.fn().mockResolvedValue(templates);
        const result = await templateServices.getTemplates();
        expect(result.length).toBe(3);
    });

    test("Get template by id -- successful", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machineIds: [],
        });
        const templateId = template._id?.toString() || "";
        sessionTemplateModel.findById = jest.fn().mockResolvedValue(template);
        const result = await templateServices.getTemplateById(templateId);
        expect(result).toBeTruthy();
    });

    test("Create template -- successful", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machineIds: [],
        });
        const templateList = new templateListModel({
            templateIds: [template._id],
        });
        const user = new userModel({
            templateListId: templateList._id,
        });
        const userId = user._id?.toString() || "";
        userModel.findById = jest.fn().mockResolvedValue(user);
        templateListModel.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(templateList);
        jest.spyOn(sessionTemplateModel.prototype, "save").mockResolvedValue(
            template,
        );
        const result = await templateServices.addTemplate(template, userId);
        expect(result).toBeTruthy();
    });

    test("Create template -- failure no template", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machineIds: [],
        });
        const templateList = new templateListModel({
            templateIds: [],
        });
        const user = new userModel({
            templateListId: templateList._id,
        });
        const userId = user._id?.toString() || "";
        userModel.findById = jest.fn().mockResolvedValue(user);
        templateListModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
        const result = await templateServices.addTemplate(template, userId);
        expect(result).toBeFalsy();
    });

    test("Create template -- failure no user", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machineIds: [],
        });
        const userId = "";
        userModel.findById = jest.fn().mockResolvedValue(null);
        const result = await templateServices.addTemplate(template, userId);
        expect(result).toBeFalsy();
    });

    test("Delete template -- successful", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machineIds: [],
        });
        const templateId = template._id?.toString() || "";
        const templateList = new templateListModel({
            templateIds: [template._id],
        });
        const user = new userModel({
            templateListId: templateList._id,
        });
        const userId = user._id?.toString() || "";
        userModel.findOne = jest.fn().mockResolvedValue(user);
        templateListModel.findOneAndUpdate = jest
            .fn()
            .mockResolvedValue(templateList);
        sessionTemplateModel.findByIdAndDelete = jest
            .fn()
            .mockResolvedValue(template);
        const result = await templateServices.deleteTemplate(
            templateId,
            userId,
        );
        expect(result).toBeTruthy();
        expect(result!._id!.toString()).toBe(templateId);
    });

    test("Delete template -- failure user search fail", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machineIds: [],
        });
        const templateId = template._id?.toString() || "";
        const userId = "";
        userModel.findOne = jest.fn().mockImplementation(async () =>
        {
            await Promise.reject(new Error("Boom"));
        });
        const result = await templateServices.deleteTemplate(
            templateId,
            userId,
        );
        expect(result).toBeFalsy();
    });

    test("Delete template -- failure no user", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machineIds: [],
        });
        const templateId = template._id?.toString() || "";
        const userId = "";
        userModel.findOne = jest.fn().mockResolvedValue(null);
        const result = await templateServices.deleteTemplate(
            templateId,
            userId,
        );
        expect(result).toBeFalsy();
    });

    test("Get user templates", async () =>
    {
        const user = new userModel();
        const userId = user._id?.toString() || "";
        const templates = [
            new sessionTemplateModel(),
            new sessionTemplateModel(),
        ];
        userModel.aggregate = jest.fn().mockResolvedValue(templates);
        const result = await templateServices.getUserTemplates(userId);
        expect(result).toBeTruthy();
        expect(result.length).toBe(2);
    });

    test("Update template -- successful", async () =>
    {
        const template = new sessionTemplateModel({
            name: "OLD",
            workout: [],
            machineIds: [],
        });
        const updatedTemplate = new sessionTemplateModel({
            name: "NEW",
            workout: [],
            machineIds: [],
        });
        const templateList = new templateListModel({
            templateIds: [template._id],
        });
        const user = new userModel({
            templateListId: templateList._id,
        });
        const userId = user._id?.toString() || "";
        const templateId = template._id?.toString() || "";
        userModel.aggregate = jest.fn().mockResolvedValue([template]);
        sessionTemplateModel.findByIdAndUpdate = jest
            .fn()
            .mockResolvedValue(templateList);
        const result = await templateServices.updateTemplate(
            userId,
            templateId,
            updatedTemplate,
        );
        expect(result).toBeTruthy();
    });

    test("Update template -- failure no template to update", async () =>
    {
        const updatedTemplate = new sessionTemplateModel({
            name: "NEW",
            workout: [],
            machineIds: [],
        });
        const templateList = new templateListModel({
            templateIds: [],
        });
        const user = new userModel({
            templateListId: templateList._id,
        });
        const userId = user._id?.toString() || "";
        const templateId = "a3f9c1e7b5d8426f90ab13cd";
        userModel.aggregate = jest.fn().mockResolvedValue([]);
        const result = await templateServices.updateTemplate(
            userId,
            templateId,
            updatedTemplate,
        );
        expect(result).toBeFalsy();
    });
});
