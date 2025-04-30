const express = require('express');
 const dotenv = require('dotenv');
 const bodyParser = require('body-parser');
 const userRoutes =require('./route/userRoute');
 const postRoutes = require('./route/postRoute');
 const userAuthRoutes = require('./route/userAuth')
 dotenv.config();
 const app = express();
 const port = 3000;
 
 
 app.use(bodyParser.json());
 
 
 
 
 app.use("/users", userRoutes);
 app.use("/posts", postRoutes);
 app.use("/users/Auth",userAuthRoutes);
 app.listen(port, () => {
    console.log("Server is running on http://localhost:3000");
    
 });
 module.exports = app;