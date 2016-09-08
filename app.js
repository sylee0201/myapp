var express = require('express');
var path = require('path');
var app=express();
var mongoose=require('mongoose');


mongoose.connect("mongodb://test:testtest@ds019836.mlab.com:19836/sylee0201");
var db = mongoose.connection;

db.once("open",function(){
    console.log("db connected!");
});
db.on("error",function(err){
  console.log("DB ERROR :",err);
});

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});
var Data = mongoose.model('data',dataSchema);
Data.findOne({name:"myData"},function(err,data){
  if(err)return console.log("Data Eroor:",err);
  if(!data){
    Data.create({name:"myData",count:0},function(err,data){
      console.log("Counter initialized :",data);
    });
  }
});
/*app.get('/',function(req,res){
  res.send('hello world');
});


app.use(express.static(__dirname+'/public'));
*/

app.set("view engine",'ejs');
//app.use(express.static(path.join(__dirname,'public')));

//var data={count:0};
app.get('/',function(req,res){
  Data.findOne({name:"myData"},function(err,data){
    if(err)return console.log("Data Eroor:",err);
    data.count++;
    data.save(function(err){
        if(err)return console.log("Data Eroor:",err);
        res.render('my_first_ejs',data);
    });
  });
});

app.get('/reset',function(req,res){
  //data.count=0;
  //res.render('my_first_ejs',data);
  setCounter(res,0);
});

app.get('/set/count',function(req,res){
  //if(req.query.count)data.count=req.query.count;
  //res.render('my_first_ejs',data);
  if(req.query.count)setCounter(res,req.query.count);
  else getCounter(res);
});

app.get('/set/:num',function(req,res){
  //data.count=req.params.num;
  //res.render('my_first_ejs',data);
  if(req.params.num)setCounter(res,req.params.num);
  else getCounter(res);
});

function setCounter(res,num){
  console.log("setCounter");
  Data.findOne({name:"myData"},function(err,data) {
    if(err)return console.log("Data Error:",err);
    data.count = num;
    data.save(function(err){
      if(err)return console.log("Data Error:",err);
        res.render('my_first_ejs',data);
    });
  });
}

function getCounter(res){
  console.log("getCounter");
  Data.findOne({name:"myData"},function(err,data) {
    if(err)return console.log("Data Error:",err);
      res.render('my_first_ejs',data);
    });
}

app.listen(3000,function(){
  console.log('server on!!');
});
