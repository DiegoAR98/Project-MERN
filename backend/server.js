const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const User = require('./models/User');
const Project = require('./models/Project');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cron = require('node-cron');
const moment = require('moment');
const sendEmail = require('./utils/sendEmail');
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();
connectDB();

const app = express();

// Use JSON middleware
app.use(express.json());

const allowedOrigins = [process.env.CLIENT_URL, 'https://projectmern1-7bb9c43acad8.herokuapp.com'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies to be sent with requests
}));

// Define your routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


const getUser = async (token) => {
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      return user;
    } catch (err) {
      throw new Error('Session invalid');
    }
  }
};

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = await getUser(token.replace('Bearer ', ''));
      return { user };
    },
    persistedQueries: false,  // Disable persisted queries to avoid DoS attacks
    cache: "bounded",  // Enable bounded cache to avoid memory exhaustion
  });

  await server.start();
  server.applyMiddleware({ app });

  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Schedule email notifications
cron.schedule('0 8 * * *', async () => {
  console.log('Running cron job for email notifications');
  const today = moment().startOf('day');
  const upcomingDeadline = moment().add(1, 'days').startOf('day');

  const projects = await Project.find({
    dueDate: { $gte: today.toDate(), $lte: upcomingDeadline.toDate() },
  }).populate('user', 'email name');

  console.log(`Found ${projects.length} projects with upcoming deadlines`);

  for (const project of projects) {
    console.log(`Sending email for project: ${project.name} to ${project.user.email}`);
    await sendEmail({
      to: project.user.email,
      subject: 'Upcoming Project Deadline',
      text: `Hello ${project.user.name},\n\nYour project "${project.name}" is due in 1 day on ${moment(project.dueDate).format('LL')}.\n\nBest regards,\nProject Manager`,
    });
  }
});

startApolloServer();
