const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res
    .cookie('jwtAccessToken', tokens.access.token, {
      maxAge: tokens.access.expires,
      httpOnly: true,
      secure: config.jwt.secureCookie === 'true',
    })
    .cookie('jwtRefreshToken', tokens.refresh.token, {
      maxAge: tokens.refresh.expires,
      httpOnly: true,
      secure: config.jwt.secureCookie === 'true',
    })
    .status(httpStatus.CREATED)
    .send({ user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res
    .cookie('jwtAccessToken', tokens.access.token, {
      maxAge: tokens.access.expires,
      httpOnly: true,
      secure: config.jwt.secureCookie === 'true',
    })
    .cookie('jwtRefreshToken', tokens.refresh.token, {
      maxAge: tokens.refresh.expires,
      httpOnly: true,
      secure: config.jwt.secureCookie === 'true',
    })
    .send({ user });
});

const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies && req.cookies.jwtRefreshToken ? req.cookies.jwtRefreshToken : undefined;
  await authService.logout(refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const refreshToken = req.cookies && req.cookies.jwtRefreshToken ? req.cookies.jwtRefreshToken : undefined;
  const tokens = await authService.refreshAuth(refreshToken);
  res
    .cookie('jwtAccessToken', tokens.access.token, {
      maxAge: tokens.access.expires,
      httpOnly: true,
      secure: config.jwt.secureCookie === 'true',
    })
    .cookie('jwtRefreshToken', tokens.refresh.token, {
      maxAge: tokens.refresh.expires,
      httpOnly: true,
      secure: config.jwt.secureCookie === 'true',
    })
    .send();
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const test = catchAsync(async (req, res) => {
  res.send('ok');
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  test,
};
