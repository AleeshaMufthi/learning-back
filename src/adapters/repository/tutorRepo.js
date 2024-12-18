import mongoose from "mongoose";
import Tutor from '../model/tutorModel.js'
import AppError from "../../framework/web/utils/appError.js";

const findTutorByEmail = async (email) => {
  try {
    const tutor = await Tutor.findOne({ email }).select({
      email: 1,
      name: 1,
      isBlocked: 1,
      password: 1,
      phone: 1,
    });
    if (!tutor) {
      console.log("Tutor not found for email:", email);
    }
    return tutor;
  } catch (err) {
    console.error("Error querying tutor by email:", err);
    throw err; // Rethrow to propagate the error
  }
}

const findTutorByPhone = async (phone) => await Tutor.findOne({ phone });

const findTutorById = async (_id) => await Tutor.findOne({ _id });

const findTutorByTutorName = async (tutorname) =>
    await Tutor.findOne({ tutorname });

const findTutorByToken = async (email) => {
  try {
    return await Tutor.findOne({ email }).select({
      email: 1,
      name: 1,
      isBlocked: 1,
    });
  } catch (err) {
    console.error("Error querying database for tutor by token:", err);
    return null; // Return null on error
  }
  };

  const updatePassword = async ({ email, hashedPassword }) => {
    try{
     return await Tutor.findOneAndUpdate(
      {email},
      {password: hashedPassword},
      { new: true}
     )
    }catch(error){
      throw new Error("Database error while updating user password")
    }
};

  const createTutor = async ({ name, password, phone, email, tutorname }) => {
    const tutor = new Tutor({
      name,
      email,
      phone,
      password,
      tutorname,
      role: 'tutor',
    });
  
    return tutor
      .save()
      .then((response) => response)
      .catch((error) => {
        console.log("Error saving tutor data to database - ", error);
        throw new AppError.database(
          "An error occured while processing your data"
        );
      });
  };

  const addRefreshTokenById = async (_id, token) => {
    await Tutor.updateOne({ _id }, { $push: { token } });
  };
  
  const findByTokenAndDelete = async (token) => {
    const isTokenPresent = await Tutor.findOneAndUpdate(
      { token },
      { $pull: { token } }
    );
    return isTokenPresent;
  };

  const checkIsBlocked = async (email) => {
    const tutor = await Tutor.findOne({ email }).select({ isBlocked: 1 });
    return Tutor.isBlocked;
  };

  const getAllTutor = async () => {
    const tutors = await Tutor.find();
    return tutors;
  };
  const blockTutorById = async (_id) => {
    const isBlocked = await Tutor.updateOne({ _id }, { isBlocked: true });
    return isBlocked;
  };
  const unblockTutorById = async (_id) => {
    const isBlocked = await Tutor.updateOne({ _id }, { isBlocked: false });
    return isBlocked;
  };

  const updateDetailsById = async (tutor) => {
    const {tutorDetails, thumbnail } = tutor
    const updatedField = {
      name: tutorDetails.name,
      age: tutorDetails.age,
      qualification: tutorDetails.qualification,
      address: tutorDetails.address,
      about: tutorDetails.about,
      thumbnail
    }
    const updatedTutor = await Tutor.updateOne(
      {
        _id: tutorDetails._id,
      },{
        $set: updatedField
      }
    )
    return updatedTutor;
  };


  const getTutors = async (limit) => {
    const topTutors = await Tutor.find({}).limit(limit).select("name email");
    return topTutors;
  };

  
  export {
    createTutor,
    findTutorByEmail,
    findTutorByPhone,
    findTutorByToken,
    findTutorById,
    findTutorByTutorName,
    updatePassword,
    addRefreshTokenById,
    findByTokenAndDelete,
    checkIsBlocked,
    getAllTutor,
    blockTutorById,
    unblockTutorById,
    updateDetailsById,
    getTutors,
  };
  