const mysql=require('mysql')
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123thank',
    database: 'mydb',
  })
  module.exports = db