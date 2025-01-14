import { objectIdSchema } from '../../entities/idValidator.js'

 const validateParams = (req, res, next) => {
    const ObjectId = req.params.id;
    const { error } = objectIdSchema.validate(ObjectId);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        message: `'${ObjectId}' - Is Invalid Id`,
      });
    }
    next();
  };

  export default validateParams

  