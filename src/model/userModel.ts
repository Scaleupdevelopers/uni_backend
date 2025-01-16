// src/models/userModel.ts

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';


// Define the Mongoose schema
const userSchema = new Schema({

  // ------------------ Basic Info --------------------------//
  first_name: { type: String, required: true, default: null },
  last_name: { type: String, required: true, default: null },
  pronouns: { type: String, required: true, default: null },
  date_of_birth: { type: String, required: true, default: null },
  phone_code: { type: String, required: true, default: null },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, default: null },
  profile_pic: { type: String, required: false, default: null },



  phone_verified_otp: { type: Number, required: false, default: null },
  phone_otp_create_time: { type: Date, required: false, default: null },
  phone_otp_expiry_time: { type: Date, required: false, default: null },
  otp_verify_status: { type: Boolean, default: false },


  password_changed_at: { type: Date, required: false, default: null },

  // ----------------------- Favourite Genere & Interest -------------------------//
  favourite_genre: { type: String, required: false, default: null },

  // favourite_interests: { type: Array, required: false  ,default:null},


  favourite_interests: {
    type: [
      {
        category: { type: String, required: true },
        interests: {
          type: [String],
          required: true,
        }
      }
    ],
    default: null,
    required: false
  },

  zodiac_sign: { type: String, required: false, default: null },

  // ------------------------ College Details --------------------------------//
  college: { type: String, required: false, default: null },
  major: { type: Array, required: false, default: null },
  graduating_year: { type: String, required: false, default: null },
  clubs: { type: Array, required: false, default: null },
  relationship_status: { type: String, required: false, default: null },

  // ------------------------ Favourite Artist ----------------------------------//
  favorite_artist: { type: String, required: false, default: null },
  favorite_show: { type: String, required: false, default: null },
  favorite_sports_team: { type: String, required: false, default: null },
  favorite_place_to_go: { type: String, required: false, default: null },

  // ------------------------- Social Media Links ------------------------------------//
  facebook: { type: String, required: false, default: null },
  linkedin: { type: String, required: false, default: null },
  instagram: { type: String, required: false, default: null },
  twitter: { type: String, required: false, default: null },
  snapchat: { type: String, required: false, default: null },
  bio: { type: String, required: false, default: null },


  // ----------------------------- Permission Info --------------------------------------//
  // status: { type: String, enum: ['active', 'inactive', 'banned'], required: false ,default:null },
  notifications_permission: { type: Boolean, default: true },
  terms_privacy_condition: { type: Boolean, default: true },
  is_account_public: { type: Boolean, default: true },

  last_login_at: { type: String, required: false, default: null },
  last_login_ip: { type: String, required: false, default: null },
  is_signup_complete: { type: Boolean, required: false, default: false },  // Signup complete flag
  sigup_completion_percentage: { type: String, required: false, default: null },

  // ----------------------- Device Info -----------------------------//
  device_id: { type: String, required: false, default: null },
  device_token: { type: String, required: false, default: null },
  device_type: { type: String, required: false, default: null },
  login_type: { type: String, required: false, default: null },
  // current_ip: { type: String, required: false ,default:null },
  timezone: { type: String, required: false, default: null },



  postal_code: { type: String, default: null },

  // ---------------------------- Modifications Info ----------------------//
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null }

});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) { // Ensure the password is defined
    const saltRounds = 10; // Define the number of salt rounds
    const salt = await bcrypt.genSalt(saltRounds); // Generate a salt
    this.password = await bcrypt.hash(this.password as string, salt); // Cast to string to avoid TypeScript error
  }
  next(); // Proceed to save the user
});


// Export the User model
export default mongoose.model("User", userSchema);