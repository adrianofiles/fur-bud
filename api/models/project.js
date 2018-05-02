const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    projectImage: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Project', projectSchema);