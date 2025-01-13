// This model is just used for getting the data not for inserting , updating and deleting.
import mongoose, { Document, Schema } from "mongoose";

const artistSchema = new Schema({
    name: {
        type: String,
    },
    country: {
        type: String,
    },
    gender: {
        type: String,
    },
    sortName: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Artist", artistSchema);
