var express = require('express');
var bodyParser = require('body-parser');
var cfenv = require("cfenv");
var path = require('path');
var cors = require('cors');

//Setup Cloudant Service.
var appEnv = cfenv.getAppEnv();
console.log("What is appEnv:", appEnv);

cloudantService = appEnv.getService("myMicroservicesCloudant");
console.log("cloudantService::", appEnv.getService("myMicroservicesCloudant"));

var items = require('./routes/items');

//Setup middleware.
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'www')));

//REST HTTP Methods
app.get('/db/:option', items.dbOptions);
app.get('/items', items.list);
app.get('/fib', items.fib);
app.get('/loadTest', items.loadTest);
app.get('/items/:id', items.find);
app.post('/items', items.create);
app.put('/items/:id', items.update);
app.delete('/items/:id', items.remove);

console.log("appEnv.bind:", appEnv.bind);
console.log("appEnv.port:", appEnv.port);

console.log("Process Env Variables:", process.env);

var processPort = process.env.PORT || appEnv.port;

if (appEnv.isLocal){
   //if the app is running on Azure as a Web App, the PWD is going to be PWD: '/home/site/wwwroot',
   if (process.env.PWD === '/home/site/wwwroot'){
     console.log('Running on Azure as a Web App...');
   }
   else{
     console.log('Running locally possibly on a desktop/laptop.. (not on CF or Azure Web App)');
   }
  
}
else{
    app.listen(appEnv.port, appEnv.bind);
    
}

app.listen(processPort);
console.log('App started on ' + ':' + appEnv.port);