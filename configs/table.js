const db = require('./dbase');

db.serialize(function(){
  let sql = `CREATE TABLE IF NOT EXISTS stock(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock INTEGER,
    link TEXT,
    judul
  );`;
  db.run(sql, (err) => {
    if(err) throw err;
    console.log("Table created.");
  });
});