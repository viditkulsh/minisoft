const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Account = require('../models/account');
const { v4: uuidv4 } = require('uuid');
const { checkAuth } = require('../utils/auth');

// Create user
router.post('/create', checkAuth, async (req, res) => {
    const { name, mail, mobile } = req.body;
    if (!name || !mail || !mobile) {
        return res.status(400).send('Invalid body');
    }
    const emailRegex = /\S+@\S+\.\S+/;
    const mobileRegex = /^[0-9]{10}$/;
    if (!emailRegex.test(mail) || !mobileRegex.test(mobile)) {
        return res.status(400).send('Invalid email or mobile format');
    }
    try {
        const existingUser = await User.findOne({ mail });
        if (existingUser) {
            return res.status(409).send('User already exists');
        }
        const user = new User({
            name,
            mail,
            mobile,
            contact: [mail, mobile]
        });
        await user.save();
        const account = new Account({
            user: {
                name: user.name,
                mail: user.mail,
                uuid: user.uuid
            },
            account: {
                number: uuidv4().replace(/-/g, '').substring(0, 16),
                branch: 'SBIN00000009',
                bank: 'state bank of india'
            },
            balance: {
                number: 5000,
                currency: 'INR'
            }
        });
        await account.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update user
router.put('/update', checkAuth, async (req, res) => {
    const { uuid, name, mail, mobile } = req.body;
    if (!uuid || !name || !mail || !mobile) {
        return res.status(400).send('Invalid body');
    }
    const emailRegex = /\S+@\S+\.\S+/;
    const mobileRegex = /^[0-9]{10}$/;
    if (!emailRegex.test(mail) || !mobileRegex.test(mobile)) {
        return res.status(400).send('Invalid email or mobile format');
    }
    try {
        const user = await User.findOne({ uuid });
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.name = name;
        user.mail = mail;
        user.mobile = mobile;
        user.contact = [mail, mobile];
        await user.save();
        await Account.updateOne({ 'user.uuid': uuid }, {
            'user.name': name,
            'user.mail': mail
        });
        res.status(200).send('User updated successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete user
router.delete('/delete', checkAuth, async (req, res) => {
    const { uuid } = req.body;
    if (!uuid) {
        return res.status(400).send('Invalid body');
    }
    try {
        const user = await User.findOne({ uuid });
        if (!user) {
            return res.status(404).send('User not found');
        }
        await Account.deleteMany({ 'user.uuid': uuid });
        await User.deleteOne({ uuid });
        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// List users
router.get('/list', checkAuth, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get user account details
router.get('/account', checkAuth, async (req, res) => {
    const { uuid } = req.body;
    if (!uuid) {
        return res.status(400).send('Invalid body');
    }
    try {
        const account = await Account.findOne({ 'user.uuid': uuid });
        if (!account) {
            return res.status(404).send('Account not found');
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
