const express = require('express');
// const mongoose = require('mongoose');
const app = express();
const routes = require('./routes/routes');

app.use(express.static('public'));
app.use(express.json());
app.use('/', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// mongoose.connect('your_db_connection_string', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3050, () => console.log('Server running on 3050'));
