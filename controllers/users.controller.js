const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { tokenSecretKey } = require('../configs');
const {
  BadRequestError,
  InvalidTokenError,
  TokenExpiredError,
} = require('../lib/errors');

exports.getLoginOrSingUp = async (req, res) => {
  try {
    const { email, name, photo_url } = req.body;
    const targetUser = await User.findOne({ email });

    if (!targetUser) {
      const newUser = await User.create({
        email,
        name,
        photo_url,
        last_login_date: new Date(),
      });

      if (!newUser) {
        return next(new BadRequestError('회원가입에 실패했습니다.'));
      }

      const option = { expiresIn: '1d', issuer: 'eunbin' };
      const token = jwt.sign(newUser, tokenSecretKey, option);

      return res.status(201).json({
        result: 'success',
        data: {
          token,
          user: newUser,
        },
      });
    }

    targetUser.last_login_date = new Date();
    await targetUser.save();

    const token = jwt.sign(targetUser, tokenSecretKey, option);

    return res.status(200).json({
      result: 'success',
      data: {
        token,
        user: targetUser,
      },
    });
  } catch {
    next(new BadRequestError('로그인에 실패했습니다.'));
  }
};

exports.getAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new InvalidTokenError());
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = await jwt.verify(token, tokenSecretKey);

    return res.status(200).json({ user: payload });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      next(new TokenExpiredError());
    }

    next(new InvalidTokenError());
  }
};
