require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const productsRouter = require("./routes/products");
const animalsRouter = require("./routes/animals");
const ordersRouter = require("./routes/orders");
const inquiriesRouter = require("./routes/inquiries");
const contactRouter = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ============ API ROUTES ============
app.use("/api/products", productsRouter);
app.use("/api/animals", animalsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/animal-inquiries", inquiriesRouter);
app.use("/api/contact", contactRouter);

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============ SERVE FRONTEND ============
// Your existing HTML/CSS/JS + images live here and are served as-is.
app.use(express.static(path.join(__dirname, "public")));

// Fallback: any unknown non-API route goes to the site's homepage
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Punjab Dairy Farm server running at http://localhost:${PORT}`);
});
