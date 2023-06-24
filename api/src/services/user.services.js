const User = require('../models/User')
const createError = require('http-errors')

/**
 * creates a user in the Database
 * @param {*} userData 
 * @returns user document object
 */
const createUser = async (userData) => {
    const isExistingUser = await User.findOne({ email: userData.email }).exec()
    if (isExistingUser) 
    throw createError.Conflict(`${userData.email} already exists!`)
    
    const newUser = new User(userData)
    
    const savedUser = await newUser.save()
  return savedUser
}

/**
 * 
 * @param {*} userCredential 
 * @returns single user object if found else
 * returns null
 */
 const getUserbyCredential = async (userCredential) => {
    return await User.findOne(userCredential).exec()
}

module.exports = {createUser, getUserbyCredential}
