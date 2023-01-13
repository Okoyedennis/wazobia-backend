const { Card } = require("../models/card");

const createCard = async (req, res) => {
  const card = new Card({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await card.save();
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send(error);
  }
};

const readCard = async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.amount) {
    match.amount = req.query.amount === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "card",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();

    res.status(200).send(req.user.card);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const updateCard = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "description"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  // if (!isValidOperation) {
  //   return res.status(400).send({ error: "Invalid updates!" });
  // }

  try {
    const card = await Card.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!card) {
      return res.status(404).send();
    }

    updates.forEach((update) => (card[update] = req.body[update]));
    await card.save();
    res.status(200).send(card);
  } catch (error) {}
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!card) {
      return res.status(404).send();
    }
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createCard,
  readCard,
  updateCard,
  deleteCard,
};
