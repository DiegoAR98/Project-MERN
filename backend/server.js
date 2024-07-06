const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const path = require('path');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Ensure CORS is imported

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors()); // Use CORS middleware

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
  });

  await server.start();
  server.applyMiddleware({ app });

  app.use('/api/users', userRoutes);
  app.use('/api/projects', projectRoutes);

  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();
