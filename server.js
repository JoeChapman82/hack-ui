/*jshint esversion: 6 */

const express = require('express');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3000;
const nunjucks = require('nunjucks');
const expressNunjucks = require('express-nunjucks');
const bodyParser = require('body-parser');
const request = require('request');

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

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(PORT, function() {
  console.log(`I'm listening: Port ${PORT}`);
});
