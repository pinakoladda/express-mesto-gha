const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Не найдено' });
});

app.use(errors());

app.use((error, _req, res, _next) => {
  console.log(error);

  if (error.name === 'ValidationError') {
    return res.status(400).send({ message: 'Некорректные данные' });
  }

  if (error.name === 'CastError') {
    return res.status(400).send({ message: 'Невалидный id' });
  }

  return res.status(500).send({ message: 'Что-то пошло не так' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});