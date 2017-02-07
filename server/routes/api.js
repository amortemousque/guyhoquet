const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dateformat = require('dateformat');
const Sequelize = require('sequelize');
const multer  = require('multer')
const csvtojson = require('csvtojson')
const json2csv = require('json2csv');
const fs = require('fs');

const router = express.Router();


var sequelize = new Sequelize('guyhoquet2', 'root', 'password',  {
  host: 'localhost',
  dialect: 'mysql'
});


var Agency = sequelize.define('agency', {
  id : {type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING,
  managers: Sequelize.STRING,
  hasValidList: Sequelize.BOOLEAN,
  listValidationDate: Sequelize.DATE,
  token: Sequelize.STRING,
  phone: Sequelize.STRING,
  mail: {
    type: Sequelize.STRING,
    isEmail: true,
    isDate: true
  },
  address: Sequelize.STRING,
  code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  postalCode: Sequelize.STRING,
  city: Sequelize.STRING,
  mailDate: Sequelize.STRING,
  openingDate: Sequelize.DATE,
  status: Sequelize.STRING,
  reference: Sequelize.STRING,
  contractNumber: Sequelize.INTEGER
},
{  freezeTableName: true,
});

var Collaborater = sequelize.define('collaborater', {
  id: {type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  birthDate: Sequelize.DATE,
  job: Sequelize.STRING,
  email: Sequelize.STRING,
  phone: Sequelize.STRING,
  gender: Sequelize.STRING,
  title: Sequelize.STRING
},
{  freezeTableName: true,
},
{

  instanceMethods: {
    birthDateFr: function() {
      if(this.birthDate != null || this.birthDate != "")
        return dateformat(this.birthDate, "dd/mm/yyyy h:MM:ss");
      else
      return "";
    }
  }
});

var Role = sequelize.define('role', {
  id : {type:Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING
},
{  freezeTableName: true,
});


Agency.belongsTo(Role);
Collaborater.belongsTo(Agency);


// Create the tables:
Role.sync();
Agency.sync();
Collaborater.sync();


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})



/* GET api listing. */
router.get('/', function(req, res) {
  res.send('api works');
});


router.get('/collaboraters/:token', function(req, res) {
    console.log('The agency token: ', req.params.token);

    Agency.findOne({ where: { token: req.params.token } })
    .then(function(agency){
      return Collaborater.findAll({ where: {
        agencyId: agency.id
      }});
    }).then(function(collaboraters){
      res.status(200).json(collaboraters);
    });

});

router.get('/agencies/:token', function(req, res) {
    console.log('The agency token: ', req.params.token);
    Agency.findOne({ where: { roleId:1, token: req.params.token } })
    .then(function(agency){
      return Agency.findAll({where:{roleId:2}});
    }).then(function(agencies){
      res.status(200).json(agencies);
    });
});

router.get('/agency/:token', function(req, res) {
    Agency.findOne({ where: { roleId:2, token: req.params.token} }).then(function() {
      if (err) throw err;
        var agency = {};
        if(rows.length > 0) {
         agency = rows[0];
        }
        res.status(200).json(agency);
    });
});


router.put('/validateList/:token', function(req, res) {
    console.log('toto: ', req.body);

    Agency.findOne({ where: { token: req.params.token } })
    .then(function(agency) {

      Collaborater.destroy({
        where: {
          agencyId: agency.id
        }
      }).then(function(){
        var collaboraters = req.body;
        collaboraters.forEach(function(collaborater) {
          collaborater.id = undefined;
          collaborater.agencyId = agency.id;
        });
        return Collaborater
          .bulkCreate(collaboraters);
      }).then(function(){
        var dateNow = dateformat(new Date(), "yyyy-mm-dd h:MM:ss");
        return Agency.update(
              { listValidationDate: dateNow, hasValidList: 1 },
              { where: { id: agency.id } }
          );
      }).then(function(){
          res.json({ message: 'Collaboraters created!' });
      }).catch(function(error) {
        console.log(error);
        // whooops
      });
    })
});


function send(agency) {
   require('crypto').randomBytes(48, function(err, buffer) {
        var token = buffer.toString('hex') + agency.id;
        console.log("token : "+token);
        var dateNow = dateformat(new Date(), "yyyy-mm-dd h:MM:ss");
        connection.query("UPDATE agency set token = '"+token+"', mailDate='"+dateNow+"' where id='"+user.id+"'", function(err, rows, fields) {

          // Not the movie transporter!
          var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                  agency: 'aymeric.mortemousque@gmail.com', // Your email id
                  pass: 'jhLiexc7' // Your password
              }
          });

          var mailOptions = {
              from: 'aymeric.mortemousque@gmail.com', // sender address
              to: agency.mail, // list of receivers
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


router.get('/sendMail/:id', function(req, res) {
    console.log('The agency token: ', req.params.id);

    connection.query("SELECT * FROM agency WHERE roleId=2 and id='"+req.params.id+"'", function(err, rows, fields) {
      if (err) throw err;
      console.log('The agency is: ', rows);
      var agency = rows[0];
      send(agency);
      res.json({message: "mails send"});
    });
});

router.get('/sendMails/', function(req, res) {
    console.log('The agency token: ', req.params.id);

    connection.query("SELECT * FROM agency WHERE roleId=2 AND hasValidList=0", function(err, rows, fields) {
      if (err) throw err;
      console.log('The agency is: ', rows);
      var agencies = rows;

      agencies.forEach(function(agency){
        send(agency);
      });
      res.json({message: "mails send"});
    });
});


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './server/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + ".csv");
  }
});

function parseFrDate(st) {
      if(st != "") {
        var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        var dt = new Date(st.replace(pattern,'$3-$2-$1'));
      } else {
        var dt = null;
      }
      return dt;
}


router.post('/uploadAgencies/', function(req, res) {
  var upload = multer({ storage : storage}).single('agenciesUpload');
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        var agencyToInsert = [];
        Agency.findAll()
        .then(function(agencies) {

          csvtojson({
              noheader: false,
              trim: true,
              delimiter: ";"
          })
          .fromFile("./server/uploads/"+res.req.file.filename)
          .on('json',function(jsonRow) {
              let agencyBdd = agencies.filter(function(agencyBdd) { return agencyBdd.code == jsonRow.code; });
              if(agencyBdd.length == 0) {
                jsonRow.openingDate = parseFrDate(jsonRow.openingDate );
                agencyToInsert.push(jsonRow);
              }

          })
          .on('done', function(error) {
              if(error == undefined) {
                Agency.bulkCreate(agencyToInsert, { validate: true })
                .then(function(){
                    res.json({success:true, message: "Import success"});
                })
                .catch(function(errors){
                    res.json({success:false, message: "Import error"});
                });
              } else {
                res.json({success:false, message: "Import error"});
              }
          });

        }).catch(function (err) {
            res.json({success:false, message: "Import error"});
        });
    });
});



