const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: /.+\@.+\..+/,
    trim: true,
    minlength: [1, 'Email must be at least 1 chars'],
    maxLength: [128, 'Email cannot be more than 128 chars'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [1, 'Name must be at least 1chars'],
    maxLength: [15, 'Name cannot be more than 39 chars'],
    trim: true,
  },
  photo_url: {
    type: String,
    required: [true, 'Photo Url is required'],
  },
  last_login_date: {
    type: Date,
    required: [true, 'Last Login Date is required'],
  },
});

module.exports = mongoose.model('User', userSchema);
