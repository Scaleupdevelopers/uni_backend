import express from "express";
import { createUser,verifyOtp, completeProfile , loginUser, getProfile, forgotPassword,forgotVerifyOtp,resetPassword, changePassword, updateNotificationPermission, updateAccountPrivacy, getProfileOfOtherUser, updateUserProfile} from '../controller/userController.js';
import {getCollegeList, getMajors, getArtistList, getFavShows, getSportsTeams, getFavLocation} from '../controller/staticController.js'
import {decodeJWTToken} from '../middleware/authMiddleware.js';
import {uploadLocalProfileImage, uploadS3ProfileImage} from '../middleware/multer.js';
const router = express.Router();


// ------------------------------ Onboarding Routes ----------------------//
// router.post("/signup",uploadLocalProfileImage, createUser);
router.post("/signup",uploadS3ProfileImage, createUser);

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

// ---------------------- User Update Profile --------------------------//

// ---------------------- Update Notification Setting Routes --------------------------//
router.patch("/update-notification-setting", decodeJWTToken, updateNotificationPermission);

// ---------------------- Update Account Privacy Setting Routes --------------------------//
router.patch("/update-account-setting", decodeJWTToken, updateAccountPrivacy);

// ---------------------- Get Other's User Profile Routes --------------------------//
router.get("/get-other-profile/:id", decodeJWTToken, getProfileOfOtherUser);


// ----------------------  User Update Profile Routes --------------------------//
router.put("/update-profile", uploadLocalProfileImage, decodeJWTToken, updateUserProfile);

export default router;
