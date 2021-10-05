const express = require('express');
const app = express();

const server = require('http').createServer(app);

const PORT = process.env.PORT || 5000;

const mongoose = require('mongoose');

const router = require('./router');

const Data = require('./dataSchema');
app.use(router);

const io = require('socket.io')(server);

require('dotenv').config();
// Function
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// DataBase

const dbURI = `mongodb+srv://darshan:${process.env.REACT_APP_PASSWORD}@cluster0.yyd90.mongodb.net/Storage?retryWrites=true&w=majority`;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(dbURI, options)
  .then(() => {
    console.log('Database Connection Established');
  })
  .catch(() => {
    console.log('Database Connection Not Successfull');
  });

io.on('connection', (socket) => {
  // console.log('we have new connection!!');

  socket.on('startUpload', () => {
    const myUpload = setInterval(upload, 3000);
    function upload() {
      const temp = getRndInteger(50, 95);
      const battery = getRndInteger(0, 100);

      // const localTime = formatAMPM(time);
      const upload = new Data({
        temp: temp,
        battery: battery,
      });
      upload.save().then(() => {
        io.emit('sent');
      });
    }
    socket.on('stopUpload', () => {
      clearInterval(myUpload);
    });

    socket.on('disconnect', () => {
      clearInterval(myUpload);
    });

    socket.on('clear', () => {
      clearInterval(myUpload);
    });
  });
  Data.watch().on('change', async (change) => {
    var reading = await Data.find({}).sort({ $natural: -1 }).limit(20);
    socket.emit('getDB', reading);
  });
});

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
