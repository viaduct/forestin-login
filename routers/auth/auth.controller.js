const User = require('../../models/user')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const data = req.body
    const secret = req.app.get('jwt-secret')

    let user_id = data.user_id
    let password = data.password
    let type = data.type

    if (user_id == null) {
        res.send('pls enter id')
    } else if (password == null) {
        res.send('pls enter password')
    }

    let find_user = await User.findOneByUserId(user_id)

    if (find_user == null) {
        if (type == 'register') {
            let user = await User.create({
                user_id: user_id,
                password: password,
            })
            res.send(await jwt.sign({id: user._id, user_id: user.user_id, password: user.password}, secret, {
                expiresIn: 86400
            }))
        }
    } else {
        res.status(500).send({error: 'exist id'});
    }
}

exports.login = async (req, res) => {
    const data = req.query
    const secret = req.app.get('jwt-secret')
    const user_id = data.user_id
    const password = data.password

    const find_user = await User.findOneByUserId(user_id)

    if (find_user) {
        if (find_user.verify(password)) {
            res.send(await jwt.sign({
                id: find_user._id,
                user_id: find_user.user_id,
                password: find_user.password
            }, secret, {
                expiresIn: 86400
            }))
        } else {
            res.status(500).send({error: 'password don\'t match'});
        }
    } else {
        res.status(500).send({error: 'id don\'t match'});
    }
}
