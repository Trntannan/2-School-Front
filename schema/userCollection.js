const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    fullName: { type: String },
    NumberOfKids: { type: String },
    school: { type: String },
    bio: { type: String },
    profilePic: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});
