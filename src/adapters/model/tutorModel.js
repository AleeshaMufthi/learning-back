import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
    {
      name: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      phone: { 
        type: String,
        required: true,
        unique: true,
      },
      tutorname: {
        type: String,
        required: true,
        unique: true,
      },
      role: { 
        type: String, 
        default: "tutor", 
        enum: ["tutor"] 
      },
      about: String,
      age: Number,
      address: String,
      qualification: String,
      skills: String,
      thumbnail: {
        type: String,
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );
  export default mongoose.model('tutors', tutorSchema,'tutors'); 