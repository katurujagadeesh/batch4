const { verifyAccessToken } = require('../utility/tokenUtil');
const { sendResponse } = require('./middleware');
 
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("authHeader..",authHeader);
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token..",token);
    if (!token) return sendResponse(res, 401, 'Access token required');
 
    try {
        const user = verifyAccessToken(token);
        req.user = user;
        next();
    } catch (err) {
        return sendResponse(res, 403, 'Invalid or expired token');
    }
};
 
module.exports = {
    authenticateToken,
};
 