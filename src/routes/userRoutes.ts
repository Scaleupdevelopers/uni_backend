import express from "express";
import { createUser,verifyOtp, completeProfile , loginUser, getProfile, forgotPassword,forgotVerifyOtp,resetPassword, changePassword} from '../controller/userController.js';
import {getCollegeList, getMajors, getArtistList, getFavShows, getSportsTeams, getFavLocation} from '../controller/staticController.js'
import {decodeJWTToken} from '../middleware/authMiddleware.js';
import {uploadLocalProfileImage, uploadS3ProfileImage} from '../middleware/multer.js';
const router = express.Router();


// ------------------------------ Onboarding Routes ----------------------//
router.post("/signup",uploadLocalProfileImage, createUser);
router.post("/verify-otp", verifyOtp);
router.post("/complete-profile",decodeJWTToken, completeProfile);
router.post("/login", loginUser);
router.get('/get-profile', decodeJWTToken, getProfile);

// ------------------------------ Onboarding Routes ----------------------//


// ------------------------------ Forgot Password Routes --------------------------//
router.post("/forgot-password", forgotPassword);
router.post("/forgot-verify-otp", forgotVerifyOtp);
router.post("/reset-password", decodeJWTToken, resetPassword);
// ------------------------------ Change Password Routes --------------------------//
router.post("/change-password", decodeJWTToken, changePassword);



// ------------------------------ Get College Routes --------------------------//
router.get('/get-collegelist', decodeJWTToken, getCollegeList);
// ------------------------------ Get Major Routes --------------------------//
router.get('/get-major', decodeJWTToken, getMajors);
// ------------------------------ Get Artist Routes --------------------------//
router.get('/get-artist-list', decodeJWTToken, getArtistList);
// ---------------------- Get Favourite Show Routes --------------------------//
router.get('/get-fav-show', decodeJWTToken, getFavShows); 
// ---------------------- Get Favourite Sports Team Routes --------------------------//
router.get('/get-fav-sport', decodeJWTToken, getSportsTeams);  
// ---------------------- Get Favourite Places Routes --------------------------//
router.get('/get-fav-places', decodeJWTToken, getFavLocation);  



export default router;
