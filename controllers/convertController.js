// controllers/convertController.js
const Conversion = require("../models/Conversion");
const { validationResult } = require("express-validator");

const wantsJson = (req) => {
  return req.headers.accept?.includes("application/json");
};

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
      if (wantsJson(req)) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

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
      if (wantsJson(req)) {
        return res.status(500).json({
          error: "Conversion failed"
        });
      }

      return res.status(500).send("Conversion failed");
    }

    const result = data.rates[to];

    const conversion = await Conversion.create({
      from,
      to,
      amount,
      result
    });

    if (wantsJson(req)) {
      return res.json({
        result,
        conversion
      });
    }

    return res.render("index", {
      result,
      currencyList,
      title: "Currency Converter",
      oldInput: req.body
    });

  } catch (error) {
    console.error(error);

    if (wantsJson(req)) {
      return res.status(500).json({
        error: "Server error"
      });
    }

    return res.status(500).send("Server error");
  }
};

module.exports = {
  convertCurrency
};