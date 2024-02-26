import mongoose from 'mongoose';

import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from 'mongoose-findorcreate';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// add unique username and password to the schema
UserSchema.plugin(passportLocalMongoose);

// add findOrCreate() method to the schema
UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);

export default User;
