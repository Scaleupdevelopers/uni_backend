import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/environment.js';
import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import { userSchema, otpVerifySchema, loginSchema, forgetPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../helper/validation.js';
// import { sendOtpToPhone } from '../helper/utility.js'; 




// without image uploading functionality 

// export const createUser = async (req: Request, res: Response) : Promise<any>=> {
//     const { error } = userSchema.validate(req.body);

//     if (error) {
//         return res.status(400).json({
//             status: false,
//             message: 'Validation error',
//             data: {
//                 error: error.details[0].message
//             }
//         });
//     }

//     try {
//         const { email, password, first_name, last_name, phone, phone_code, date_of_birth, pronouns,device_id, device_token,device_type,timezone } = req.body;

//         const checkUserSignupComplete = await User.findOne({phone,phone_code, email, is_signup_complete: true });
//         if (checkUserSignupComplete) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Error creating user",
//                 data: {
//                     error: 'User already exists with this detail'
//                 }
//             });
//         }

//         const checkUserExistOrNot = await User.findOne({ phone: phone, phone_code: phone_code, email: email, is_signup_complete: false });

//         let savedUser;
//         const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
//         const otpExpiryTime = new Date(Date.now() + 3 * 60 * 1000); // Set OTP expiry time to 3 minutes from now

//         if (checkUserExistOrNot) {
//             savedUser = checkUserExistOrNot;
//             savedUser.phone_verified_otp = otp; // Update OTP in existing user's record
//             savedUser.phone_otp_create_time = new Date(); // Set OTP creation time
//             savedUser.phone_otp_expiry_time = otpExpiryTime; // Set OTP expiry time
//             savedUser.updated_at = new Date();
//             savedUser.device_id = device_id;
//             savedUser.device_token = device_token;
//             savedUser.device_type = device_type;
//             savedUser.timezone = timezone;
//             await savedUser.save(); // Save the updated user record
//         } else {
//             // Create a new user
//             const newUser = new User({
//                 login_type: "Phone",
//                 password: password,
//                 first_name: first_name,
//                 last_name: last_name,
//                 email: email,
//                 phone: phone,
//                 phone_code: phone_code,
//                 date_of_birth: date_of_birth,
//                 pronouns: pronouns,
//                 device_id : device_id,
//                 device_token : device_token,
//                 device_type : device_type,
//                 timezone : timezone,
//             });
//             newUser.phone_verified_otp = otp; // Save OTP in the new user's record
//             newUser.phone_otp_create_time = new Date(); // Set OTP creation time
//             newUser.phone_otp_expiry_time = otpExpiryTime; // Set OTP expiry time
//             newUser.sigup_completion_percentage = '20%';
//             savedUser = await newUser.save(); // Save the new user
//         }

//         // Send OTP via Twilio
//         // await sendOtpToPhone(phone, phone_code, otp); 

//         // Return success response with data
//         res.status(200).json({
//             status: true,
//             message: "User created successfully. OTP sent to your mobile number.",
//             data: {
//                 otp: otp
//             }
//         });

//     } catch (error) {
//         console.error("Error creating user:", error);
//         res.status(500).json({
//             status: false,
//             message: "Error creating user",
//             data: {
//                 error: error || "An error occurred"
//             }
//         });
//     }
// };


export const createUser = async (req: Request, res: Response): Promise<any> => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: false,
            message: "Validation error",
            data: {
                error: error.details[0].message,
            },
        });
    }

    try {
        const { email, password, first_name, last_name, phone, phone_code, date_of_birth, pronouns, device_id, device_token, device_type, timezone } = req.body;


        const checkUserSignupComplete = await User.findOne({ phone, phone_code, email, is_signup_complete: true });
        console.log(checkUserSignupComplete, 'complete')
        if (checkUserSignupComplete) {
            return res.status(400).json({
                status: false,
                message: "User already exists with this detail",
                data: {
                    error: "User already exists with this detail",
                },
            });
        }


        // Validate age (ensure the user is 18 or older)
        const dob = new Date(date_of_birth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const isBirthdayPassed = today.getMonth() > dob.getMonth() || 
                                 (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
        console.log(isBirthdayPassed, 'passed');
        const actualAge = isBirthdayPassed ? age : age - 1;
        console.log(actualAge, 'actualAge');

        if (actualAge < 18) {
            return res.status(400).json({
                status: false,
                message: "You are not allowed to use this app.",
                data: {
                    error: "User must be at least 18 years old to register.",
                },
            });
        }

        //---------------------------- For Local Upload image---------------------------------//
        console.log(req.file, req.body, 'body');
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Profile image is required.",
                data: {
                    error: "Profile image is required."
                }
            });
        }
        const profileImageName = req.file?.filename;

        //---------------------------- For Local Upload image---------------------------------//


        //---------------------- For AWS S3 Upload Image-----------------------------//


        // const file = req.file as Express.MulterS3File;


        // if (!file || !file.location) {
        //     return res.status(400).json({
        //         status: false,
        //         message: "Profile image is required.",
        //         data: {
        //             error: "Profile image is required or upload failed.",
        //         },
        //     });
        // }

        // const profileImageName = req.file?.location ;  

        //---------------------- For AWS S3 bucket name.-----------------------------//



        

        const checkUserExistOrNot = await User.findOne({ phone, phone_code, email, is_signup_complete: false });

        let savedUser;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiryTime = new Date(Date.now() + 3 * 60 * 1000);

        if (checkUserExistOrNot) {
            savedUser = checkUserExistOrNot;
            savedUser.phone_verified_otp = otp;
            savedUser.phone_otp_create_time = new Date();
            savedUser.phone_otp_expiry_time = otpExpiryTime;
            savedUser.updated_at = new Date();
            savedUser.device_id = device_id;
            savedUser.device_token = device_token;
            savedUser.device_type = device_type;
            savedUser.timezone = timezone;

            if (profileImageName) {
                savedUser.profile_pic = profileImageName;
            }

            await savedUser.save();
        } else {

            const newUser = new User({
                login_type: "Phone",
                password,
                first_name,
                last_name,
                email,
                phone,
                phone_code,
                date_of_birth,
                pronouns,
                device_id,
                device_token,
                device_type,
                timezone,
                phone_verified_otp: otp,
                phone_otp_create_time: new Date(),
                phone_otp_expiry_time: otpExpiryTime,
                sigup_completion_percentage: "20%",
                profile_pic: profileImageName,
            });

            savedUser = await newUser.save();
        }

        // Send OTP via Twilio

        // await sendOtpToPhone(phone, phone_code, otp); 


        res.status(200).json({
            status: true,
            message: "User created successfully. OTP sent to your mobile number.",
            data: {
                otp,
            },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            status: false,
            message: "Error creating user",
            data: {
                error: error || "An error occurred",
            },
        });
    }
};





