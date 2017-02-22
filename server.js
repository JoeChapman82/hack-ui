/*jshint esversion: 6 */

const express = require('express');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3000;
const nunjucks = require('nunjucks');
const expressNunjucks = require('express-nunjucks');
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
var tempData;
var tempMessage;
app.use(helmet());
app.use(express.static(__dirname + '/app/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/app/public');
app.set('view engine', 'njk');

var njk = expressNunjucks(app, {
    watch: true,
    noCache: false
});

var getData = function(req, res, next) {
return new Promise(function(resolve, reject) {
  request({
    method: 'POST',
    url: 'http://192.168.1.177:5000/pds/status',
    json: true,
    body: {"nhsNumbers": [req.body.nhs[0], req.body.nhs[1], req.body.nhs[2], req.body.nhs[3], req.body.nhs[4]]}
  },function(error, response, body) {
    if (error) {
      reject(error);
    } else {
      resolve(response.body);
      // console.log(response.body);
      // console.log(response.statusCode);
    }
  });
}).then(function(response) {
  console.log(response);
  res.locals.data = response;
  next();
});
};

var sendData = function(req, res, next) {
return new Promise(function(resolve, reject) {
  request({
    method: 'POST',
    url: 'http://192.168.1.177:5000/pds/status/export',
    json: true,
    body: {"nhsNumbers": [req.body.nhs[0], req.body.nhs[1], req.body.nhs[2], req.body.nhs[3], req.body.nhs[4]]}
  },function(error, response, body) {
    if (error) {
      reject(error);
    } else {
      resolve(response.body);
      // console.log(response.body);
      // console.log(response.statusCode);
    }
  });
}).then(function(response) {
  tempData = response;
  next();
});
};

var saveFile = function(req, res, next) {
  (function() {
  fs.writeFile(`${__dirname}/app/data/returned.csv`, tempData, function() {
  tempMessage = 'Success';
  next();
});
}());
};

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/pages/patient-list', function(req, res) {
  res.render('pages/patient-list');
});

app.post('/pages/patient-list',[getData, function(req, res) {
  res.render('pages/status-report');
}]);

app.post('/pages/status-report',[sendData, saveFile, function(req, res) {
  res.locals.message = tempMessage;
  res.render('pages/exported');
}]);

app.post('/pages/exported', function(req, res) {
  res.render('index');
});

app.get('/pages/status-report', function(req, res) {
  res.render('pages/status-report');
});

app.listen(PORT, function() {
  console.log(`I'm listening: Port ${PORT}`);
});
