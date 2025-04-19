const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./Route/UserRoute');
const postRoutes = require('./Route/postRoute');
 // fixed path
 
const app = express();
const port = 3000;
 
// Middleware to parse JSON data
app.use(bodyParser.json());
 
// In-memory user data store
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
 
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;  