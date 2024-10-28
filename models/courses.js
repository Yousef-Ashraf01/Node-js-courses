const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: { type: String, required: true, minlength: 2 },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Course", courseSchema);
