const express = require('express');
const { sendResponse } = require('../middleware/middleware');
const router = express.Router();
const bcrypt = require('bcrypt');
const {validate,registerSchema,loginSchema} = require('../middleware/userAuthValidation')
const {generateTokens} = require('../utility/tokenUtil')
let users = [];
let refreshTokens = [];
 
//registration
router.post('/register', validate(registerSchema), async (req, res) => {
    const { name, email, password, age } = req.body;
 
    const existing = users.find(u => u.email === email);
    if (existing) return sendResponse(res, 400, 'Email already exists');
 
    const hashedPassword = await bcrypt.hash(password, 10);
//  console.log("hashedPassword",hashedPassword)
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        age
    };
 
    users.push(newUser);
    const tokens = generateTokens(newUser);
    refreshTokens.push(tokens.refreshToken);
 
    return sendResponse(res, 201, 'User registered', { user: { id: newUser.id, email }, ...tokens });
});
 
//login
router.post('/login',validate(loginSchema),async(req,res)=>{
    const { email, password } = req.body;
 
    const user = users.find(u => u.email === email);
    if (!user) return sendResponse(res, 401, 'Invalid credentials');
 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendResponse(res, 401, 'Invalid credentials');
 
    const tokens = generateTokens(user);
    refreshTokens.push(tokens.refreshToken);
 
    return sendResponse(res, 200, 'Login successful', { user: { id: user.id, email }, ...tokens });
})
module.exports = router