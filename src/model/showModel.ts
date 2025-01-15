// This model is just used for getting the data not for inserting , updating and deleting.
import mongoose, { Document, Schema } from "mongoose";

const showSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String },
    language: { type: String },
    genres: { type: [String] }, // Array of strings
    status: { type: String },
    url: { type: String }
});

export default mongoose.model("Show", showSchema);
