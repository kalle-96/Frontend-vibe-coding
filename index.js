const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const { body } = require("express-validator");
const { convertCurrency } = require("./controllers/convertController");

// 🔹 import routes
const convertRoutes = require("./routes/convertRoutes");
const Conversion = require("./models/Conversion");
const Favorite = require("./models/favorite");

// 🔹 middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// static files
app.use(express.static('public'));

// 🔹 view engine (ONLY if using Handlebars)
const { engine } = require("express-handlebars");

const hbs = engine({
  helpers: {
    ifEquals(a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  }
});

app.engine("handlebars", engine({
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
}));
app.set("view engine", "handlebars");
app.set("views", "./views");

// 🔹 MongoDB connection
const uri = process.env.URI;

mongoose.connect(uri)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// 🔹 home route
app.get("/", async (req, res) => {
    const response = await fetch("https://api.frankfurter.app/currencies");
    const currencies = await response.json();

    const currencyList = Object.entries(currencies).map(([code, name]) => ({code, name}));

    res.render("index", {currencyList});
});

// 🔹 routes
app.get("/history", async (req, res) => {
    const conversions = await Conversion.find().sort({ _id: -1 }).lean();
    res.render("history", {conversions});
});

// delete one from history
app.post("/history/:id/delete", async (req, res) => {
    await Conversion.findByIdAndDelete(req.params.id);
    res.redirect("/history");
});

app.get("/favorites", async (req, res) => {
  const favorites = await Favorite.find().sort({ _id: -1 }).lean();

  res.render("favorites", {
    favorites,
    title: "Favorites"
  });
});

app.post("/favorites", async (req, res) => {
  const { from, to, amount, result } = req.body;

  await Favorite.create({
    from,
    to,
    amount,
    result
  });

  res.redirect("/favorites");
});

app.post("/favorites/:id/delete", async (req, res) => {
  await Favorite.findByIdAndDelete(req.params.id);
  res.redirect("/favorites");
});

app.use("/api/conversions", convertRoutes);



// 🔹 server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));