import jwt from "jsonwebtoken";

export const verify = (req, res, next) => {

    const auth = req.header("Authorization");
    if (!auth) {
        return res.status(401).json({
            error: "Access denied: No Authorization header"
        });
    }

    const parts = auth.split(" ");
    if (parts.length !== 2) {
        return res.status(401).json({
            error: "Invalid Authorization format"
        });
    }

    const token = parts[1];
    if (!token || token === "null" || token === "undefined") {
        return res.status(401).json({
            error: "Invalid token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;

        next();

    } catch (err) {

        console.log("JWT ERROR:", err.message);
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
};