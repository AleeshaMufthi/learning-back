import AppError from '../utils/appError.js';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const errorHandler = (err, req, res, next) => {
    console.log("\nIs Error instance of App Error", err instanceof AppError);
    if(err instanceof AppError){
        const statusCode = err.statusCode || 500
        console.log('Error message is: ',err.message)
        const responseData = {
            errors: {
                code: err.appCode || StatusCodes.INTERNAL_SERVER_ERROR,
                message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR
            }
        }
        return res.status(statusCode).json(responseData)
    }
    console.log('error is',err)
    return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({message: ReasonPhrases.INTERNAL_SERVER_ERROR})
}

export default errorHandler