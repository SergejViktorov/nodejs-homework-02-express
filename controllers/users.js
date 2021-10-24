const jwt = require('jsonwebtoken')
const path = require('path')
const mkdirp = require('mkdirp')
const Users = require('../repository/users')
const UploadService = require('../services/file-upload')
const { HttpCode } = require('../config/constants')
require('dotenv').config()
const SECRET_KEY = process.env.JVT_SECRET_KEY

const registration = async (req, res, next) => {
	const { name, email, password, subscription } = req.body
	const user = await Users.findByEmail(email)
	if (user) {
		return res.status(HttpCode.CONFLICT).json({
			status: 'error',
			code: HttpCode.CONFLICT,
			message: 'Email is already exist',
		})
	}
	try {
		const newUser = await Users.create({
			name,
			email,
			password,
			subscription,
		})
		return res.status(HttpCode.CREATED).json({
			status: 'success',
			code: HttpCode.CREATED,
			data: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				subscription: newUser.subscription,
				avatar: newUser.avatar,
			},
		})
	} catch (e) {
		next(e)
	}
}

const login = async (req, res, next) => {
	const { email, password } = req.body
	const user = await Users.findByEmail(email)
	const isValidPassword = await user.isValidPassword(password)
	if (!user || !isValidPassword) {
		return res.status(HttpCode.UNAUTHORIZED).json({
			status: 'error',
			code: HttpCode.UNAUTHORIZED,
			message: 'Invalid credentials',
		})
	}
	const id = user._id
	const payload = { id }
	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
	console.log(token)
	await Users.updateToken(id, token)
	return res.status(HttpCode.OK).json({
		status: 'success',
		code: HttpCode.OK,
		date: {
			token,
		},
	})
}

const logout = async (req, res, next) => {
	const id = req.user._id
	await Users.updateToken(id, null)
	return res.status(HttpCode.NO_CONTENT).json({ test: 'test' })
}

const current = async (req, res, next) => {
	const { email } = req.body
	const user = await Users.findByEmail(email)
	if (!user) {
		return res.status(HttpCode.UNAUTHORIZED).json({
			status: 'error',
			code: HttpCode.UNAUTHORIZED,
			message: 'Not authorized',
		})
	}
	const subscription = user.subscription
	return res.status(HttpCode.OK).json({
		status: 'success',
		code: HttpCode.OK,
		date: {
			email,
			subscription,
		},
	})
}

const uploadAvatar = async (req, res, next) => {
	const id = req.user._id
	const file = req.file
	const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS
	const destination = path.join(AVATAR_OF_USERS, id)
	await mkdirp(destination)
	const uploadService = new UploadService(destination)
	const avatarUrl = await uploadService.save(file, id)
	await Users.updateAvatar(id, avatarUrl)
	return res.status(HttpCode.OK).json({
		status: 'success',
		code: HttpCode.OK,
		date: {
			avatar: avatarUrl,
		},
	})
}

module.exports = {
	registration,
	login,
	logout,
	current,
	uploadAvatar,
}
