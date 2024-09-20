import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: false }
})

export const Users = model('User', UserSchema);