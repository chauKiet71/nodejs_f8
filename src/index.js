const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const route = require('./routes');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public'))); //public file image in file public
//HTTP logger
app.use(morgan('combined'));

//Template engine
app.engine(
        'hbs',
      engine({
        extname: '.hbs',
    }),
);
app.set('view engine', "hbs");
app.set('views', path.join(__dirname, 'resources/views'));

route(app);

app.listen(port, () => console.log(`Example app lisnten port ${port}`)); 
