import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
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
    recipient:{
        type: Schema.Types.ObjectId,
        refPath: 'recipientType',
        required: true,
    },  
    recipientType: {
        type: String,
        enum: ['Users', 'Tutors'], 
        required: true,
    },
    message:{
        type:String,    
        required:true,
    },
    Time: {
        type: String,
        default:null,
    },
    type:{
        type:String,
        require:true,   
    }
})

export default mongoose.model("chat", chatSchema, "chat")