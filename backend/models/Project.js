const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isComplete: { type: Boolean, default: false },
}, { _id: true });

const projectSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ['college', 'internship', 'work', 'others'],
    },
    dueDate: {
      type: Date,
    },
    tasks: [taskSchema],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
