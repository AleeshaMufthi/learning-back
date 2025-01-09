import { objectIdSchema } from "../../entities/idValidator.js";
import tutorDetailsSchema from "../../entities/tutorValidator.js";
import AppError from "../../framework/web/utils/appError.js";
import asyncHandler from "express-async-handler";
import tutorService from "../../usecases/tutorService.js";

export const getAllTutors = async (req, res) => {
  const tutors = await tutorService.getAllTutors();
  return res.status(200).json({ message: "tutors found", data: tutors });
};
export const blockTutor = async (req, res) => {
    const isBlocked = await tutorService.blockTutor(req.body.userId);
    return res.status(200).json({ message: "Tutor Blocked Successfully" });
};

export const unblockTutor = async (req, res) => {
    const isBlocked = await tutorService.unblockTutor(req.body.userId);
    return res.status(200).json({ message: "Tutor unBlocked successfully" });
};

export const getTutorDetails = asyncHandler(async (req, res) => {
    const { value, error } = objectIdSchema.validate(req.tutor?._id);
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    const tutorDetails = await tutorService.getTutorDetails(value);
    
    return res.status(200).json({ message: "tutor details found", tutorDetails });
});

export const updateTutorDetails = asyncHandler(async (req, res) => {
    const { value, error } = tutorDetailsSchema.validate(req.body);
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    if(!req.file){
      throw AppError.validation("Thumbnail is required")
    }
    const tutorData = await tutorService.updateTutorDetails({
      ...value,
      _id: req.tutor._id,
    }, req.file);
    
    res
      .status(200)
      .json({ message: "tutor details updated successfully", data: tutorData });
});

export const getTopTutors = async (req, res) => {
  const topTutors = await tutorService.getTopTutors();
  return res.status(200).json({
    message: "Top tutors found",
    data: topTutors,
  });
};

export default {
    getAllTutors,
    blockTutor,
    unblockTutor,
    getTutorDetails,
    updateTutorDetails,
    getTopTutors,
}