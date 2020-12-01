"use strict";

var _require = require("mongodb"),
    MongoClient = _require.MongoClient;

var uri = 'mongodb+srv://shoesStore:SiL0PDyzkVB1B0O4@cluster0.edx0y.mongodb.net/ShoesStore?retryWrites=true&w=majority'; // Create a new MongoClient

var client = new MongoClient(uri, {
  useUnifiedTopology: true
});
var database;

function connectDb() {
  return regeneratorRuntime.async(function connectDb$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(client.connect());

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(client.db("ShoesStore"));

        case 4:
          database = _context.sent;
          console.log('Db connected!');

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

console.log('RUNNING DB...');
connectDb();

var db = function db() {
  return database;
};

module.exports.db = db;