export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
   
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

        
        // user.is_phone_verified = true;
        user.phone_verified_otp = null; 
        user.phone_otp_create_time = null; 
        user.phone_otp_expiry_time = null; 
        user.otp_verify_status = true;
        user.sigup_completion_percentage = '30%';

        await user.save();

        console.log(JWT_EXPIRES_IN, 'in')
       
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


// export const completeProfile = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const userId = req.user.id; 
//         const {
//             favourite_genre,
//             favourite_interest,
//             zodiac_sign,
//             college,
//             major,
//             graduating_year,
//             clubs,
//             relationship_status,
//             favorite_artist,
//             favorite_show,
//             favorite_sports_team,
//             favorite_place_to_go,
//             facebook,
//             instagram,
//             twitter,
//             linkedin,
//             snapchat,
//             bio,
//         } = req.body;

//         // Validate data (you can add more robust validation here)
//         if (bio && bio.length > 160) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Bio should not exceed 160 characters.",
//                 data: {
//                     error: "Bio should not exceed 160 characters."
//                 }
//             });
//         }


//         // Validate favourite_interest to ensure only 3 interests in total
//         let totalInterests = 0;
//         if (favourite_interest) {

//             for (const category of favourite_interest) {
//                 totalInterests += category.interests.length;
//             }

