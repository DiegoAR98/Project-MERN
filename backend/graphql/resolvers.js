const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    projects: async () => {
      return await Project.find();
    },
  },
  Mutation: {
    createUser: async (parent, { name, email, password }) => {
      const userExists = await User.findOne({ email });

      if (userExists) {
        throw new Error('User already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await user.save();

      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      return {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        token,
      };
    },
    createProject: async (parent, { name, description, category, dueDate }, context) => {
      const user = context.user;

      if (!user) {
        throw new Error('Not authenticated');
      }

      const project = new Project({
        user: user.id,
        name,
        description,
        category,
        dueDate,
      });

      const savedProject = await project.save();
      return savedProject;
    },
  },
};

module.exports = resolvers;
