"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sessionTemplate_1 = __importDefault(require("../../src/data/sessionTemplate"));
const templateServices_1 = __importDefault(require("../../src/services/templateServices"));
describe("Template Services Tests", () => {
    beforeAll(() => { });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { }));
    // Clean up for each test
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () { }));
    test("Get templates -- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const templates = [
            new sessionTemplate_1.default(),
            new sessionTemplate_1.default(),
            new sessionTemplate_1.default(),
        ];
        sessionTemplate_1.default.find = jest.fn().mockResolvedValue(templates);
        const result = yield templateServices_1.default.getTemplates();
        expect(result.length).toBe(3);
    }));
    test("Get template by id -- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const template = new sessionTemplate_1.default({
            workout: [],
            machineIds: [],
        });
        const templateId = ((_a = template._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        sessionTemplate_1.default.findById = jest.fn().mockResolvedValue(template);
        const result = yield templateServices_1.default.getTemplateById(templateId);
        expect(result).toBeTruthy();
    }));
    test("Create template -- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const template = new sessionTemplate_1.default({
            workout: [],
            machienIds: [],
        });
        jest.spyOn(sessionTemplate_1.default.prototype, "save").mockResolvedValue(template);
        const result = yield templateServices_1.default.addTemplate(template);
        expect(result).toBeTruthy();
    }));
    test("Delete template -- successful", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const template = new sessionTemplate_1.default({
            workout: [],
            machineIds: [],
        });
        const templateId = ((_a = template._id) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        sessionTemplate_1.default.findByIdAndDelete = jest
            .fn()
            .mockResolvedValue(template);
        const result = yield templateServices_1.default.deleteTemplate(templateId);
        expect(result).toBeTruthy();
        expect(result._id.toString()).toBe(templateId);
    }));
});