//             if (totalInterests > 3) {
//                 return res.status(400).json({
//                     status: false,
//                     message: "You can only select a total of 3 interests across all categories.",
//                     data: {
//                         error: "You can only select a total of 3 interests across all categories."
//                     }
//                 });
//             }

//             for (const category of favourite_interest) {
//                 if (category.interests.length > 3) {
//                     return res.status(400).json({
//                         status: false,
//                         message: `You can only select up to 3 interests in the category: ${category.category}`,
//                         data: {
//                             error: `You can only select up to 3 interests in the category: ${category.category}`
//                         }
//                     });
//                 }
//             }
//         }


//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 status: false,
//                 message: "User not found.",
//                 data: {
//                     error: "User not found."
//                 }
//             });
//         }

     
//         if (favourite_genre) {
//             user.favourite_genre = favourite_genre;
//             user.sigup_completion_percentage = "40%";
//         }
//         if (favourite_interest) {
//             user.favourite_interests = favourite_interest;
//             user.sigup_completion_percentage = "50%";

//         }
//         if (zodiac_sign) {
//             user.zodiac_sign = zodiac_sign;
//             user.sigup_completion_percentage = "60%";

//         }
//         if (college) {
//             user.college = college;
//             user.sigup_completion_percentage = "63%";

//         }
//         if (major) {
//             user.major = major;
//             user.sigup_completion_percentage = "66%";

//         }
//         if (graduating_year) {
//             user.graduating_year = graduating_year;
//             user.sigup_completion_percentage = "69%";

//         }

//         if (clubs) {
//             user.clubs = clubs;
//             user.sigup_completion_percentage = "72%";

//         }
//         if (relationship_status) {
//             user.relationship_status = relationship_status;
//             user.sigup_completion_percentage = "75%";

//         }
//         if (favorite_artist) {
//             user.favorite_artist = favorite_artist;
//             user.sigup_completion_percentage = "78%";

//         }
//         if (favorite_show) {
//             user.favorite_show = favorite_show;
//             user.sigup_completion_percentage = "82%";

//         }
//         if (favorite_sports_team) {
//             user.favorite_sports_team = favorite_sports_team;
//             user.sigup_completion_percentage = "86%";

//         }
//         if (favorite_place_to_go) {
//             user.favorite_place_to_go = favorite_place_to_go;
//             user.sigup_completion_percentage = "90%";

//         }
//         if (facebook) {
//             user.facebook = facebook;
//             user.sigup_completion_percentage = "92%";

//         }
//         if (instagram) {
//             user.instagram = instagram;
//             user.sigup_completion_percentage = "94%";

//         } if (twitter) {
//             user.twitter = twitter;
//             user.sigup_completion_percentage = "96%";

//         }
//         if (linkedin) {
//             user.facebook = linkedin;
//             user.sigup_completion_percentage = "98%";

//         }
//         if (bio) {
//             user.bio = bio;
//             user.sigup_completion_percentage = "100%";

//         }
//         user.snapchat = snapchat;
//         user.is_signup_complete = true;
//         user.terms_privacy_condition = true;
//         user.updated_at = new Date();

//         await user.save();

//         const userDetail = {
//             _id: user._id,
//             email: user.email,
//             phone: user.phone,
//             first_name: user.first_name
//         }
        
//         return res.status(200).json({
//             status: true,
//             message: "Profile updated successfully.",
//             data: userDetail,
//         });
//     } catch (error) {
//         console.error("Error updating profile:", error);
//         return res.status(500).json({
//             status: false,
//             message: "Error updating profile.",
//             data: {
//                 error: error || "Internal server error",
//             },
//         });
//     }
// };


