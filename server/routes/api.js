const express = require('express');
var nodemailer = require('nodemailer');
const crypto = require('crypto');
const dateformat = require('dateformat');

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
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/collaboraters', (req, res) => {
    connection.query('SELECT * from collaborater', function(err, rows, fields) {
      if (err) throw err;
      console.log('The solution is: ', rows);

      res.status(200).json(rows);
     // console.log('The solution is: ', rows[0].id);
    });
});

router.get('/collaboraters/:token', (req, res) => {
    console.log('The user token: ', req.params.token);

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
        res.status(200).json(rows);
      }
    });
});

router.get('/managers/:token', (req, res) => {
    console.log('The user token: ', req.params.token);

    connection.query("SELECT * from user where roleId=1 and token='"+req.params.token+"'", function(err, rows, fields) {
      if (err) throw err;
      console.log('The user is: ', rows);
      if(rows.length > 0) {
        var user = rows[0];
        connection.query("SELECT * from user where roleId=2", function(err, rows, fields) {
          if (err) throw err;
          console.log('The solution is: ', rows);

          res.status(200).json(rows);
        // console.log('The solution is: ', rows[0].id);
        });
      } else {
        res.status(200).json(rows);
      }
    });
});


function send(user) {
   require('crypto').randomBytes(48, function(err, buffer) {
        var token = buffer.toString('hex') + user.id;
        console.log("token : "+token);
        var dateNow = dateformat(new Date(), "yyyy-mm-dd h:MM:ss");
        connection.query("UPDATE user set token = '"+token+"', mailDate='"+dateNow+"' where id='"+user.id+"'", function(err, rows, fields) {

          // Not the movie transporter!
          var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                  user: 'aymeric.mortemousque@gmail.com', // Your email id
                  pass: 'jhLiexc7' // Your password
              }
          });

          var mailOptions = {
              from: 'aymeric.mortemousque@gmail.com', // sender address
              to: user.mail, // list of receivers
              subject: 'Email Example', // Subject line
              text: 'Hello world from \n\n' //, // plaintext body
              // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
          };

          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  console.log(error);
              }else{
                  console.log('Message sent: ' + info.response);
              };
          });

        });

      });
}


router.get('/sendMail/:id', (req, res) => {
    console.log('The user token: ', req.params.id);

    connection.query("SELECT * FROM user WHERE roleId=2 and id='"+req.params.id+"'", function(err, rows, fields) {
      if (err) throw err;
      console.log('The user is: ', rows);
      var user = rows[0];
      send(user);
      res.json({message: "mails send"});
    });
});

router.get('/sendMails/', (req, res) => {
    console.log('The user token: ', req.params.id);

    connection.query("SELECT * FROM user WHERE roleId=2 AND hasValidList=0", function(err, rows, fields) {
      if (err) throw err;
      console.log('The user is: ', rows);
      var users = rows;

      users.forEach(function(user){
        send(user);
      });
      res.json({message: "mails send"});
    });
});


router.put('/validateList/:token', (req, res) => {
    console.log('toto: ', req.body);

    connection.query("SELECT * from user where token='"+req.params.token+"'", function(err, rows, fields) {
      var user = rows[0];

      var collaboraters = req.body;
      if(collaboraters.length > 0) {
        connection.query("DELETE FROM collaborater WHERE userId='"+user.id+"'", function(err, rows, fields) {
              if (err) throw err;
                console.log('The user is: ', user);

              collaboraters.forEach(function(collaborater) {
                collaborater.birthDate = collaborater.birthDate.toLocaleString();
                if(collaboraters.firstName != "" && collaboraters.LastName != "" && collaboraters.BirthDate != "" && collaboraters.job != "" ) {
                  let birthDate = dateformat(collaborater.birthDate, "yyyy-mm-dd h:MM:ss");
                  connection.query("INSERT INTO collaborater (gender, firstName, lastName, birthDate, title, email, phone, userId) VALUES ('"+collaborater.gender+"', '"+collaborater.firstName+"', '"+collaborater.lastName+"', '"+ birthDate +"', '"+collaborater.title+"', '"+collaborater.email+"' , '"+collaborater.phone+"', '"+user.id+"')", function(err, rows, fields) {
                        if (err) throw err;
                    });
                }
              }, this);

              var dateNow = dateformat(new Date(), "yyyy-mm-dd h:MM:ss");
              connection.query("UPDATE user set hasValidList = 1, listValidationDate='"+ dateNow +"' WHERE id='"+user.id+"'", function(err, rows, fields) {
                if (err) throw err;
              });
              res.json({ message: 'Collaboraters created!' });

        });

      } else {
          res.json({ message: 'No action!' });
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
