import jwt from 'jsonwebtoken';

const authCheckMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        req.isAuth = false;
        return next();
    }
    console.log("Token provided");
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.isAuth = true;
        req.user = decoded;
        return next();
    }catch(err){
        req.isAuth = false;
        return next();
    }
}

export default authCheckMiddleware;