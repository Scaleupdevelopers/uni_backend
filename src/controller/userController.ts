import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET,JWT_EXPIRES_IN} from '../config/environment.js';
import User from "../model/userModel.js";
import College from "../model/collegeModel.js";
import Artist from '../model/artistModel.js';  // Adjust the path as necessary
import bcrypt from 'bcrypt';
import {userSchema, otpVerifySchema, loginSchema, forgetPasswordSchema, resetPasswordSchema, changePasswordSchema} from '../helper/validation.js';
// import { sendOtpToPhone } from '../helper/utility.js'; // Adjust path to the utility function
// Controller to handle creating a new user




export const createUser = async (req: Request, res: Response) : Promise<any>=> {
    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: false,
            message: 'Validation error',
            data: {
                error: error.details[0].message
            }
        });
    }

    try {
        const { email, password, first_name, last_name, phone, phone_code, date_of_birth, pronouns,device_id, device_token,device_type,timezone } = req.body;

        const checkUserSignupComplete = await User.findOne({ email, is_signup_complete: true });
        if (checkUserSignupComplete) {
            return res.status(400).json({
                status: false,
                message: "Error creating user",
                data: {
                    error: 'User already exists with this detail'
                }
            });
        }

        const checkUserExistOrNot = await User.findOne({ phone: phone, phone_code: phone_code, is_signup_complete: false });

        let savedUser;
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const otpExpiryTime = new Date(Date.now() + 3 * 60 * 1000); // Set OTP expiry time to 3 minutes from now

        if (checkUserExistOrNot) {
            savedUser = checkUserExistOrNot;
            savedUser.phone_verified_otp = otp; // Update OTP in existing user's record
            savedUser.phone_otp_create_time = new Date(); // Set OTP creation time
            savedUser.phone_otp_expiry_time = otpExpiryTime; // Set OTP expiry time
            savedUser.updated_at = new Date();
            savedUser.device_id = device_id;
            savedUser.device_token = device_token;
            savedUser.device_type = device_type;
            savedUser.timezone = timezone;
            await savedUser.save(); // Save the updated user record
        } else {
            // Create a new user
            const newUser = new User({
                login_type: "Phone",
                password: password,
                first_name: first_name,
                last_name: last_name,
                email: email,
                phone: phone,
                phone_code: phone_code,
                date_of_birth: date_of_birth,
                pronouns: pronouns,
                device_id : device_id,
                device_token : device_token,
                device_type : device_type,
                timezone : timezone,
            });
            newUser.phone_verified_otp = otp; // Save OTP in the new user's record
            newUser.phone_otp_create_time = new Date(); // Set OTP creation time
            newUser.phone_otp_expiry_time = otpExpiryTime; // Set OTP expiry time
            savedUser = await newUser.save(); // Save the new user
        }

        // Send OTP via Twilio
        // await sendOtpToPhone(phone, phone_code, otp); 

        // Return success response with data
        res.status(200).json({
            status: true,
            message: "User created successfully. OTP sent to your mobile number.",
            data: {
                otp: otp
            }
        });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            status: false,
            message: "Error creating user",
            data: {
                error: error || "An error occurred"
            }
        });
    }
};



export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
    // Validate input
    const { error } = otpVerifySchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            status: false,  
            message: "Validation error",
            data: {
                error: error.details[0].message
            }
        });
    }

    const { phone, phone_code, otp } = req.body;

    try {
        // Find user with matching phone and phone_code
        const user = await User.findOne({ phone, phone_code });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found.",
                data: {
                    error: "No user found with the provided phone and phone code."
                }
            });
        }

        // Check if OTP matches
        if (user.phone_verified_otp !== otp) {
            return res.status(400).json({
                status: false,
                message: "Invalid OTP.",
                data: {
                    error: "OTP does not match."
                }
            });
        }

        // Check if OTP is expired
        const currentTime = new Date();
        if (user.phone_otp_expiry_time && user.phone_otp_expiry_time < currentTime) {
            return res.status(400).json({
                status: false,
                message: "OTP has expired. Please request a new OTP.",
                data: {
                    error: "OTP expired. Please request a new OTP."
                }
            });
        }

        // OTP is valid, mark user as verified
        // user.is_phone_verified = true;
        user.phone_verified_otp = null; // Clear the OTP
        user.phone_otp_create_time = null; // Clear the OTP creation time
        user.phone_otp_expiry_time = null; // Clear the OTP expiry time
        user.otp_verify_status = true;
        await user.save();

        console.log(JWT_EXPIRES_IN, 'in')
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, phone: user.phone },
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRES_IN } 
        );

        return res.status(200).json({
            status: true,
            message: "OTP verified successfully.",
            data: {
                token: token
            }
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            status: false,
            message: "Error verifying OTP.",
            data: {
                error: error || "An error occurred while verifying OTP."
            }
        });
    }
};


