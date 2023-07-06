const mysql = require('mysql2/promise');
const conMysql = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database:'confetti_cuisine'
  });
}


exports.getAllSubscribers = async (req,res) => {
  const con = await conMysql();
  try {
    const [result, fields] = await con.query("SELECT * FROM subscribers");
    console.log(result);
    return await res.render("subscribers", {
      subscribers: result
    });
  } catch (error) {
    console.log(error);
    return [];
  } finally {
    console.log("Promise completed!");
  }
}

exports.findOne = async (req,res) => {
  const con = await conMysql();
  try {
    const [result, fields] = await con.execute("SELECT * FROM subscribers WHERE email == ?",[req.id]);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
  } finally {
    (await con).end();
  }
}

exports.getSubscriptionPage = (req,res) => {
  res.render("contact");
}

exports.saveSubscriber = async (req,res) => {
  const con = await conMysql();
  try {
    await con.query("INSERT INTO subscribers (id, name, email, zipCode) VALUES (?,?,?,?)", 
    [req.body.id, req.body.name, req.body.email, req.body.zipCode]);
    await res.render("thanks");
  } catch(error) {
    console.log(error);
    return res.json({error: error})
  } finally {
    con.end();
  }
};

