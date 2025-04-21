// Helper function to standardize response format
const sendResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        statusCode,
        message,
        data,
    });
};
 
module.exports = { sendResponse };
 