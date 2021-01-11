const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const MONGODB_URI = 'mongodb+srv://ahmed_nasr97:ahmedfci20150043@cluster0.8ltxu.mongodb.net/hr_employee'


const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
// const shopRoutes = require('./routes/shop');
// const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// app.use((req, res, next) => {
//   User.findById("5fd4c6f0d544e6305cd15237")
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
    
// });
app.use(flash());
app.use('/admin', adminRoutes);
app.use(authRoutes);
// app.use(shopRoutes);
// app.use(authRoutes);

// app.use(errorController.get404);



mongoose.connect(MONGODB_URI)
.then(result => {
//   User.findOne()
//   .then(user => {
//     if(!user){
//       const user = new User({
//         name: 'Ahmed',
//         email: 'ahmed@nasr.com',
//         cart:{
//           items: []
//         }
//       });
//       user.save();
//     }
//   })  
  app.listen(5000);
})
.catch(err => {
  console.log(err);
});