export const completeProfile = async (req: Request, res: Response) : Promise<any> => {
  try {
    const userId = req.user.id; // Assuming `user` object from decoded JWT contains user ID
    const {
      favourite_genre,
      favourite_interest,
      zodiac_sign,
      college,
      major,
      graduating_year,
      clubs,
      relationship_status,
      favorite_artist,
      favorite_show,
      favorite_sports_team,
      favorite_place_to_go,
      facebook,
      instagram,
      twitter,
      linkedin,
      snapchat,
      bio,
    } = req.body;

    // Validate data (you can add more robust validation here)
    if (bio && bio.length > 160) {
      return res.status(400).json({
        status: false,
        message: "Bio should not exceed 160 characters.",
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    // Update user profile fields
    user.favourite_genre = favourite_genre;
    user.favourite_interests = favourite_interest;
    user.zodiac_sign = zodiac_sign;
    user.college = college;
    user.major = major;
    user.graduating_year = graduating_year;
    user.clubs = clubs;
    user.relationship_status = relationship_status;
    user.favorite_artist = favorite_artist;
    user.favorite_show = favorite_show;
    user.favorite_sports_team = favorite_sports_team ;
    user.favorite_place_to_go = favorite_place_to_go;
    user.facebook = facebook;
    user.instagram = instagram;
    user.twitter = twitter ;
    user.linkedin = linkedin;
    user.snapchat = snapchat;
    user.bio = bio;
    user.is_signup_complete = true;
    user.terms_privacy_condition = true;
    user.updated_at = new Date();

    // Save the updated user profile
    await user.save();

    const userDetail = {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        first_name: user.first_name
    }
    // Return the updated profile
    return res.status(200).json({
      status: true,
      message: "Profile updated successfully.",
      data: userDetail,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      status: false,
      message: "Error updating profile.",
      data: {
        error: error || "Internal server error",
      },
    });
  }
};


//Funtion handle user login
export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { error } = loginSchema.validate(req.body);  
    if (error) {
        return res.status(400).json({
            status:false,
            message: 'Validation error',
            data: {
                error: error.details[0].message
            }
        });
    }
    try {
        const { email, password } = req.body;

        console.log(email, password, 'password')
        // Find the user by email
        const user = await User.findOne({ email , is_signup_complete: true});
        if (!user) {
            return res.status(404).json({
                status : false ,
                message: "Invalid email address", // No user found
                data: {
                    error: 'Invalid email address'
                }
            });
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password as string);
        console.log(isPasswordValid, 'valid')
        if (!isPasswordValid) {
            return res.status(400).json({
                status : false,
                message: "Password is not correct", // Invalid password
                data: {
                    error: "Password is not correct"
                }
            });
        }

        console.log(JWT_EXPIRES_IN, 'in');

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, phone: user.phone },
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRES_IN } 
        );

       

        const userDetail = {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            date_of_birth: user.date_of_birth,
            phone: user.phone,
            token: token
           
        };
        // Send a success response with the token
        return res.status(200).json({
            status:true,
            message: "Login successfully.",
            data: userDetail, // Return user information without password

        });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ status :false , message: "Error logging in", data: {
            error : error}});
    }
};


// Function to get user profile based on userId from req.user
export const getProfile = async (req: Request, res: Response) : Promise<any>=> {
    const userId = req.user.id;  // Assuming that req.user is populated by JWT decoding middleware

    try {
        // Find the user by the userId from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
                data: {
                    error: 'User not found'
                }
            });
        }

        // Return the user profile in the response (excluding sensitive fields like password)
        const { password, ...userProfile } = user.toObject();

        res.status(200).json({
            status: true,
            message: 'User profile fetched successfully',
            data: userProfile,
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: {
                error: error
            }
        });
    }
};


