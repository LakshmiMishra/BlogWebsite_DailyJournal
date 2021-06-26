const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const _ =require("lodash");
const mongoose=require("mongoose");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
//
let homeStartingPost= {
  _id:"1234",
  postTitle:"Home",
  postContent:homeStartingContent
};
 let homePost=[homeStartingPost];

mongoose.connect("mongodb://localhost:27017/BlogDB",{ useNewUrlParser: true , useUnifiedTopology: true });
console.log("connected");
const postSchema=new mongoose.Schema({
  postTitle:String,
  postContent:String
});

const Post =new mongoose.model("Post",postSchema);


app.get("/",function(req,res){
  Post.find({},function(err,foundPosts){
    if(!err){
      if(foundPosts.length===undefined || foundPosts.length===0){
       res.render("home",{"postList":homePost});
      }
      else{
    foundPosts.unshift(homeStartingPost);
        console.log(foundPosts);
          res.render("home",{"postList":foundPosts});

      }
    }
    else{
      console.log("error fiding posts")
    }
  });
});

app.get("/about",function(req,res){
  res.render("about",{"aboutpageContent":aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{"contactpageContent":contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/post/:postName",function(req,res){
  let requestedTitle=req.params.postName;
  const Id=req.body.post_id;
  console.log(requestedTitle)
  if(_.lowerCase(requestedTitle)==="home"){
    res.render("post",{"postTitle":homePost[0].postTitle,"postCont":homePost[0].postContent});

  }
  else{  Post.findOne({"_.id":Id},function(err,foundPost){
      if(!err){
        if(foundPost===undefined||foundPost===0){
          res.render("home",{"postList":homePost});
        }
        else{
          res.render("post",{"postTitle":foundPost.postTitle,"postCont":foundPost.postContent});

        }

    }

  });}

});

app.post("/compose",function(req,res){
  let title=req.body.postTitle;
  let content=req.body.postContent;
  const post= new Post({
    postTitle:title,
    postContent:content
  });

 post.save(function(err){
   if(!err)
    {
       res.redirect("/");
    }

  });

});

app.listen(process.env.PORT||3000,function(){
  console.log("server running");

});
