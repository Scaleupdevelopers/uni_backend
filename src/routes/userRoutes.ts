import express from "express";
import { createUser,verifyOtp, completeProfile , loginUser, getProfile, forgotPassword,forgotVerifyOtp,resetPassword, changePassword, getCollegeList, getMajors, getArtistList} from '../controller/userController.js'; // Adjust path to your controller file
import {decodeJWTToken} from '../middleware/authMiddleware.js'
const router = express.Router();


// ------------------------------ Onboarding Routes ----------------------//
router.post("/signup", createUser);

router.post("/verify-otp", verifyOtp);

router.post("/complete-profile",decodeJWTToken, completeProfile);

router.post("/login", loginUser);

router.get('/get-profile', decodeJWTToken, getProfile);

// ------------------------------ Onboarding Routes ----------------------//


// ------------------------------ Forgot Password Routes --------------------------//
router.post("/forgot-password", forgotPassword);
router.post("/forgot-verify-otp", forgotVerifyOtp);
router.post("/reset-password", decodeJWTToken, resetPassword);

// ------------------------------ Forgot Password Routes --------------------------//


// ------------------------------ Change Password Routes --------------------------//

router.post("/change-password", decodeJWTToken, changePassword);

// ------------------------------ Change Password Routes --------------------------//

// ------------------------------ Get College Routes --------------------------//

router.get('/get-collegelist', decodeJWTToken, getCollegeList);

// ------------------------------ Get College Routes --------------------------//

// ------------------------------ Get Major Routes --------------------------//

router.get('/get-major', decodeJWTToken, getMajors);

// ------------------------------ Get Major Routes --------------------------//

// ------------------------------ Get Artist Routes --------------------------//

router.get('/get-artist-list', decodeJWTToken, getArtistList);

// ------------------------------ Get Artist Routes --------------------------//







export default router;
