const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false, // By default, a project is not completed
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ['college', 'internship', 'work', 'others'],
    default: 'others',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  tasks: [taskSchema],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attachment',
  }],
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
