const router = require('express').Router()
const controller = require('./auth.controller')

router.post('/register', controller.register)
router.get('/login', controller.login)

module.exports = router
