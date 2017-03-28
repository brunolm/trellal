import * as app from './app';

app.use('/api', require('./src/api'));

app.use('/login', (req, res) => {
  const virtualHost = process.env.VIRTUAL_HOST || 'localhost:3000';
  const returnUrl = `http://${virtualHost}`;
  const key = process.env.TRELLO_KEY;

  res.redirect(`https://trello.com/1/authorize?expiration=never&name=Trellal&scope=read&return_url=${returnUrl}&key=${key}`);
});

app.use((req, res) => {
  const model = {
    path: `${req.path}`.replace(/\/$/, ''),
  };
  res.render('index.cshtml', model);
});

const server = app.listen(+process.env.VIRTUAL_PORT || 3000, '0.0.0.0', function () {
  console.log();
  console.log(`Listening at 0.0.0.0:${server.address().port}`);
  console.log(`Virtual url http://${process.env.VIRTUAL_HOST || 'localhost'}`);
  console.log();
});
