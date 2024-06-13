// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: {type: Number},
  role: { type: String, enum: ['user', 'admin', 'superadmin'] },
  refreshToken: { type: String } // 리프레시 토큰 필드 추가
});

const User = mongoose.model('User', UserSchema);

export default User;
