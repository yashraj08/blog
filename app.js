var express = require("express"),
    methodOverride = require("method-override"),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    sanitizer = require("express-sanitizer"),
    app = express();

mongoose.connect("mongodb+srv://YashRaj:Yash1998@blogapp.shvdu.mongodb.net/blogapp?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(sanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String,
    created: { type: Date, default: Date.now() }

});
var blog = mongoose.model("blog", blogSchema);
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    blog.find({}, function(err, blogs) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("index", { blogs: blogs });
        }

    });

});
app.get("/blogs/new", function(req, res) {
    res.render("new");
});
app.post("/blogs", function(req, res) {
    req.body.blog.content = req.sanitize(req.body.blog.content);
    blog.create(req.body.blog, function(err, newblog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    blog.findById(req.params.id, function(err, found) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("show", { blog: found });
        }
    });
});
app.get("/blogs/:id/edit", function(req, res) {
    blog.findById(req.params.id, function(err, found) {
        if (err) {
            res.redirect("/");
        } else {
            res.render("edit", { blog: found });
        }
    });

});
app.put("/blogs/:id", function(req, res) {
    req.body.blog.content = req.sanitize(req.body.blog.content);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, ublog) {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }

    });

});
app.delete("/blogs/:id", function(req, res) {
    blog.findByIdAndRemove(req.params.id, req.body.blog, function(err, ublog) {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/blogs");
        }
    });

});

app.listen(process.env.PORT, process.env.IP, function() {

    console.log("Server started");
});
//process.env.PORT, process.env.IP