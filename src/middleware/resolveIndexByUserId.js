import { users } from '../users.js'

export const resolveIndexByUserId = (req, res, next) => {
    const {
       params : { id },
    } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        const error = new Error("Invalid value");
        error.statusCode = 400;
        return next(error);
    }
    const findUserIndex = users.findIndex( user => user.id == parsedId);
    if (findUserIndex == -1) {
        const error = new Error("User not found");
        error.statusCode = 404;
        return next(error);
    }

    req.findUserIndex = findUserIndex; 
    next();
}