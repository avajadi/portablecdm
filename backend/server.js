const express = require('express')
const app = express()

const RedirectURI = 'http://localhost:99/*';
const MaritimeAuthURI = `https://staging-maritimeid.maritimecloud.net/auth/realms/MaritimeCloud/protocol/openid-connect/auth?client_id=0.1-urn%3Amrn%3Astm%3Aservice%3Ainstance%3Aviktoria%3Asummer-app&redirect_uri=${RedirectURI}&response_mode=fragment&response_type=code&scope=openid`

var opn = require('opn');

//NOT ALLOWED, ONLY TEMPORARY
var response = null;

app.get('/auth', (req, res) => {
  console.log('Request from application, redirecting to Maritime...');
  
  opn(MaritimeAuthURI, {app: 'Chrome', wait: true}).then(() => {
      console.log('Redirecting to app...'); 
      res.sendFile('authing.html', {root: __dirname});
      
  });

  //res.sendFile('authing.html', {root: __dirname});
});

app.get('/redirect', (req, res) => {

});

app.get('/*', (req, res) => {

  if(!req.url.includes('auth')){
    console.log('Request to open app from ' + req.url);
    let qs = req._parsedUrl.query;
    if (true) {
      //res.redirect('exp://127.0.0.1:19000/+auth/?' + qs);
      //res.redirect('127.0.0.1:19000');
      this.response = res;
      //res.sendFile('authing.html', {root: __dirname});
    } else {
        //TODO: Add expo link here
      //res.redirect('pacdm://exp.host/@community/with-facebook-auth/+redirect/?' + qs);
    }
  }
});

app.listen(99, function() {console.log("Server up.")});

