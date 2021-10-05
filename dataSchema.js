const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema(
  {
    temp: {
      type: Number,
      required: true,
    },
    battery: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Data = mongoose.model('readings', dataSchema);

module.exports = Data;
