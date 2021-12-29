//=============================================================================
// Basic Config
//=============================================================================
const express = require('express');
const cors = require('cors');
const app = express();

//=============================================================================
// Mongo Atlas Connection
//=============================================================================
require('dotenv').config();
const mongoose = require('mongoose');

// Mongo URL and Connection
const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.DATABASE_URL;
// const db = mongoose.connection;

// Connect to Mongo

// mongoose.connect(MONGODB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Connection Error/Success - optional but can be helpful
// Define callback functions for various events
// db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
// db.on('connected', () => console.log('mongo connected at: ', MONGODB_URL));
// db.on('disconnected', () => console.log('mongo disconnected'));

// Open the Connection
// db.on('open', () => {
//   console.log('✅ mongo connection made!');
// });

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGODB_URL);
}

//=============================================================================
// Schema
//=============================================================================

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Todo Schema
const todoSchema = new mongoose.Schema({
  userId: String,
  todo: [
    {
      checked: Boolean,
      text: String,
    },
  ],
});
const Todo = mongoose.model('Todo', todoSchema);

//=============================================================================
// Middleware
//=============================================================================
app.use(cors());
app.use(express.json());

//
app.post('/create', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();
  if (user) {
    res.status(500);
    res.json({
      message: 'Username already exists',
    });
    return;
  }
  await User.create({ username, password });
  res.json({
    message: 'Successfully created!!',
  });
  //   res.send('Created!!');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: 'Invalid login',
    });
    return;
  }
  res.json({
    message: 'Successfully loged in!!',
  });
});

app.get('/todos', async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(' ');
  const [username, password] = token.split(':');
  const user = await User.findOne({ username }).exec();

  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: 'Invalid access',
    });
    return;
  }
  const { todo } = await Todo.findOne({ userId: user._id }).exec();
  console.log(todo);
  res.json(todo);
});

app.post('/todos', async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(' ');
  const [username, password] = token.split(':');
  const todoItem = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: 'Invalid access',
    });
    return;
  }
  const todo = await Todo.findOne({ userId: user._id }).exec();
  if (!todo) {
    await Todo.create({
      userId: user._id,
      todo: todoItem,
    });
  } else {
    todo.todo = todoItem;
    await todo.save();
  }
  res.json(todoItem);
});

//=============================================================================
// START SERVER
//=============================================================================
app.listen(PORT, () => {
  console.log(`✅!!!SERVER IS RUNNING ON PORT:${PORT}!!!✅`);
});
