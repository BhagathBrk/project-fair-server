const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log("Inside JWT Middleware");

    // Check if Authorization header exists
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization Failed... Token is Missing" });
    }

    try {
        // Extract token
        const token = authHeader.split(" ")[1];
        console.log("Token received:", token);

        // Verify JWT token
        const jwtResponse = jwt.verify(token, process.env.JWTPASSWORD);
        console.log("JWT Verified:", jwtResponse);

        // Attach userId to the request object
        req.userId = jwtResponse.userId;

        // Proceed to the next middleware/controller
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(403).json({ message: "Authorization failed... Please login!" });
    }
};

module.exports = jwtMiddleware;
