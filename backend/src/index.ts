import "dotenv/config";
import app from "./app";
import connectDB from "./lib/db";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running at http://localhost:${PORT}`);
});