router.post('/uploadCollaboraters/', function(req, res) {
    var upload = multer({ storage : storage}).single('collaboratersUpload');
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        var collaboratersToInsert = [];
        var agencyP = Agency.findAll();
        var collaboraterP = Collaborater.findAll();

        Promise.all([agencyP, collaboraterP])
        .then(function(values){
            var agencies = values[0];
            var collaboraters = values[1];
            csvtojson({
                noheader: false,
                trim: true,
                delimiter: ";"
            })
            .fromFile("./server/uploads/"+res.req.file.filename)
            .on('json',function(jsonRow) {
                let agencyBdd = agencies.filter(function(agencyBdd) { return agencyBdd.code == jsonRow.code; });
                let collaboraterBdd = collaboraters.filter(function(collaboraterBdd) { return collaboraterBdd.email == jsonRow.email; });

                if(agencyBdd.length > 0 && collaboraterBdd.length == 0) {
                  jsonRow.birthDate = parseFrDate(jsonRow.birthDate);
                  jsonRow.agencyId = agencyBdd[0].id;
                  collaboratersToInsert.push(jsonRow);
                }
            })
            .on('done', function(error) {
                if(error == undefined) {
                  Collaborater.bulkCreate(collaboratersToInsert, { validate: true })
                  .then(function(){
                      res.json({success:true, message: "Import success"});
                  })
                  .catch(function(errors){
                      res.json({success:false, message: "Import error"});
                  });
                } else {
                  res.json({success:false, message: "Import error"});
                }
            });

          }).catch(function (err) {
            res.json({success:false, message: "Import error"});
          });
    });
});



router.get('/downloadCollaboraters/:token', function(req, res) {
  Collaborater.findAll()
      .then(function(collaboraters){
          var fields = ['firstName', 'lastName', 'birthDate', 'email', 'phone', 'title'];
          collaboraters.forEach(function(element) {
            if(element.dataValues.birthDate != "")
              element.dataValues.birthDate = dateformat(element.dataValues.birthDate, "dd/mm/yyyy h:MM:ss");
          }, this);
          var csv = json2csv({ data: collaboraters, fields: fields, del: ';' });
          res.attachment('collaborateurs.csv');
          res.status(200).send(csv);
      });

});


module.exports = router;
