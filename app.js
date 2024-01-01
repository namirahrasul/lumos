const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const deckRoutes = require('./routes/deckRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const deckController = require('./controllers/deckController');
const browseController = require('./controllers/browseController');
const { requireAuth,checkUser } = require('./middleware/authMiddleware');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(authRoutes);
app.use('/deck',deckRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI =process.env.DB_URI ;
mongoose.connect(dbURI)
 .then((result) => app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`)))
 .catch((err) => console.log(err));

app.get('*', checkUser);

app.get('/', (req, res) => res.render('home', { user: res.locals.user, admin: res.locals.admin }));
app.get('/browse-decks',requireAuth, browseController.alldecks_get);

app.get('/my-decks', requireAuth, deckController.mydecks_get);

app.get('/progress-tracker', requireAuth, async (req, res) => {
 res.render('calendar', { user: res.locals.user, admin: res.locals.admin });
})

app.get('/new-deck', requireAuth, deckController.newdeck_get);
app.get('/categories', requireAuth, deckController.categories_get);
app.post('/categories', deckController.categories_post);
app.get('/tags', requireAuth, deckController.tags_get);
app.post('/tags', deckController.tags_post);
