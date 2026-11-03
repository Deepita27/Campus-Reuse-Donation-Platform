const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your college email ID'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid college email address'
      ]
    },
    studentId: {
      type: String,
      required: [true, 'Please provide your Student ID / Roll Number'],
      trim: true,
      uppercase: true
    },
    department: {
      type: String,
      required: [true, 'Please select your academic department'],
      trim: true
    },
    year: {
      type: String,
      required: [true, 'Please select your year of study'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Faculty/Staff']
    },
    password: {
      type: String,
      required: [true, 'Please enter a secure password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: 'Eco-conscious student participating in campus circular exchange.'
    }
  },
  {
    timestamps: true
  }
);

// Hash password prior to saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
