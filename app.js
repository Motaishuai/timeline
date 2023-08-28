const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module


const app = express();
const PORT = process.env.PORT || 3000;

// Set up view engine and views directory
app.set('view engine', 'ejs'); // You can use a different template engine if you prefer
app.set('views', path.join(__dirname, 'views'));

// Require and use the routes
const routes = require('./routes');
app.use('/', routes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/express_mongodb_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define MongoDB schema and model
const PostSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model('Post', PostSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Express MongoDB App');
});

app.post('/submit', (req, res) => {
  const { title, content } = req.body;

  // Validate input length
  if (title.length < 25 || content.length < 25) {
    return res.status(400).json({ message: 'Minimum length for title and content is 25 characters' });
  }

  const newPost = new Post({
    title,
    content
  });

  newPost.save((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving post' });
    }
    res.status(201).json({ message: 'Post submitted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});