const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

//import routes
const testRoutes = require('./routes/testRoute');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const storeRoutes = require('./routes/storeRoute');
const levelRoutes = require('./routes/levelRoute');

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, (error) => {
    if (error) throw error;
    console.log('DB connected!');
});

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'public')));

//routes middlewares
app.use('/api', testRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', storeRoutes);
app.use('/api', levelRoutes);

//port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
