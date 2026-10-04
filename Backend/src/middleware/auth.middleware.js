import jwt from "jsonwebtoken";

function authenticate(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
        success: false,
        message: "Access token missing",
    });
}

try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
} catch (error) {
    return res.status(401).json({
        success: false,
        message: "Invalid access token",
    });
}

}

export { authenticate };