// create express instance
const express = require("express");
// create bodyParser instance
const bodyParser = require("body-parser");
// createw ejs instance
const ejs = require("ejs");
// create mongoose object
const mongoose = require('mongoose');
// use express to start Server
const app = express();
// use ejs templating for easier web dev.
app.set('view engine', 'ejs');
// use body paarser to pass data through html headears and urlencoded forms
app.use(bodyParser.urlencoded({
  extended: true
}));
// create a folder for CSS and javascript files
app.use(express.static("public"));

// create mongoose connection to wiki DB if none found creates one.
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});
// create Nosql table schema for articles.
const articleSchema = {
  title: String,
  content: String
};
// make the schema into a mongoose model to insert them into database.
const Article = mongoose.model("Article", articleSchema);
// create a chained route that can be shared by get,post,and delete.
app.route("/articles")
.get(function(req, res) {
  // find all articles when its a GET request
  Article.find({}, function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
// post a new article using Postman with urlencoded form.
.post(function(req, res) {
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save(function(err) {
    if (!err) {
      res.send("Successfully added new article");
    } else {
      res.send(err);
    }
  });
})
// delete all articles when Delete request is needed.
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("The Articles where Deleted Successfully");
    } else {
      res.send(err);
    }
  });
});
//  create a chained route and use the title to find  header to find the article with said title.
app.route("/articles/:title")
// when GET Request is used then find the article with the title that is passed through ther header.
.get(function(req, res){
  const articleTitle = req.params.title;
  Article.find({title:articleTitle },function(err,foundTitle){
    if(foundTitle){
      res.send(foundTitle);
    }else{
      res.send("No artiles Found with that Title");
    }
  })
})
// when PUT request then find the title, and replace it with a entire new intance of article schema.
.put(function(req, res){
  const articleTitle = req.params.title;
  Article.replaceOne(
    {title:articleTitle},
    req.body,
    function(err){
      if(!err){
        res.send("Article Successfully updated.");
      }
      else{
        res.send(err);
      }
    }
  );
})
// when PATCH request find the article from the header and just update the article
// with out having to rewrite the entire article.
.patch(function(req,res){
  Article.updateOne(
    {title: req.params.title},
    req.body,
    function(err){
      if(!err){
        res.send("Article Successfully updated.");
      }
      else{
        res.send(err);
      }
    }
  );
})
// when DELETE request then delete the article title recieved from the header.
.delete(function(req, res){
  Article.deleteOne({title:req.params.title},function(err){
    if(!err){
      res.send("Successfully Deleted " + req.params.title);
    }
    else{
      res.send("Failed to delete.");
    }
  });
});





// start app at port 3000.
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
