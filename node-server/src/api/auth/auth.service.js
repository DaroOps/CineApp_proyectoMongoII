import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../../services/token.service.js';

import { AuthorizationError } from '../../utils/errors.js';

export default class AuthService {

    async login({ email, password }) {
        const User = mongoose.model('User');
        const user = await User.findOne({ email });
        const passwordCorrect = user === null 
          ? false 
          : await bcrypt.compare(password, user.password);
      
        if (!(user && passwordCorrect)) {
          throw new AuthorizationError('Invalid email or password');
        }
      
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
      
        user.password = undefined;
        delete user.password; // remove password from response  
      
        return {
            accessToken,
            refreshToken
        };
    }

    refreshAccessToken(refreshToken) {
        try {
          const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
          const accessToken = generateAccessToken({ id: payload.id });
          return { accessToken };
        } catch (error) {
          throw new AuthorizationError('Invalid refresh token');
        }
    }

    async verify(accessToken) {
        try {
          const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
          return payload;
        } catch (error) {
          throw new AuthorizationError(`Invalid access token ${accessToken}`);
        }
    }

    async logout(accessToken) {
        try {
          const User = mongoose.model('User');
          const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
          const user = await User.findById(payload.id);
          user.password = undefined;
          delete user.password;
          return user;
        } catch (error) {
          throw new AuthorizationError('Invalid access token');
        }
    }

    async createUser({ userData }) {
      const User = mongoose.model('User');
      const hashedPassword = await bcrypt.hash(userData.password, 3);
      const user = new User({
        ...userData,
        password: hashedPassword,
        role: {
          type:  'standard',
          assignment_date: new Date()
        },
        profileImage: {url:"https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg"}
      });
      const savedUser = await user.save();
      return savedUser.toObject();
    }

}