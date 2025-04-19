const request = require("supertest");
const app = require("../src/app"); // ✅ this is correct
 
describe("Post Routes", () => {
  it("should create a new post", async () => {
    const response = await request(app)
      .post("/posts")
      .send({ title: "Test", content: "Content", author: "Author" });
 
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("title", "Test");
    expect(response.body.data).toHaveProperty("content", "Content");
    expect(response.body.data).toHaveProperty("author", "Author");
  });
 
  it("should not create a post without title", async () => {
    const response = await request(app)
      .post("/posts")
      .send({ content: "Content", author: "Author" });
 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Title, content, and author are required"
    );
  });
 
  it("should not create a post without content", async () => {
    const response = await request(app)
      .post("/posts")
      .send({ title: "Test", author: "Author" });
 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Title, content, and author are required"
    );
  });
 
  it("should not create a post without author", async () => {
    const response = await request(app)
      .post("/posts")
      .send({ title: "Test", content: "Content" });
 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Title, content, and author are required"
    );
  });
 
  it("should get all posts", async () => {
    const response = await request(app).get("/posts");
 
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
 
  it("should get a post by ID", async () => {
    const post = { title: "Test Post", content: "Content", author: "Author" };
    const createResponse = await request(app).post("/posts").send(post);
 
    const postId = createResponse.body.data.id;
 
    const response = await request(app).get(`/posts/${postId}`);
 
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id", postId);
    expect(response.body.data).toHaveProperty("title", "Test Post");
  });
 
  it("should return 404 for a non-existent post ID", async () => {
    const response = await request(app).get("/posts/9999"); // Non-existent post ID
 
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });
 
  it("should update a post by ID", async () => {
    const post = { title: "Test Post", content: "Content", author: "Author" };
    const createResponse = await request(app).post("/posts").send(post);
 
    const postId = createResponse.body.data.id;
    const updatedPost = {
      title: "Updated Post",
      content: "Updated Content",
      author: "Updated Author",
    };
 
    const response = await request(app)
      .put(`/posts/${postId}`)
      .send(updatedPost);
 
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("title", "Updated Post");
    expect(response.body.data).toHaveProperty("content", "Updated Content");
    expect(response.body.data).toHaveProperty("author", "Updated Author");
  });
 
  it("should return 404 when trying to update a non-existent post ID", async () => {
    const response = await request(app)
      .put("/posts/9999") // Non-existent post ID
      .send({ title: "Updated Post" });
 
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });
 
  it("should delete a post by ID", async () => {
    const post = { title: "Test Post", content: "Content", author: "Author" };
    const createResponse = await request(app).post("/posts").send(post);
 
    const postId = createResponse.body.data.id;
 
    const deleteResponse = await request(app).delete(`/posts/${postId}`);
 
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Post deleted successfully");
  });
 
  it("should return 404 when trying to delete a non-existent post ID", async () => {
    const response = await request(app).delete("/posts/9999"); // Non-existent post ID
 
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });
});