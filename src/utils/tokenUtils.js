const jwt = require('jsonwebtoken');
 
 
const jwt = require('jsonwebtoken');
 
const generateTokens = (user) => {
 
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
 
    return { accessToken, refreshToken };
};
 
const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);
 
module.exports = {
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken,
};
 
 