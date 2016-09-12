//import modules
var express = require('express');
var path = require('path');
var app=express();
var mongoose=require('mongoose');
var bodyParser = require('body-parser');

//connect database
//mongoose.connect("mongodb://test:testtest@ds019836.mlab.com:19836/sylee0201");
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open",function(){
    console.log("db connected!");
});
db.on("error",function(err){
  console.log("DB ERROR :",err);
});

//model setting
var postSchema = mongoose.Schema({
  title:{type:String, require:true},
  body:{type:String, require:true},
  createdAt:{type:Date,default:Date.now},
  updatedAt:Date
});
var Post = mongoose.model('post',postSchema);

//view setting
app.set("view engine",'ejs');

//set middlewares
//app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());


//set routes
app.get('/posts',function(req,res){
  Post.find({},function(err,posts){
      if(err)return res.json({success:false,message:err});
      res.json({success:true,data:posts});
  });
});//index
app.post('/posts',function(req,res){
  Post.create(req.body.post,function(err,post){
    if(err)return res.json({sucess:false,message:err});
    res.json({sucess:true,data:post});
  });
});//create

app.get('/posts/:id',function(req,res){
  Post.findById(req.params.id,function(err,post){
    if(err)return res.json({sucess:false,message:err});
    res.json({sucess:true,data:post});
  });
}); //show

app.put('/posts/:id',function(req,res){
  req.body.post.updatedAt=Date.now();
  Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,post){
    if(err)return res.json({sucess:false,message:err});
    res.json({sucess:true,message:post._id+" updated"});
  });
}); //update

app.delete('/posts/:id',function(req,res){
  Post.findByIdAndRemove(req.params.id,function(err,post){
    if(err)return res.json({success:false,message:err});
    res.json({sucess:true,message:post._id+" deleted"});
  });
}); //destray

//start server
app.listen(3000,function(){
  console.log('server on!!');
});
