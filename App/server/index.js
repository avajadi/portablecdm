const app = require('express')();

app.get('/*', (req, res) => {

  console.log('Request!');

  let qs = req._parsedUrl.query;
  if (process.env.NODE_ENV === 'development') {
    res.redirect('exp://192.168.0.80:19000/+auth/?' + qs);
  } else {
      //TODO!
    //res.redirect('exp://exp.host/@community/with-facebook-auth/+redirect/?' + qs);
  }
});

// app.get('/', (req, res) => {
//   res.sendFile('facebook.html', {root: __dirname });
// });

app.listen(99);