// eslint-disable-next-line no-undef
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')

const User = new Schema({
    name: String,
    user_id: String,
    password: String,
    admin: {type: Boolean, default: false}
})

// create new User document
User.statics.create = function (user_info) {
    if ('password' in user_info) {
        user_info.password = crypto.createHmac('sha1', config.secret)
            .update(user_info.password)
            .digest('base64')
    }
    const user = new this(user_info)
    // return the Promise
    return user.save()
}

User.statics.findOneByUserId = function (id) {
    return this.findOne({
        user_id: id
    }).exec()
}

// verify the password of the User documment
User.methods.verify = function (password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')

    return this.password === encrypted
}

User.methods.assignAdmin = function () {
    this.admin = true
    return this.save()
}

module.exports = mongoose.model('User', User)
