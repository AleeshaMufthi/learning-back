import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        refPath: 'senderType',
        required: true,
    },
    senderType: {
        type: String,
        enum: ['Users', 'Tutors'], 
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        required: true
    },
    messageTime: {
        type: Date,
        default: new Date()
    }
},{
    timestamps: true
})

export default mongoose.model("message", messageSchema, "message")

