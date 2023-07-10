const mysql = require('mysql2/promise');

const conMysql = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database:'confetti_cuisine'
  });
}

module.exports = {
  findOneById : async (table,id) => {
    try {const con = await conMysql();
    const [result, field] = await con.execute(`SELECT * FROM ${table} WHERE id = ?`,[id]);
    return result
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  findOneByEmail : async (table,email) => {
    try {const con = await conMysql();
    const [result, field] = await con.execute(`SELECT * FROM ${table} WHERE email = ?`,[email]);
    return result
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  findAll: async (table) => {
    try {
      const con = await conMysql();
      const [result, field] = await con.execute(`SELECT * FROM ${table} `)
      return result 
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  create: async (table, data) => {
    try {
      const con = await conMysql();
      sql = mysql.format(`INSERT INTO ${table} SET ?;`,[data])
      console.log(sql)
//      const [result, field] = await con.query(sql);
      const [result, field] = await con.query(`INSERT INTO ${table} SET ?`,[data]);
      return result
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  findByIdAndUpdate: async (table, id, data) => {
    try {
      const con = await conMysql();
      const [result, field] = await con.query(`UPDATE ${table} SET ? WHERE id = ?`,[data,id]);
      return result 
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  findByIdAndRemove: async (table, id) => {
    try {
      const con = await conMysql();
      const [result, field] = await con.execute(`DELETE FROM ${table} WHERE id = ?`, [`${id}`]);
      return result 
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}