//const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken"
// Middleware
export const verify = (req, res, next) => {
    const auth = req.header('Authorization');
    if (!auth)
        return res.status(401).send('Access denied!!!')
    //Check for value of token
    let token = auth.split(' ')[1];
    if (!token)
        return res.status(401).send('Access denied!!!')
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verify;
        next()
    } catch (err) {
        console.log(err)
        return res.status(400).send('Invalid token!!!')
    }
}