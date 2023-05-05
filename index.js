//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected at ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const postSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String,
  },
});

const Post = mongoose.model("Post", postSchema);

function toKebabCase(str) {
  return str
    .toLowerCase() // eg: adam azuddin
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => "-" + chr) // replace anything thats not letter or numbers to hypen '-'. eg: adam-azuddin
    .trim(); // remove any white spaces
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  const posts = Post.find({}).exec();
  posts
    .then((posts) => {
      res.render("home", {
        content: homeStartingContent,
        posts: posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", function (req, res) {
  res.render("about", {
    content: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    content: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:title",async function (req, res) {
  console.log(req.params.title);
  
  const postID = req.params.title;
  const posts = await Post.find({ _id: postID }).exec();
  
  
  console.log(posts);
  const title = posts[0].title
  const content = posts[0].content
  console.log(posts[0].title);
  console.log(posts[0].content);
  
  res.render("post", { title: title, content: content });
  /* posts
    .then((post) => {
      const title = req.body.title;

      console.log(title);

      const content = post.content;

      console.log(content);
    })
    .catch((err) => {
      console.log(err);
    }); */
});

app.post("/compose", function (req, res) {
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  newPost.save();
  res.redirect("/");
});

connectDB().then(() => {
  app.listen(PORT, function () {
    console.log("Server started at port " + PORT);
  });
});
