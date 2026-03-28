import { validationResult } from "express-validator";

const inputValidateMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({message: "Validation Failed", errors: errors.array()});
    }
    next();
}

export default inputValidateMiddleware;