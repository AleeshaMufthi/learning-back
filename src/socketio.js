import { Server } from "socket.io";
import { saveMessageToDatabase } from "./framework/web/utils/helper.js";
import { saveNotificationToDatabase } from "./framework/web/utils/helper.js";
import { getUserType } from "./framework/web/utils/socketHelpers.js";

export const socketConfig = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://brain-booster.site",
      methods: ["GET", "POST"],
    },
  });
  // const io = new Server(server, {
  //   cors: {
  //     origin: "http://localhost:5173",
  //     methods: ["GET", "POST"],
  //   },
  // });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket server:", socket.id);

    socket.on('initiateCall', ({ userId, signalData, myId }) => {
      io.to(userId).emit('incomingCall', { signalData, from: myId });
    });
  
    socket.on('answerCall', (data) => {
      console.log('Answer call received:', data);
      io.to(data.to).emit('callAccepted', data.signal);
    });
  
    socket.on('endCall', ({ to }) => {
      io.to(to).emit('callEnded');
    });
  
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
  

    socket.on("joinedRoom", ({ sender, selectedInstructor, instructor, selectedStudent }) => {

      let roomId;

      console.log(sender, 'sender from the socket');
      
      console.log(instructor,' instructor from the socket') 
      
      if (sender && selectedInstructor) {
        // User Chat
        roomId = [sender.email, selectedInstructor.email].sort().join("-");
        console.log(roomId, 'user roomid');
        socket.join(roomId);
        io.to(roomId).emit("userStatus", { email: sender.email, status: "online" });
        console.log(`${sender.email} is online`);
        
      } else if (instructor && selectedStudent) {
        // Tutor Chat
        roomId = [instructor.email, selectedStudent.email].sort().join("-"); 
        console.log(roomId, 'tutor roomid');
        socket.join(roomId);
        io.to(roomId).emit("userStatus", { email: instructor.email, status: "online" });
        console.log(`${instructor.email} is online`);
      } else {
        console.error("Missing sender and recipient information for room.");
        return;
      }
      socket.roomId = roomId;
      // socket.to(roomId).emit('roomtest', {msg:"sadf"})
    });

    socket.on("sendMessage", async ({ sender, recipient, message, type }) => {
      const senderData = sender;
      const recipientData = recipient;
      const roomId = [senderData.email, recipientData.email].sort().join("-");
      const currentTime = new Date().toLocaleTimeString([], {  hour: "2-digit",  minute: "2-digit",});

      try {
        // Determine sender type and ID
        const senderInfo = await getUserType(senderData.email);
        const recipientInfo = await getUserType(recipientData.email);
 
        if (!senderInfo || !recipientInfo) {
          console.error("Sender or recipient not found in the database");
          return;
        }

        const messageData = await saveMessageToDatabase(          
          senderInfo.userId,
          senderInfo.userType,
          recipientInfo.userId,
          recipientInfo.userType,
          message,
          type,
          currentTime
        );
        
        socket.to(roomId).emit("messageRecieved", {messageData} );
        
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

    socket.on("disconnect", () => {
      if (socket.roomId) {
        io.to(socket.roomId).emit("userStatus", { email: socket.id, status: "offline" });
      }
    });
   

    socket.on("joinRoom", ({ userId }) => {
      if (userId) {
        socket.join(userId);
      }
    });

    socket.on("to-users", async (data) => {
      const { heading, message, isRead, url, from, fromModel, to, toModel } = data;
      const savedNotification = await saveNotificationToDatabase(
        heading,
        message,
        isRead,
        url,
        from, 
        fromModel,
        to,
        toModel
      );
      console.log("Notification saved to the database:", savedNotification);
      io.emit("newNotification", { Notification: savedNotification });
    });
    
  });
};