export const forgotPassword = async (req: Request, res: Response) : Promise<any> => {
    // Validate the request body using Joi
    const { error } = forgetPasswordSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: false,
            message: 'Validation error',
            data: {
                error: error.details[0].message
            }
        });
    }

    const { phone, phone_code } = req.body;

    try {
        // Find the user by phone number and check if signup is complete
        const user = await User.findOne({ phone, phone_code, is_signup_complete: true });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found or signup incomplete.',
                data: {
                    error: 'User not found or signup incomplete.'
                }
            });
        }

        // Generate OTP (6-digit number)
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiryTime = new Date(Date.now() + 3 * 60 * 1000); // OTP expiry time (5 minutes from now)

        // Save OTP and expiry time in the user's record
        user.phone_verified_otp = otp;
        user.phone_otp_create_time = new Date();
        user.phone_otp_expiry_time = otpExpiryTime;
        await user.save();

        // Send OTP to the user's phone (using Twilio or any other service)
        // await sendOtpToPhone(phone, phone_code, otp);

        // Return response indicating success
        res.status(200).json({
            status: true,
            message: 'OTP sent successfully to your mobile number.',
            data: {
                otp: otp,  
            }
        });

    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: {
                error: error
            }
        });
    }
};


export const forgotVerifyOtp = async (req: Request, res: Response): Promise<any> => {

    // Validate input
    const { error } = otpVerifySchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            status: false,  
            message: "Validation error",
            data: {
                error: error.details[0].message
            }
        });
    }

    const { phone, phone_code, otp } = req.body;

    try {
        // Find user with matching phone and phone_code
        const user = await User.findOne({ phone, phone_code });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found.",
                data: {
                    error: "No user found with the provided phone and phone code."
                }
            });
        }

        // Check if OTP matches
        if (user.phone_verified_otp !== otp) {
            return res.status(400).json({
                status: false,
                message: "Invalid OTP.",
                data: {
                    error: "OTP does not match."
                }
            });
        }

        // Check if OTP is expired
        const currentTime = new Date();
        if (user.phone_otp_expiry_time && user.phone_otp_expiry_time < currentTime) {
            return res.status(400).json({
                status: false,
                message: "OTP has expired. Please request a new OTP.",
                data: {
                    error: "OTP expired. Please request a new OTP."
                }
            });
        }

        // OTP is valid, mark user as verified
        // user.is_phone_verified = true;
        user.phone_verified_otp = null; // Clear the OTP
        user.phone_otp_create_time = null; // Clear the OTP creation time
        user.phone_otp_expiry_time = null; // Clear the OTP expiry time
        user.updated_at = new Date();
        await user.save();

        console.log(JWT_EXPIRES_IN, 'in')
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, phone: user.phone },
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRES_IN } 
        );

        return res.status(200).json({
            status: true,
            message: "OTP verified successfully.",
            data: {
                token: token
            }
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            status: false,
            message: "Error verifying OTP.",
            data: {
                error: error || "An error occurred while verifying OTP."
            }
        });
    }
};


// Reset password handler
export const resetPassword = async (req: Request, res: Response) : Promise<any> => {
    // Validate the request body using Joi
    const { error } = resetPasswordSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: false,
            message: 'Validation error',
            data: {
                error: error.details[0].message
            }
        });
    }

    const { new_password } = req.body;

    try {
        // Find the user using the id from the JWT (req.user.id)
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
                data: {
                    error: 'User not found'
                }
            });
        }

        // // Hash the new password
        // const hashedPassword = await bcrypt.hash(new_password, 10);

        // Update the user's password in the database
        user.password = new_password;
        user.password_changed_at = new Date();
        user.updated_at = new Date();
        await user.save();


        const userDetail = {
            first_name: user.first_name,
            phone: user.phone
        }
        // Return a success response
        res.status(200).json({
            status: true,
            message: 'Password updated successfully.Please login with new Password',
            data: 
                userDetail
            
        });
        
    } catch (error) {
        console.error('Error during reset password:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: {
                error: error
            }
        });
    }
};

// Change password handler
export const changePassword = async (req: Request, res: Response) : Promise<any> => {
    // Validate the request body using Joi
    const { error } = changePasswordSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: false,
            message: 'Validation error',
            data: {
                error: error.details[0].message
            }
        });
    }

    const { current_password, new_password } = req.body;

    try {
        // Find the user using the id from the JWT (req.user.id)
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found.',
                data: {
                    error: 'User not found.'
                }
            });
        }

        // Check if the current password matches the one stored in the database
        const isPasswordValid = await bcrypt.compare(current_password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                status: false,
                message: 'Current password is incorrect',
                data: {
                    error: 'Current password is incorrect'
                }
            });
        }

        // // Hash the new password
        // const hashedPassword = await bcrypt.hash(new_password, 10);

        // Update the user's password in the database
        user.password = new_password;
        user.password_changed_at = new Date();
        user.updated_at = new Date();
        await user.save();

        const userDetail = {
            first_name: user.first_name,
            phone: user.phone
        }
        // Return a success response
        res.status(200).json({
            status: true,
            message: 'Password updated successfully.',
            data: userDetail
        });
        
    } catch (error) {
        console.error('Error during change password:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: {
                error: error
            }
        });
    }
};

