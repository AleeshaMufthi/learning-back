import mongoose from "mongoose";
import Tutor from '../model/tutorModel.js'
import AppError from "../../framework/web/utils/appError.js";

const findTutorByEmail = async (email) =>
    await Tutor.findOne({ email })
      .select({
        email: 1,
        name: 1,
        isBlocked: 1,
        password: 1,
        phone: 1,
      })
      .catch((err) =>
        console.log("error while quering database for tutor with email", email)
      );

const findTutorByPhone = async (phone) => await Tutor.findOne({ phone });

const findTutorById = async (_id) => await Tutor.findOne({ _id });

const findTutorByTutorName = async (tutorname) =>
    await Tutor.findOne({ tutorname });

const findTutorByToken = async (token) => {
    const tutorData = Tutor.findOne({ token }).select({
      email: 1,
      name: 1,
      isBlocked: 1,
    });
    return tutorData;
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
    const updatedTutor = await Tutor.updateOne(
      { _id: tutor._id },
      {
        name: tutor.name,
        age: tutor.age,
        about: tutor.about,
        address: tutor.address,
        qualification: tutor.qualification,
        skills: tutor.skills,
      }
    );
    return updatedTutor;
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
  };
  