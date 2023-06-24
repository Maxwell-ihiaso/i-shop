const createError = require('http-errors')
const { validateUserData } = require('../utils/joi_data_validation')
const { signAccessToken, signRefreshToken } = require('../utils/JWT_helper')
const { createUser, getUserbyCredential } = require('../services/user.services')

const registerHandler = async (req, res, next) => {
  try {
    const userData = await validateUserData.validateAsync(req.body)
    
    await createUser(userData)

    res.status(200).json({ message: 'New user created successfully' })
  } catch (err) {
    if (err.isJoi) err.status = 422
    next(err)
  }
}

const loginHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const isExistingUser = await getUserbyCredential({ username })

    if (!isExistingUser)
      throw createError.NotAcceptable(`"${username}" is not registered`)

    const isCorrectPassword = await isExistingUser.isValidPassword(password)

    if (!isCorrectPassword)
      throw createError.Unauthorized(`Email/ Password is incorrect`)

    const accessToken = await signAccessToken(
      isExistingUser.id,
      isExistingUser.isAdmin
    )
    const refreshToken = await signRefreshToken(
      isExistingUser.id,
      isExistingUser.isAdmin
    )

    const { isAdmin, ...others } = isExistingUser._doc

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    })
    res.status(200).json({ isAdmin, accessToken })
  } catch (err) {
    if (err.isJoi) err.status = 422
    next(err)
  }
}

module.exports = { loginHandler, registerHandler }
