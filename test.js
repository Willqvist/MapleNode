const mysql = require('mysql2/promise');

async function a() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'leaderms',
  });
  const [rows, cols] = await connection.query('DELETE FROM mn_voting WHERE id=6');
  console.log(rows, cols);
}
a();
