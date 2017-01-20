const express = require('express');
const router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'guyhoquet'
});

router.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/test', (req, res) => {
  res.send('test api');
});


router.get('/collaboraters', (req, res) => {
    connection.query('SELECT * from collaborater', function(err, rows, fields) {
      if (err) throw err;
      console.log('The solution is: ', rows);

      res.status(200).json(rows);
     // console.log('The solution is: ', rows[0].id);
    });
});

router.get('/managers', (req, res) => {
    connection.query('SELECT * from user where roleId=2', function(err, rows, fields) {
      if (err) throw err;
      console.log('The solution is: ', rows);

      res.status(200).json(rows);
     // console.log('The solution is: ', rows[0].id);
    });
});


router.get('/collaboraters/:token', (req, res) => {
    connection.query("SELECT * from user where token='"+req.params.token+"'", function(err, rows, fields) {
      if (err) throw err;
      console.log('The user is: ', rows);
      if(rows.length > 0) {
        var user = rows[0];
        connection.query("SELECT * from collaborater where userId='"+user.id+"'", function(err, rows, fields) {
          if (err) throw err;
          console.log('The solution is: ', rows);

          res.status(200).json(rows);
        // console.log('The solution is: ', rows[0].id);
        });
      } else {
        res.send('');
      }
    });
});


//create
router.post('/collaboraters', (req, res) => {
          console.log('The user is: ', req.body);

    connection.query("INSERT INTO collaborater (firstName, lastName, birthDate, job, email, phone, userId) VALUES ('"+req.body.firstName+"', '"+req.body.lastName+"', '"+req.body.birthDate+"', '"+req.body.job+"', '"+req.body.email+"' , '"+req.body.phone+"', '"+req.body.userId+"')",
    function(err, rows, fields) {
      if (err) throw err;
      res.json({ message: 'Collaborater created!' });
    });
});

//update
router.put('/collaboraters/:id', (req, res) => {
    console.log('The user is: ', req.body);
    connection.query("UPDATE collaborater set firstName = '"+req.body.firstName+"', lastName = '"+req.body.lastName+"' where id='"+req.params.id+"'", function(err, rows, fields) {
      if (err) throw err;
      res.json({ message: 'Collaborater updated!' });

    });
});

router.delete('/collaboraters/:id', (req, res) => {
    connection.query("DELETE FROM collaborater where id = '"+req.params.id+"'", function(err, rows, fields) {
      if (err) throw err;
      res.json({ message: 'Collaborater deleted!' });

    });
});


module.exports = router;