// ---------- Get College List -----------------------------//


// without search 

// export const getCollegeList = async (req: Request, res: Response): Promise<any> => {
//     try {
//         // Fetch all colleges from the database
//         const colleges = await College.find();

//         // Return the college list
//         res.status(200).json({
//             status: true,
//             message: 'College list fetched successfully',
//             data: colleges,
//         });
//     } catch (error) {
//         console.error('Error fetching college list:', error);

//         // Return an error response
//         res.status(500).json({
//             status: false,
//             message: 'Internal server error',
//             data: error,
//         });
//     }
// };

export const getCollegeList = async (req: Request, res: Response): Promise<any> => {
    try {
        // Get pagination and search parameters from the request query
        const { page = 1, limit = 10, search = '' } = req.query;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

       // Create the search query object
       const searchQuery: any = {};
       if (search) {
           const searchRegex = new RegExp(search as string, 'i'); // Case-insensitive search
           searchQuery.$or = [
               { name: searchRegex },
           ];
       }

        // Fetch colleges from the database with pagination and search
        const colleges = await College.find(searchQuery)
            .skip(skip)
            .limit(limitNum)
            .sort({ name: 1 });  // Sorting by name, adjust as needed

        // Get the total count for pagination
        const totalCount = await College.countDocuments(searchQuery);

        // Return the college list along with pagination information
        res.status(200).json({
            status: true,
            message: 'College list fetched successfully',
            data: {
                colleges,
                totalCount,
                totalPages: Math.ceil(totalCount / limitNum),
                currentPage: pageNum,
            },
        });
    } catch (error) {
        console.error('Error fetching college list:', error);

        // Return an error response
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: error,
        });
    }
};



// ------------- Get Major List -----------------------------//

export const getMajors = async (req: Request, res: Response): Promise<any> => {
    try {
        // Hardcoded list of popular majors in the USA
        const majors = [
            "Computer Science",
            "Business Administration",
            "Mechanical Engineering",
            "Psychology",
            "Nursing",
            "Biology",
            "Education",
            "Political Science",
            "Economics",
            "Accounting",
            "Marketing",
            "Electrical Engineering",
            "Civil Engineering",
            "Mathematics",
            "Physics",
            "Sociology",
            "History",
            "Philosophy",
            "Environmental Science",
            "Communication Studies",
            "Law",
            "Journalism",
            "Anthropology",
            "Architecture",
            "Criminal Justice",
            "Health Sciences"
        ];

        // Return the list of majors
        res.status(200).json({
            status: true,
            message: "Majors fetched successfully",
            data: majors,
        });
    } catch (error) {
        console.error('Error fetching majors:', error);

        // Return an error response
        res.status(500).json({
            status: false,
            message: "Internal server error",
            data: error,
        });
    }
};

// ----------------- Get Artist List ------------------------------//


export const getArtistList = async (req: Request, res: Response): Promise<any> => {
    try {
        // Get page and search query from request
        const { page = 1, limit = 10, search = ''  } = req.query;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        // Create the search query object
        const searchQuery: any = {};
        if (search) {
            const searchRegex = new RegExp(search as string, 'i'); // Case-insensitive search
            searchQuery.$or = [
                { name: searchRegex },
                // { country: searchRegex },
                // { gender: searchRegex },
            ];
        }

        // Fetch artists with pagination and search
        const artists = await Artist.find(searchQuery)
            .skip(skip)
            .limit(limitNum)
            // .sort({ created_at: -1 });  // Optional: Sort by created_at descending

        // Get total count for pagination
        const totalCount = await Artist.countDocuments(searchQuery);

        res.status(200).json({
            status: true,
            message: "Artists fetched successfully",
            data: {
                artists,
                totalCount,
                totalPages: Math.ceil(totalCount / limitNum),
                currentPage: pageNum,
            },
        });
    } catch (error) {
        console.error('Error fetching artist list:', error);

        res.status(500).json({
            status: false,
            message: "Internal server error",
            data: error,
        });
    }
};