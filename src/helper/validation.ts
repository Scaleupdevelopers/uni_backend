// src/utils/validation.ts
import Joi from 'joi';

export const userSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required.'
    }),
    first_name: Joi.string().required().messages({
        'any.required': 'First name is required.'
    }),
    last_name: Joi.string().required().messages({
        'any.required': 'Last name is required.'
    }),
    phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/) // Allows optional "+" followed by 10-15 digits
    .required()
    .messages({
        'string.pattern.base': 'Phone number must start with an optional "+" and contain 10 to 15 digits.',
        'any.required': 'Phone number is required.'
    }),

    // phone_code: Joi.string()
    //     .pattern(/^\+\d{1,3}$/)
    //     .required()
    //     .messages({
    //         'string.pattern.base': 'Phone code must start with "+" followed by 1 to 3 digits.',
    //         'any.required': 'Phone code is required.'
    //     }),
    date_of_birth: Joi.string().isoDate().required().messages({
        'string.isoDate': 'Date of birth must be a valid ISO date format (YYYY-MM-DD).',
        'any.required': 'Date of birth is required.'
    }),
    pronouns: Joi.string().required().messages({
        'any.required': 'Pronouns are required.'
    }),
    device_id: Joi.string().optional().messages({
        'any.required': 'Device ID is required.'
    }),
    device_token: Joi.string().optional().messages({
        'any.required': 'Device token is required.'
    }),
    device_type: Joi.string().valid("Android", "iOS", "Web").optional().messages({
        'any.required': 'Device type is required.',
        'string.valid': 'Device type must be either "Android", "iOS", or "Web".'
    }),
    timezone: Joi.string().optional().messages({
        'any.required': 'Timezone is required.'
    })
});

export const otpVerifySchema = Joi.object({
    phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/) // Allows optional "+" followed by 10-15 digits
    .required()
    .messages({
        'string.pattern.base': 'Phone number must start with an optional "+" and contain 10 to 15 digits.',
        'any.required': 'Phone number is required.'
    }),
    // phone_code: Joi.string()
    //     .pattern(/^\+\d{1,3}$/)
    //     .required()
    //     .messages({
    //         'string.pattern.base': 'Phone code must start with "+" followed by 1 to 3 digits.',
    //         'any.required': 'Phone code is required.'
    //     }),
    otp: Joi.number()
        .integer()
        .min(100000)
        .max(999999)
        .required()
        .messages({
            'number.base': 'OTP must be a number.',
            'number.min': 'OTP must be exactly 6 digits long.',
            'number.max': 'OTP must be exactly 6 digits long.',
            'any.required': 'OTP is required.'
        })

});


export const loginSchema = Joi.object({
    // email: Joi.string().email().required().messages({
    //     'string.email': 'Email must be a valid email address.',
    //     'any.required': 'Email is required.'
    // }),
    phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/) // Allows optional "+" followed by 10-15 digits
    .required()
    .messages({
        'string.pattern.base': 'Phone number must start with an optional "+" and contain 10 to 15 digits.',
        'any.required': 'Phone number is required.'
    }),

// phone_code: Joi.string()
//     .pattern(/^\+\d{1,3}$/)
//     .required()
//     .messages({
//         'string.pattern.base': 'Phone code must start with "+" followed by 1 to 3 digits.',
//         'any.required': 'Phone code is required.'
//     }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long.',
        'any.required': 'Password is required.'
    })
});


export const forgetPasswordSchema = Joi.object({
    phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/) // Allows optional "+" followed by 10-15 digits
    .required()
    .messages({
        'string.pattern.base': 'Phone number must start with an optional "+" and contain 10 to 15 digits.',
        'any.required': 'Phone number is required.'
    }),
    // phone_code: Joi.string()
    //     .pattern(/^\+\d{1,3}$/)
    //     .required()
    //     .messages({
    //         'string.pattern.base': 'Phone code must start with "+" followed by 1 to 3 digits.',
    //         'any.required': 'Phone code is required.'
    //     })
});


export const resetPasswordSchema = Joi.object({
    new_password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long.',
            'any.required': 'Password is required.',
        }),
});


export const changePasswordSchema = Joi.object({
    current_password: Joi.string().required().messages({
        'any.required': 'Current password is required.',
    }),
    new_password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long.',
            'any.required': 'New password is required.',
        }),
});
