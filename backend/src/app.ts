import express from "express";
import { connect } from "./utils/features.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies
app.use(cors({
  origin: 'http://localhost:3000', // Your Next.js frontend URL
  credentials: true, // Allow cookies to be sent and received
}));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 4000;

connect()
  .then((connection) => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
// Followings are the imports of the routes
import issueRoutes from "./routes/issue.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import roleRoutes from "./routes/role.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import serviceRoutes from "./routes/service.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use("/api/issues", issueRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
