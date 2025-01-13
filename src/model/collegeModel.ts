// This model is just used for getting the data not for inserting , updating and deleting.
import mongoose, { Document, Schema } from "mongoose";

const collegeSchema = new Schema({
    name: {
        type: String,
    },
    city: {
        type: String,
    },
    url: {
        type: String,
    },
    zip: {
        type: String,
    },
    accredAgency: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("College", collegeSchema);
