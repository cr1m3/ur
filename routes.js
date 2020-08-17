const routes = require('express').Router();
const { formValidate } = require('./modules/validator');
const checkSession = require('./modules/middleware');
const { registerController, loginController } = require('./controllers/index');
const createClient = require('./modules/twitter-client');
const session = require('express-session');
const menfess = require('./models/menfess');

routes.get('/', (req, res) => {
  res.render('index');
});

routes.get('/login', loginController.getLogin);

routes.post('/login', formValidate.login, loginController.postLogin);

routes.get('/register', registerController.getRegister);

routes.post(
  '/register',
  formValidate.register,
  registerController.postRegister
);

routes.get('/sessions/callback', registerController.createMenfess);

routes.get('/logout', (req, res) => {
  // @ts-ignore
  req.session.destroy();
  console.log('Logout Success');
  // req.flash('messageSuccess', 'Logout Success');
  res.redirect('/');
});

routes.get('/home', checkSession, (req, res) => {
  let sessionData = req.session;

  //create object twitterClient
  let twitterClient = createClient(
    sessionData.consumerKey,
    sessionData.consumerSecret,
    sessionData.accessToken,
    sessionData.accessSecret
  );

  twitterClient.get(
    'account/verify_credentials',
    {
      skip_status: true,
    },
    (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        // @ts-ignore
        let img_url = data.profile_image_url.replace('_normal', '');
        res.render('home', { data, img_url });
      }
    }
  );
});

module.exports = routes;
