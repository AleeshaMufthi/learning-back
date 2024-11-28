import { Server } from "socket.io";
import { saveMessageToDatabase } from "./framework/web/utils/helper.js";
import { getUserType } from "./framework/web/utils/socketHelpers.js";


export const socketConfig = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
    allowEIO3:true
  });
  const onlineUsers = {};
  
  io.on("connection", (socket) => {
    console.log("Connected to ocket server:", socket.id);

    socket.on("joinedRoom", ({ sender, selectedInstructor, instructor, selectedStudent }) => {
      let roomId;

      console.log(sender, 'sender');
      
      console.log(instructor,' instructor')
      
      if (sender && selectedInstructor) {
        // User Chat
        roomId = [sender.email, selectedInstructor.email].sort().join("-");
        console.log(roomId, 'user roomid');
        
        
      } else if (instructor && selectedStudent) {
        // Tutor Chat
        roomId = [instructor.email, selectedStudent.email].sort().join("-"); 
        console.log(roomId, 'tutor roomid');
        
      } else {
        console.error("Missing sender and recipient information for room.");
        return;
      }
      socket.join(roomId);
      socket.to(roomId).emit('roomtest', {msg:"sadf"})
    });

    socket.on("sendMessage", async ({ sender, instructor, recipient, message }) => {
      const senderData = sender || instructor;
      const recipientData = recipient;
      const roomId = [senderData.email, recipientData.email].sort().join("-");
      //   const Time = getTime(Date.now())
      //   const ioString = new Date().toISOString()
      //   const formattedDate = formatDateTimeToIST(ioString)
      const currentTime = new Date().toLocaleTimeString([], {  hour: "2-digit",  minute: "2-digit",});

      try {
        // Determine sender type and ID
        const senderInfo = await getUserType(senderData.email);
        const recipientInfo = await getUserType(recipientData.email);

        if (!senderInfo || !recipientInfo) {
          console.error("Sender or recipient not found in the database");
          return;
        }
        console.log(senderData,"++++++++++++++++++++++++++++++++++++++")

      const messageData = {
        senderId: senderInfo.userId,
        recipientId: recipientData._id,
        message: message,
        Time: currentTime,
      }
  
        await saveMessageToDatabase(          
          senderInfo.userId,
          senderInfo.userType,
          recipientInfo.userId,
          recipientInfo.userType,
          message,
          currentTime
        );
        console.log(messageData, '+++++++++++++++++++++++++++++++++++++++++');
        console.log(roomId, 'roomiddddddddddddddd');


        
        
        socket.to(roomId).emit("messageRecieved", messageData );
        
      } catch (error) {
        console.error("Failed to save message to db:", error);
      }
    });



    socket.on("typing", ({ roomId, userId }) => {
      socket.to(roomId).emit("typing", { userId });
    });

    socket.on("stopTyping", ({ roomId, userId }) => {
      socket.to(roomId).emit("stopTyping", { userId });
    });
    
  });
};