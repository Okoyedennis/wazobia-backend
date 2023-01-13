const express = require("express");
const { createCard, readCard, updateCard, deleteCard } = require("../controllers/card");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/create", auth, createCard);
router.get("/read", auth, readCard);
router.patch("/update/:id", auth, updateCard);
router.delete("/delete/:id", auth, deleteCard);

module.exports = {
  card: router,
};
 