import mongoose from "mongoose";
const complaintSchema = new mongoose.Schema({
    title : {
        type : String, 
        required : true
    },
    category : {
        type : String, 
        required : true,
        enum : ["Industrial Emission","Vehicle Pollution","Construction Dust","Waste Burning","Others"]
    },
    ward : {
        type : String, 
        required : true,
        enum : ["Central Ward","North Ward","East Ward","South Ward","West Ward","Northeast Ward","Southeast Ward","Northwest Ward","Southwest Ward"]
    },
    location : {
        type : String, 
        required : true
    },
    status : {
        type : String, 
        required : true,
        default : "pending"
    },
    description : {
        type : String, 
        required : true
    },
    photo : {
        type : String, 
        required : false
    }
}, { timestamps : true });

export default mongoose.model("Complaints", complaintSchema);

