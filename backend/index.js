const express = require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
    cors()
);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("MongoDB connection error:", err);
});



// Import routes
const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/verificationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrations');
const dashboardRoutes=require('./routes/adminDashboardRoutes');
const adminAnalyticsRoutes=require('./routes/adminAnalyticsRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes');
const homeRoutes=require('./routes/homeRoutes')
const paymentRoutes = require('./routes/paymentRoutes');









// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admindashboard',dashboardRoutes);
app.use('/api/adminanalytics',adminAnalyticsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/home',homeRoutes)
app.use('/api/payment', paymentRoutes);



    







app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});