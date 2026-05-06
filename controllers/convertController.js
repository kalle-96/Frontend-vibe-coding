// controllers/convertController.js
const Conversion = require("../models/Conversion");
const { validationResult } = require("express-validator");

const convertCurrency = async (req, res) => {
  try {
    const errors = validationResult(req);

    const responseCurrencies = await fetch("https://api.frankfurter.app/currencies");
    const currencies = await responseCurrencies.json();

    const currencyList = Object.entries(currencies).map(([code, name]) => ({
      code,
      name
    }));

    if (!errors.isEmpty()) {
      return res.render("index", {
        errors: errors.array(),
        currencyList,
        title: "Currency Converter",
        oldInput: req.body
      });
    }

    const { amount, from, to } = req.body;

    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.rates || !data.rates[to]) {
      return res.status(500).send("Conversion failed");
    }

    const result = data.rates[to];

    await Conversion.create({
      from,
      to,
      amount,
      result
    });

    return res.render("index", {
      result,
      currencyList,
      title: "Currency Converter",
      oldInput: req.body
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  convertCurrency
};