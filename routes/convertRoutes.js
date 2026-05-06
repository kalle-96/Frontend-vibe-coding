const express = require("express");
const { body } = require("express-validator");
const { convertCurrency } = require("../controllers/convertController");

const router = express.Router();

router.post(
  "/convert",
  [
    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a positive number"),

    body("from")
      .notEmpty()
      .withMessage("From currency is required"),

    body("to")
      .notEmpty()
      .withMessage("To currency is required"),

    body("to").custom((value, { req }) => {
      if (value === req.body.from) {
        throw new Error("Currencies must be different");
      }
      return true;
    })
  ],
  convertCurrency
);

module.exports = router;