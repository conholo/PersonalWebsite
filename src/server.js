const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const secret = 'SECRET';
const app = express();
nunjucks.configure('src/views', { autoescape: true , express: app});

app.set('view engine', 'html');
app.set('port', 3001);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const main = require('./routes/main.route.js');
const projects = require('./routes/projects.route.js');


app.use('/', main);
app.use('/projects', projects);


app.use(function(req,res){
    res.status(404);
    res.render('404');
});


app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
