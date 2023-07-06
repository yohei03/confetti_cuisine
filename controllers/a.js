const mysql = require("mysql2/promise");

const con = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database:'example_nodejs'
});

const func = async () => {
  const [rows, fields] = await con.execute("SELECT * FROM subscribers");
  console.log(rows);  
  console.log(fields);
}
func();
