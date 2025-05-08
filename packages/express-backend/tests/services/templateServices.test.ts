import sessionTemplateModel from "../../src/data/sessionTemplate";
import templateServices from "../../src/services/templateServices";

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
            machienIds: [],
        });
        jest.spyOn(sessionTemplateModel.prototype, "save").mockResolvedValue(
            template,
        );
        const result = await templateServices.addTemplate(template);
        expect(result).toBeTruthy();
    });

    test("Delete template -- successful", async () =>
    {
        const template = new sessionTemplateModel({
            workout: [],
            machineIds: [],
        });
        const templateId = template._id?.toString() || "";
        sessionTemplateModel.findByIdAndDelete = jest
            .fn()
            .mockResolvedValue(template);
        const result = await templateServices.deleteTemplate(templateId);
        expect(result).toBeTruthy();
        expect(result!._id!.toString()).toBe(templateId);
    });
});
