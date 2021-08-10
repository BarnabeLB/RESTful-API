//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
  },
  content: {
    type: String,
    required: [true, "Please enter a content"],
  },
});

const Article = mongoose.model("article", articleSchema);
/////////////////////////////////////////////////////////////////REQUESTS TARGETTING ALL ARTICLES////////////////////////////////////////////////
app
  .route("/articles")

  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added to collection !");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });
//////////////////////////////////////////////////////////////////REQUESTS TARGETTING SPECIFIC ARTICLE////////////////////////////:

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (!err) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      // { overwrite: true },                                //La méthode .updateOne() n'overwrite pas à la différence de celle deprecated .update()
      function (err) {
        if (!err) {
          res.send("Successfully updated article");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      {title : req.params.articleTitle},
      {$set: req.body},                                     // body-parser permet de ne récupérer avec le $ que les champs qui ont été remplis
      function(err) {
        if(!err) {
          res.send("Successfully patched article");
        } else {
          res.send(err);
        }
      }
    );
  })


  .delete(function(req, res) {
    Article.deleteOne(
      {title : req.params.articleTitle},
      function(err) {
        if(!err) {
          res.send("Successfully deleted article");
        } else {
          res.send(err);
        }
      } 
    );
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
