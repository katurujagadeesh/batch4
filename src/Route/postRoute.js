const express = require('express');
const router = express.Router();
const resetposts = () => { posts = []; };
let posts = [];
const sendResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        statusCode,
        message,
        data,
    });
};
 
// Create post
router.post('/', (req, res) => {
    const { title, content, author } = req.body;
 
    if (!title || !content || !author) {
        return sendResponse(res, 400, 'Title, content, and author are required');
    }
 
    const post = {
        id: posts.length + 1,
        title,
        content,
        author,
        createdAt: new Date()
    };
 
    posts.push(post);
    return sendResponse(res, 201, 'Post created successfully', post);
});
 
// Get all posts (R in CRUD)
router.get('/', (req, res) => {
    return sendResponse(res, 200, 'Posts retrieved successfully', posts);
});
 
// Get post by ID (R in CRUD)
router.get('/:id', (req, res) => {
    const post = posts.find((u) => u.id === parseInt(req.params.id));
 
    if (!post) {
        return sendResponse(res, 404, 'Post not found');
    }
 
    return sendResponse(res, 200, 'Post retrieved successfully', post);
 
 
 
});
 
// Update post (U in CRUD)
router.put('/:id', (req, res) => {
    const { title, content, author } = req.body;
    const post = posts.find((u) => u.id === parseInt(req.params.id));
 
   
    if (!post) {
        return sendResponse(res, 404, 'Post not found');
    }
 
    if (title) post.title = title;
    if (content) post.content = content;
    if (author) post.author = author;
 
    return sendResponse(res, 200, 'Post updated successfully', post);
});
 
// Delete user
router.delete('/:id', (req, res) => {
    const postIndex = posts.findIndex((u) => u.id === parseInt(req.params.id));
 
    if (postIndex === -1) {
        return sendResponse(res, 404, 'Post not found');
    }
 
    posts.splice(postIndex, 1);
    return sendResponse(res, 200, 'Post deleted successfully',postIndex); // Status 200 instead of 204
});
 
 
module.exports = router;
module.exports.__resetposts = resetposts;