// Service: Encapsulates business logic
const { UserRepository } = require('./user.repository');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../auth');

module.exports.UserService = {
    async getAllUsers() {
        return await UserRepository.findAll();
    },
    async getUserById(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
    },
    async getUsersByRole(role) {
        return await UserRepository.findByRole(role);
    },
    async createUser(userData) {
        return await UserRepository.create(userData);
    },
    async updateUser(userId, updateData) {
        const updatedUser = await UserRepository.updateById(userId, updateData);
        if (!updatedUser) throw new Error('User not found');
        return updatedUser;
    },
    async deleteUser(userId) {
        const deletedUser = await UserRepository.deleteById(userId);
        if (!deletedUser) throw new Error('User not found');
        return deletedUser;
    },
    async addToCart(userId, itemId) {
        return await UserRepository.addToCart(userId, itemId);
    },
    async register(userData) {
        const existingUser = await UserRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email is already registered');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        return await UserRepository.create(userData);
    },

    async login(email, password) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = generateToken({id: user._id, role: user.role})

        return { token, user };
    },
};