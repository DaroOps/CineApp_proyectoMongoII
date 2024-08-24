import User from './user.model.js';
import bcrypt from 'bcrypt';

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

  async updateUser(id, updateData ) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return updatedUser;
  }

  async deleteUser(id) {
    const deletedUser = await User.findByIdAndDelete(id).lean();
    return deletedUser;
  }

  async addVipCard(id, vipCardData) {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        vip_card: {
          ...vipCardData,
          issue_date: new Date()
        }
      },
      { new: true }
    ).lean();
    return updatedUser;
  }

  async addPurchaseToHistory(id, purchaseId) {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { purchase_history: purchaseId } },
      { new: true }
    ).lean();
    return updatedUser;
  }
}