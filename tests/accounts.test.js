const app = require("../index");
const api = require("supertest")(app);
const Account = require("../models/Account");

const {
    initialAccount,
    adminAccount
} = require("./helpers");


describe("CRUD for accounts", () => {
    test("Create an account", async () => {
        const { status, body } = await api.post("/accounts/new").send({ initialAccount });
        expect(status).toBe(201);
        expect(body).toHaveProperty("message");
        expect(body.message).toHaveProperty("_id");
    });

    test("Read an account", async () => {
        const { status, body } = await api.get("/accounts/byId");
        expect(status).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toHaveProperty(email);
        expect(body.message.email).toBe(initialAccount.email);
    });

    test("Update an account", async () => {
        const NewAccount = new Account({ initialAccount });
        const { _id: toUpdateId } = NewAccount.save();
        const { status } = await api.post("/accounts/updateById").send({ id: toUpdateId, data: { ...initialAccount, email: "updatedEmail@company.com" } });
        //TODO: corner situations: hash new password!, check email company!
        expect(status).toBe(200);
        const response = await Account.findById({ toUpdateId });
        expect(response.email).toBe("updatedEmail@company.com");
    });

    test("Remove an account", async () => {
        const NewAccount = new Account({ initialAccount });
        const { _id: toDeleteId } = NewAccount.save();
        const { status } = await api.delete("/accounts/byId").send({ id: toDeleteId });
        expect(status).toBe(200);
        const response = await Account.findById(toDeleteId);
        expect(response).toHaveLength(0);
    });

    test("Log in user", async () => {
        const NewAccount = new Account({ initialAccount });
        NewAccount.save();
        const { status } = await api.post("/accounts/login").send({ email: initialAccount.email, password: initialAccount.password });
        expect(status).toBe(200);
        const { status: status2 } = await api.get("/accounts/isLogged");
        expect(status2).toBe(200);
    });

    test("Logout user", async () => {
        const NewAccount = new Account({ initialAccount });
        NewAccount.save();
        await api.post("/accounts/login").send({ email: initialAccount.email, password: initialAccount.password });
        const { status } = await api.post("/accounts/logout");
        expect(status).toBe(200);
        const { status: status2 } = await api.get("/accounts/isLogged");
        expect(status2).toBe(401);
    });
});
