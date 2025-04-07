import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import connectToDB from "./db/index.js";
import {app} from './app.js';

const startServer = async () => {
    try {
      await connectToDB();  // Ensure DB connection is established
  
      app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
      });
    } catch (error) {
      console.error("Error during startup", error);
      process.exit(1);  // Exit the process if there are any issues with DB or server
    }
  };
  
  startServer();














// import mongoose from 'mongoose';
// import { DB_NAME } from './constants';
// import  express from 'express';
// const app = express();
//   (async()=>{
//         try {
//             await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//             app.on('error', (error) => {
//                 console.error('Error connecting to the database', error);
//                 throw error;
//             });
//             app.listen(process.env.PORT, (port) => {
//                 console.log(`Server is running on port ${port}`);
//             });
//         } catch (error) {
//             console.error('Error connecting to the database', error);
//             throw error;
            
//         }

//     })()