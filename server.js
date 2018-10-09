const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Article = require('./models/article');
const bodyParser = require('body-parser');

// Init server app
const server = express();

// Body Parser
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Set public folder
server.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/nodekb', { useNewUrlParser: true });
let db = mongoose.connection;

// Check connection
db.once('open', () => {
  console.log('Connected to MongoDB')
})

// Check for DB erors
db.on('error', (err) => {
  console.log(err);
});



// Load View Engine
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

// Home routes
server.get('/h(ome)?', (request, responce) => {
  Article.find({}, (err, articles) => {
    if(err) {
      console.log(err);
    } else {
      responce.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});

// Get Single Article
server.get('/article/:id', (request, responce) => {
  Article.findById(request.params.id, (error, article) => {
    if(error){
      console.log("Wrong id");
      responce.redirect('/h');
    } else {
      responce.render('article', {
        article: article
      });
    }
  })
});

// Add route
server.get('/articles/add', (request, responce) => {
  responce.render('add', {
    title: 'Add something'
  });
});

// Add submit POST route
server.post('/articles/add', (request, responce) => {
  let article = new Article();
  article.title = request.body.title;
  article.author = request.body.author;
  article.body = request.body.body;

  article.save((error) => {
    if(error){
      console.log(error);
      return;
    } else {
      console.log('Submitted');
      responce.redirect('/h');
    }
  })
});

// Start server
server.listen(8080, () => {
  console.log('server started on port 8080...');
});
