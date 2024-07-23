const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==================== CREATE ==================== //

// --- CREATE / register user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password:hashedPassword });

        res.status(201).json(user);
    } catch (error) {
        console.error("Error registering user: ", error);
        res.status(500).json({ error: error.message });
    }
};


// ==================== Compare ==================== //

// --- COMPARE credentials for login
exports.login = async (req, res) => {
    const { name, password } = req.body;
    try {
        // find user
        const user = await User.findOne({where : { name }})
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        } 
        // compare credentials
        const isMatch = await bcrypt.compare(password, user.dataValues.password)
        if (!isMatch) { 
            return res.status(401).json({ error: 'invalid credentials' });
        }

        // jwt token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ token });
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).json({ error: error.message });
    }
};

// ==================== GET ==================== //

// --- GET all users
exports.fetchAll = async (req, res) => {
    try {
        const user = await User.findAll()
        res.json({ user });
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).json({ error: error.message });
    }
};


// ==================== DELETE ==================== //

// --- DELETE all users
exports.deleteAll = async (req, res) => {
    try {
        await User.destroy({ where: {} })
        res.json({ message: "all users deleted" });
    } catch (error) {
        console.error("Error deleting all users: ", error);
        res.status(500).json({ error: error.message });
    }
}