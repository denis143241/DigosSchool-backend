const mongoose = require("mongoose");

const CompletedScheme = mongoose.Schema({
  master: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  Score: {
    type: Number,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
});

const Completed = (module.exports = mongoose.model("Completed", CompletedScheme));
