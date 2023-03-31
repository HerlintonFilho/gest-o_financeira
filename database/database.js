const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      port : 3306,
      user : 'root',
      password : 'valenteG12',
      database : 'gestaofinanceira'
    }
  });

module.exports = knex