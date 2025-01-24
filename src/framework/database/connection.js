import mongoose from 'mongoose'

const connectToDataBase = async() => {
    try{
      
      await mongoose.connect(process.env.MONGODB_URL).then((e)=>{
        
        console.log('Connect to DB')
      })
    }catch(error){
       console.log(error, process.env.MONGODB_URL);
    }
}


export default connectToDataBase


