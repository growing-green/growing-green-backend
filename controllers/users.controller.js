const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { tokenSecretKey } = require('../configs');
const { BadRequestError } = require('../lib/errors');

exports.getLoginOrSingUp = async (req, res, next) => {
  try {
    const { email, name, photo_url } = req.body;
    const targetUser = await User.findOne({ email });
    const user = {};

    if (!targetUser) {
      const newUser = await User.create({
        email,
        name,
        photo_url,
        last_login_date: new Date(),
      });

      user._id = newUser._id.toJSON();
      user.name = newUser.name;
      user.email = newUser.email;
      user.photoURL = newUser.photo_url;
      user.last_login_date = new Date();

      if (!newUser) {
        return next(new BadRequestError('회원가입에 실패했습니다.'));
      }

      const token = jwt.sign(user, tokenSecretKey);

      return res.status(201).json({
        token,
        user,
      });
    } else {
      targetUser.last_login_date = new Date();
      await targetUser.save();

      user._id = targetUser._id.toJSON();
      user.name = targetUser.name;
      user.email = targetUser.email;
      user.photoURL = targetUser.photo_url;

      const token = jwt.sign(user, tokenSecretKey);

      return res.status(201).json({
        token,
        user,
      });
    }
  } catch {
    next(new BadRequestError('로그인에 실패했습니다.'));
  }
};
