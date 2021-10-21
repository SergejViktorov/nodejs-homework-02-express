const express = require('express')
const router = express.Router()
const {
  registration,
  login,
  logout,
  current,
} = require('../../controllers/users')
const guard = require('../../helpers/guard')
const loginLimit = require('../../helpers/rate-limit-login')

router.post('/registration', registration)
router.post('/login', loginLimit, login)
router.post('/logout', guard, logout)
router.get('/current', guard, current)

module.exports = router