export const completeProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user.id; 
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

        
        if (bio && bio.length > 160) {
            return res.status(400).json({
                status: false,
                message: "Bio should not exceed 160 characters.",
                data: {
                    error: "Bio should not exceed 160 characters."
                }
            });
        }

        // Validate favourite_interest to ensure only 3 interests in total
        let totalInterests = 0;
        if (favourite_interest) {
            for (const category of favourite_interest) {
                totalInterests += category.interests.length;
            }

            if (totalInterests > 3) {
                return res.status(400).json({
                    status: false,
                    message: "You can only select a total of 3 interests across all categories.",
                    data: {
                        error: "You can only select a total of 3 interests across all categories."
                    }
                });
            }

            for (const category of favourite_interest) {
                if (category.interests.length > 3) {
                    return res.status(400).json({
                        status: false,
                        message: `You can only select up to 3 interests in the category: ${category.category}`,
                        data: {
                            error: `You can only select up to 3 interests in the category: ${category.category}`
                        }
                    });
                }
            }
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found.",
                data: {
                    error: "User not found."
                }
            });
        }

        let completionPercentage = 30;

      
        if (favourite_genre) {
            user.favourite_genre = favourite_genre;
            completionPercentage += 10;
        }
        if (favourite_interest) {
            user.favourite_interests = favourite_interest;
            completionPercentage += 10;
        }
        if (zodiac_sign) {
            user.zodiac_sign = zodiac_sign;
            completionPercentage += 10;
        }
        if (college) {
            user.college = college;
            completionPercentage += 3;
        }
        if (major) {
            user.major = major;
            completionPercentage += 3;
        }
        if (graduating_year) {
            user.graduating_year = graduating_year;
            completionPercentage += 3;
        }
        if (clubs) {
            user.clubs = clubs;
            completionPercentage += 3;
        }
        if (relationship_status) {
            user.relationship_status = relationship_status;
            completionPercentage += 3;
        }
        if (favorite_artist) {
            user.favorite_artist = favorite_artist;
            completionPercentage += 4;
        }
        if (favorite_show) {
            user.favorite_show = favorite_show;
            completionPercentage += 4;
        }
        if (favorite_sports_team) {
            user.favorite_sports_team = favorite_sports_team;
            completionPercentage += 4;
        }
        if (favorite_place_to_go) {
            user.favorite_place_to_go = favorite_place_to_go;
            completionPercentage += 3;
        }
        if (facebook) {
            user.facebook = facebook;
            completionPercentage += 1;
        }
        if (instagram) {
            user.instagram = instagram;
            completionPercentage += 1;
        }
        if (twitter) {
            user.twitter = twitter;
            completionPercentage += 1;
        }
        if (linkedin) {
            user.linkedin = linkedin;
            completionPercentage += 1;
        }
        if (bio) {
            user.bio = bio;
            completionPercentage += 5;
        }
        if (snapchat) {
            user.snapchat = snapchat;
            completionPercentage += 1;
        }

    
        user.sigup_completion_percentage = `${completionPercentage}%`;
        user.is_signup_complete = true;
        user.updated_at = new Date();
        await user.save();

        const userDetail = {
            _id: user._id,
            email: user.email,
            phone: user.phone,
            first_name: user.first_name,
            sigup_completion_percentage: user.sigup_completion_percentage
        }
        
 
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


export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { error } = loginSchema.validate(req.body);
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
        const { phone_code, phone, password } = req.body;

        console.log(phone_code, phone, password, 'password');

        const userFind = await User.findOne({ phone_code, phone, is_signup_complete: false });
        if (userFind) {
            return res.status(404).json({
                status: false,
                message: "Sorry! First Complete Your Profile.And Then Try To Login", // No user found
                data: {
                    error: "Sorry! First Complete Your Profile.And Then Try To Login"
                }
            });
        }

       
        const user = await User.findOne({ phone_code, phone, is_signup_complete: true });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "Invalid Credentials.",
                data: {
                    error: "Invalid Credentials."
                }
            });
        }

      
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password as string);
        console.log(isPasswordValid, 'valid')
        if (!isPasswordValid) {
            return res.status(400).json({
                status: false,
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
            sigup_completion_percentage: user.sigup_completion_percentage,
            token: token

        };
        // Send a success response with the token
        return res.status(200).json({
            status: true,
            message: "Login successfully.",
            data: userDetail, // Return user information without password

        });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({
            status: false, message: "Error logging in", data: {
                error: error
            }
        });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<any> => {
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

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
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



export const resetPassword = async (req: Request, res: Response): Promise<any> => {
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


export const changePassword = async (req: Request, res: Response): Promise<any> => {
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

