import mongoose,{Schema,model} from "mongoose";
const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        //the one who is subscripbing
        ref:"User"
    },
    chennel:{
        type:Schema.Types.ObjectId,
        //the one who sybcsriber is subscribing
        ref:"User"
    }
},{timestamps:true})

export const Subscription = model("Subscription",subscriptionSchema)