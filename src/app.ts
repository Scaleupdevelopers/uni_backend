import express from "express";
import connectDB from './config/db.js';
import {PORT} from './config/environment.js'
import { createServer } from "http";
import userRoute from './routes/userRoutes.js'
// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.send("Namaste India");
  });


  
// Connect to MongoDB
connectDB();


// userRoutes 
app.use("/api/user", userRoute);


// Create HTTP Server
const httpServer = createServer(app);

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});