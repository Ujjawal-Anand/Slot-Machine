const jwt = require("jsonwebtoken");// middleware to validate token

exports.authCheck = async (req) => {
    const token = req.header("authtoken");
    if (!token) throw new Error('No auth token found');
    try {
        result = await jwt.verify(token, process.env.SECRET_KEY);
        authData = { email: result.email, token, id: result._id }
        return authData;
        } catch (err) {
            throw err
        }
};

exports.authCheckMiddleware = (req, res, next) => {
    const token = req.header("authtoken");
    if (!token) return res.status(401).json({ error: "Access denied" });  
  
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next(); // to continue the flow
    } catch (err) {
        res.status(400).json({ error: "Token is not valid" });
    }
};
