import dotenv from 'dotenv';
dotenv.config();
import connectToDB from "./db/index.js";
import {app} from './app.js';

connectToDB()
.then(() => {
    app.on('error', (error) => {    
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
    );
    app.listen(process.env.PORT||8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
  console.error("Error connecting to the database", error);
  process.exit(1);
});















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