import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRouter from './routes/authRouter.js';
import usersRouter from './routes/usersRouter.js';
import todosRouter from './routes/todosRouter.js';
import configurePassport from './config/configurePassport.js';
import cookieParser from 'cookie-parser';
import authHandler from './middleware/authHandler.js'
import connectDB from './config/db.js'

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/users', authHandler.checkAuthentication, usersRouter);
app.use('/api/todos', passport.authenticate('jwt', { session : false}), todosRouter);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

export default app;
