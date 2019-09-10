const db = require('./dbase');

db.serialize(function(){
  let sql = `CREATE TABLE IF NOT EXISTS stock(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock INTEGER
  );`;
  db.run(sql, (err) => {
    if(err) throw err;
    console.log("Table created.");

    db.serialize(function(){
	    let sql = "INSERT INTO stock (stock) VALUES (0)";
	    db.run(sql, (err) => {
	        if(err) throw err;
	        console.log("1 record inserted.");
	    });
		});
  });
});