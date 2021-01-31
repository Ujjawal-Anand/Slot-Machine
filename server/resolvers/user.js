const User = require('../models/user');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');
const { authCheck } = require('../helpers/auth')
require('dotenv').config();


const { validateRegisterInput, validateLoginInput } = require('../helpers/validators');


const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email
    }, process.env.SECRET_KEY, { expiresIn: '48h'});
}


module.exports = {
    Query: {
        async getCurrentUser(parent, args, { req }) {
            const { id, token } = await authCheck(req);
            const user = await User.findById({_id: id}).exec();

            return {
                email: user.email,
                token,
                id,
                attempts: user.attempts,
                points: user.points,
                coupons: user.coupons
            }

        },

        async verifyToken(parent, args, { req }) {
            return await authCheck(req);
        }
    },
    Mutation: {
        // login mutation
        async login (parent, args, { req }) {
            const { email, password } = args.input;
            const { valid, errors } = validateLoginInput(email, password);

            if (!valid) {
                throw new UserInputError('Errors' , { errors });
            }
            
            // getting a user from mongodb
            const user = await User.findOne({ email });

            if (!user) {
                errors.general = "User not found";
                throw new UserInputError('User not found', { errors });
            }
    
            // password match
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                errors.general = "Wrong credentials.";
                throw new UserInputError('Wrong credentials.', { errors });
            }

            // check if user is elligible to login or not
            // if user has 0 attempts, 0 points and no coupons, or not active forbid them from login
            if((user.attempts === 0 && user.points === 0 && user.coupons.length === 0) || !user.active) {
                throw new Error('This account is deactivated')
            }

            // sending a token back
            const token = generateToken(user);


            return {
                id: user._id,
                email,
                token,
                points: user.points,
                attempts: user.attempts,
                coupons: user.coupons
            };
            
        },
        // register mutation
        async register (parent, args, { req }) {
            // req data validation
            const {  email, password, dob } = args.input;
            const { valid, errors } = validateRegisterInput(email, password, dob);

            if (!valid) {
                throw new UserInputError('Errors' , { errors });
            }
            
            // validation for unique email address
            const existedEmail = await User.findOne({ email });
            if (existedEmail) {
                throw new UserInputError('Already registered, login to continue',  {
                    errors: {
                        email: 'Already registered, login to continue'
                    }
                })
            }

            const hashed_password = await bcrypt.hash(password, 12);
          
            const newUser = new User ({
                email,
                password: hashed_password,
                dob
            });

            const user = await newUser.save();

            const token = generateToken(user);

            
            return {
                id: user._id,
                email,
                token,
                points: user.points,
                attempts: user.attempts,
                coupons: user.coupons
            };
        },

        async updatePoints(parent, args, { req }) {
            const { email, token } = await authCheck(req);
            // update the points and decrease attempt by 1
            const user = await User.findOneAndUpdate(
                {email},
                { points: args.points, $inc: {
                    attempts: -1
                  } 
                },
                {new: true}
            ).exec();
            
            return {
                id: user._id,
                email,
                token,
                points: user.points,
                attempts: user.attempts,
                coupons: user.coupons
            };
        }
    }
}