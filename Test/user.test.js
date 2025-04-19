const request = require("supertest");
const app = require("../src/app");
 
describe("User Routes", () => {
 
  it("should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "John Doe", email: "john@example.com", age: 30 });
 
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("name", "John Doe");
    expect(response.body.data).toHaveProperty("email", "john@example.com");
    expect(response.body.data).toHaveProperty("age", 30);
  });
 
  it("should not create a user without name", async () => {
    const response = await request(app)
      .post("/users")
      .send({ email: "john@example.com", age: 30 });
 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name, email, and age are required");
  });
 
  it("should not create a user without email", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "John Doe", age: 30 });
 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name, email, and age are required");
  });
 
  it("should not create a user without age", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "John Doe", email: "john@example.com" });
 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name, email, and age are required");
  });
 
  it("should get all users", async () => {
    const response = await request(app).get("/users");
 
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
 
  it("should get a user by ID", async () => {
    const user = { name: "John Doe", email: "john@example.com", age: 30 };
    const createResponse = await request(app).post("/users").send(user);
 
    const userId = createResponse.body.data.id;
 
    const response = await request(app).get(`/users/${userId}`);
 
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id", userId);
    expect(response.body.data).toHaveProperty("name", "John Doe");
  });
 
  it("should return 404 for a non-existent user ID", async () => {
    const response = await request(app).get("/users/9999"); // Non-existent user ID
 
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
 
  it("should update a user by ID", async () => {
    const user = { name: "John Doe", email: "john@example.com", age: 30 };
    const createResponse = await request(app).post("/users").send(user);
 
    const userId = createResponse.body.data.id;
    const updatedUser = {
      name: "Jane Doe",
      email: "jane@example.com",
      age: 32,
    };
 
    const response = await request(app)
      .put(`/users/${userId}`)
      .send(updatedUser);
 
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("name", "Jane Doe");
    expect(response.body.data).toHaveProperty("email", "jane@example.com");
    expect(response.body.data).toHaveProperty("age", 32);
  });
 
  it("should return 404 when trying to update a non-existent user ID", async () => {
    const response = await request(app)
      .put("/users/9999") // Non-existent user ID
      .send({ name: "Updated Name" });
 
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
 
  it("should delete a user by ID", async () => {
    const user = { name: "John Doe", email: "john@example.com", age: 30 };
    const createResponse = await request(app).post("/users").send(user);
 
    const userId = createResponse.body.data.id;
 
    const deleteResponse = await request(app).delete(`/users/${userId}`);
 
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("User deleted successfully");
  });
 
  it("should return 404 when trying to delete a non-existent user ID", async () => {
    const response = await request(app).delete("/users/9999"); // Non-existent user ID
 
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
 
});
 
 