const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const wordAPIrouter = require('./routes/wordAPI');
const cors = require('cors');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const createError = require('http-errors');

//const fastify = require('fastify')({logger: true});
//const routes = require('./routes');
const {parsed : {MONGO_ATLAS_PW}} = require('dotenv').config();

app.set('view engine', 'html');

const dbPath = `mongodb+srv://admin:${MONGO_ATLAS_PW}@buildercluster.tafza.mongodb.net/builder?retryWrites=true&w=majority`;
mongoose.connect(dbPath, { useFindAndModify: false, useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.log('MongoDB could not be connected due to ', e));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use('/wordAPI', wordAPIrouter);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(`error`);
});

app.listen(process.env.PORT || 5000, () => {
  console.log('server listening');
});

module.exports = app;

/*
fastify.get('/', async (request, reply) => {
  try {
    reply.send({ message: 'hello, world!'})
  }
  catch (e) { console.log(e) }
});


routes.forEach(route => fastify.route(route))

fastify.listen(process.env.PORT || 3001, '0.0.0.0', (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`server running at ${fastify.server.address().port}`)
})
*/