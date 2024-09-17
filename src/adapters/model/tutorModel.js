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
      about: String,
      age: Number,
      address: String,
      qualification: String,
      skills: String,
      isBlocked: {
        type: Boolean,
        default: false,
      },
      token: Array,
    },
    {
      timestamps: true,
    }
  );
  export default mongoose.model('tutor', tutorSchema,'tutor'); 