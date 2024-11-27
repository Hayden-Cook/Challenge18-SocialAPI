const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find()
            .populate('thoughts')
            .populate('friends');
            res.json(users);
        } catch (err) {
            console.error('Error getting users:', err);
            res.status(500).json(err);
        }
    },
    // get single user by id
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
            .populate('thoughts')
            .populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'No user found with that id!' });
            }

            res.json(user);
        } catch (err) {
            console.error('Error getting single user:', err);
            res.status(500).json(err);
        }
    },
    // create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json(err);
        }
    },
    // update user by id
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user found with that id!' });
            }

            res.json(user);
        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).json(err);
        }
    },
    // delete user by id
    async deleteUser(req, res) {
        try {
            const user = await User.findById(req.params.userId).populate('thoughts');

            if (!user) {
                return res.status(404).json({ message: 'No user found with that id!' });
            }
            // remove user's associated thoughts
            await Thought.deleteMany({ _id: { $in: user.thoughts.map(thought => thought._id) } });

            await User.findOneAndDelete({ _id: req.params.userId });

            res.json({ message: 'User and associated thoughts have been deleted!' });
        } catch (err) {
            console.error('Error deleting user:', err);
            res.status(500).json(err);
        }
    },
    // add a new friend to a user's friend list
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user found with that id!' });
            }

            res.json(user);
        } catch (err) {
            console.error('Error adding friend:', err);
            res.status(500).json(err);
        }
    },
    // remove a friend from a user's friend list
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user found with that id!' });
            }

            res.json(user);
        } catch (err) {
            console.error('Error removing friend:', err);
            res.status(500).json(err);
        }
    },
};