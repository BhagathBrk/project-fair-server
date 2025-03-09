const users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// register
exports.registerController = async (req, res) => {
    console.log("Inside register controller");
    console.log(req.body);

    const { username, email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(406).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new users({
            username,
            email,
            password: hashedPassword,
            github: '',
            linkedin: '',
            profilePic: ''
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// login
exports.loginController = async (req, res) => {
    console.log("Inside login controller");

    const { email, password } = req.body;
    console.log(email, password);

    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "Incorrect Email/Password" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect Email/Password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWTPASSWORD, { expiresIn: "7d" });

        res.status(200).json({ user: existingUser, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// profile updation
exports.editUserController = async (req, res) => {
    console.log("editUserController");

    const { username, email, password, github, linkedin, profilePic } = req.body;
    const uploadProfilePic = req.file ? req.file.filename : profilePic;
    const userId = req.userId;

    try {
        let updateData = { username, email, github, linkedin, profilePic: uploadProfilePic };

        // Hash new password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await users.findByIdAndUpdate(
            { _id: userId },
            updateData,
            { new: true }
        );

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
