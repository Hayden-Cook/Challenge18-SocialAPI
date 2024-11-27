const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            console.error('Error getting thoughts:', err);
            res.status(500).json(err);
        }
    },
    // get single thought by id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id!' });
            }

            res.json(thought);
        } catch (err) {
            console.error('Error getting single thought:', err);
            res.status(500).json(err);
        }
    },

    // create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            // add thought to user's thought list
            await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            res.json(thought);
        } catch (err) {
            console.error('Error creating thought:', err);
            res.status(500).json(err);
        }
    },
    // update thought by id
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id!' });
            }

            res.json(thought);
        } catch (err) {
            console.error('Error updating thought:', err);
            res.status(500).json(err);
        }
    },
    // delete thought by id
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id!' });
            }

            // remove thought from user's thought list
            await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } }
            );

            res.json({ message: 'Thought deleted!' });
        } catch (err) {
            console.error('Error deleting thought:', err);
            res.status(500).json(err);
        }
    },
    // add a reaction to a thought
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id!' });
            }

            res.json(thought);
        } catch (err) {
            console.error('Error adding reaction:', err);
            res.status(500).json(err);
        }
    },
    // remove a reaction from a thought
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id!' });
            }

            res.json(thought);
        } catch (err) {
            console.error('Error removing reaction:', err);
            res.status(500).json(err);
        }
    },
};