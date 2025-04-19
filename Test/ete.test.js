const request = require('supertest');
const app = require("../src/app");
 
// Import the reset functions
const userRoutes = require("../src/Route/UserRoute");
const postRoutes = require("../src/Route/postRoute");
 
describe('E2E Testing Users and Posts API', () => {
  let createdUserId;
  let createdPostId;
 
  // Setup before all tests
  beforeAll(() => {
    console.log('📦 Starting E2E tests...');
  });
 
  // Reset in-memory DB before each test
  beforeEach(() => {
    console.log('🔄 Resetting in-memory stores before each test');
    if (userRoutes.__resetUsers) userRoutes.__resetUsers();
    if (postRoutes.__resetPosts) postRoutes.__resetPosts();
  });
 
  // Cleanup after all tests
  afterAll(() => {
    console.log('✅ All E2E tests finished.');
  });
 
  // 🧪 USERS
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com', age: 30 });
 
    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('Alice');
    createdUserId = res.body.data.id;
  });
 
  it('should fetch all users', async () => {
    await request(app).post('/users').send({ name: 'Bob', email: 'bob@example.com', age: 25 });
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
 
  it('should fetch a user by ID', async () => {
    const create = await request(app)
      .post('/users')
      .send({ name: 'Charlie', email: 'charlie@example.com', age: 22 });
 
    const id = create.body.data.id;
    const res = await request(app).get(`/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(id);
  });
 
  it('should update a user', async () => {
    const create = await request(app)
      .post('/users')
      .send({ name: 'Dana', email: 'dana@example.com', age: 28 });
 
    const id = create.body.data.id;
 
    const res = await request(app)
      .put(`/users/${id}`)
      .send({ name: 'Dana Updated' });
 
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Dana Updated');
  });
 
  it('should delete a user', async () => {
    const create = await request(app)
      .post('/users')
      .send({ name: 'Eve', email: 'eve@example.com', age: 33 });
 
    const id = create.body.data.id;
 
    const res = await request(app).delete(`/users/${id}`);
    expect(res.statusCode).toBe(200);
  });
 
  // 🧪 POSTS
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'My Post', content: 'This is the content', author: 'Author A' });
 
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('My Post');
    createdPostId = res.body.data.id;
  });
 
  it('should fetch all posts', async () => {
    await request(app).post('/posts').send({ title: 'Another Post', content: 'Yo', author: 'B' });
    const res = await request(app).get('/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
 
  it('should fetch a post by ID', async () => {
    const create = await request(app)
      .post('/posts')
      .send({ title: 'Fetch Me', content: 'Content here', author: 'X' });
 
    const id = create.body.data.id;
    const res = await request(app).get(`/posts/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(id);
  });
 
  it('should update a post', async () => {
    const create = await request(app)
      .post('/posts')
      .send({ title: 'Old Title', content: '...', author: 'Y' });
 
    const id = create.body.data.id;
 
    const res = await request(app)
      .put(`/posts/${id}`)
      .send({ title: 'Updated Post' });
 
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Post');
  });
 
  it('should delete a post', async () => {
    const create = await request(app)
      .post('/posts')
      .send({ title: 'To Delete', content: '...', author: 'Z' });
 
    const id = create.body.data.id;
 
    const res = await request(app).delete(`/posts/${id}`);
    expect(res.statusCode).toBe(200);
  });
});