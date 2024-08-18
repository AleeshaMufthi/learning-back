import AppError from "./appError.js";

// asyncHandler wraps the function, handling any errors that occur during its execution and passing them to the Express error-handling middleware. 

const asyncHandler = (fn) => async(req, res, next) => {
    try{
        console.log("\nreq passed through async handler");
        await fn(req, res, next);
    }catch(error){
        if (!(error instanceof AppError)) {
            console.log(error);
          }
          return next(error);
        }
}

export default asyncHandler