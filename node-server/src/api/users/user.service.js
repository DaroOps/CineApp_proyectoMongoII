import User from './user.model.js';
import bcrypt from 'bcrypt';
import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';
import calculateFileHash from '../../utils/crypto.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import mongoose from 'mongoose';

import { UserDetailDTO } from './user.dto.js';

export default class UserService {
  async getUserById(id) {
    const user = await User.findById(id).lean();
    return new UserDetailDTO(user);
  }

  async createUser({ userData }) {
    console.log(userData.password);
    
    const hashedPassword = await bcrypt.hash(userData.password, 3);
    const user = new User({
      ...userData,
      password: hashedPassword,
      role: {
        type: userData.roleType || 'standard',
        assignment_date: new Date()
      }
    });
    const savedUser = await user.save();
    return savedUser.toObject();
  }

  async updateUser(id, updateData, imageFile) {
    const existingUser = await User.findById(id);
  
    if (!existingUser) {
      throw new Error('User not found');
    }
  
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    if (imageFile) {
      try {
      
        const fileHash = await calculateFileHash(imageFile.path);
        
 
        const duplicateUser = await User.findOne({ 'profileImage.hash': fileHash });
        
        if (duplicateUser) {
         
          updateData.profileImage = {
            url: duplicateUser.profileImage.url,
            hash: fileHash
          };
        } else {
          
          const result = await cloudinary.uploader.upload(imageFile.path);
          updateData.profileImage = {
            url: result.secure_url,
            hash: fileHash,
            public_id: result.public_id
          };
        }
        
        fs.unlinkSync(imageFile.path);
  
        if (existingUser.profileImage && existingUser.profileImage.public_id ) {
          try {
            // console.log('Deleting old profile image from Cloudinary');
            await cloudinary.uploader.destroy(existingUser.profileImage.public_id);
          } catch (deleteError) {
            console.error('Error deleting old image from Cloudinary:', deleteError);
          }
        }
      } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
      }
    }
  
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    return updatedUser;
  }

  async deleteUser(id) {
    const deletedUser = await User.findByIdAndDelete(id).lean();
    return deletedUser;
  }

  async becomeVIP(id, token) {
    const total = 9.99; // TODO: get this value from the database
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try{
      const user = await User.findById(id);
      
      if (!user) {
        throw new Error('User not found');
      }
  
      if (user.role.type === 'VIP') {
        throw new Error('User is already VIP');
      }
      
      const amount = Math.round(total * 100);

      const charge = await stripe.charges.create({
        amount,
        currency: 'usd',
        source: token,
        description: `User Become VIP  ${user.name}`,
      });

      if (charge.status === 'succeeded') {
        user.role.type = 'VIP';
        user.role.assignment_date = new Date();
        await user.save({ session });
        
        await session.commitTransaction();
        return { success: true };
      } else {
        throw new Error('Payment failed');
      }

    }
    catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    
  }
}