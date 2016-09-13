//import modules
var express = require('express');
var path = require('path');
var app=express();
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
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
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//set routes
app.get('/posts',function(req,res){
  Post.find({}).sort('-createdAt').exec(function(err,posts){
      if(err) return res.json({success:false,message:err});
      //res.json({success:true,data:posts});
      res.render("posts/index", {data:posts});
  });
});//index
app.get("/posts/new",function(req,res){
  res.render("posts/new");
});//new
app.post('/posts',function(req,res){
  Post.create(req.body.post,function(err,post){
    if(err)return res.json({sucess:false,message:err});
    //res.json({sucess:true,data:post});
    res.redirect('/posts');
  });
});//create
app.get('/posts/:id',function(req,res){
  Post.findById(req.params.id,function(err,post){
    if(err)return res.json({sucess:false,message:err});
    //res.json({sucess:true,data:post});
    res.render("posts/show",{data:post});
  });
}); //show

app.get('/posts/:id/edit',function(req,res){
  Post.findById(req.params.id,function(err,post){
    if(err)return res.json({sucess:false,message:err});
    //res.json({sucess:true,data:post});
    res.render("posts/edit",{data:post});
  });
}); //edit

app.put('/posts/:id',function(req,res){
  req.body.post.updatedAt=Date.now();
  Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,post){
    if(err)return res.json({sucess:false,message:err});
    //res.json({sucess:true,message:post._id+" updated"});
    res.redirect('/posts/'+req.params.id);
  });
}); //update

app.delete('/posts/:id',function(req,res){
  Post.findByIdAndRemove(req.params.id,function(err,post){
    if(err)return res.json({success:false,message:err});
  //  res.json({sucess:true,message:post._id+" deleted"});
  res.redirect('/posts');
  });
}); //destray

//start server
app.listen(3000,function(){
  console.log('server on!!');
});
