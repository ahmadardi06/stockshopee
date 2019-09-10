var sqlite3 = require('sqlite3').verbose();
var dbFile = __dirname + "/../db/mydb.db";

var db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
  if(err) throw err;
  console.log("Koneksi ke database berhasil!");
});

module.exports = db;