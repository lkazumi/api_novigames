const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const rotaUser = require('./routes/user');
const rotaGame = require('./routes/game');
const rotaNews = require('./routes/news');
const rotaFavorites = require('./routes/favorites');
const { restart } = require('nodemon');

app.use(morgan('dev')); //GERA LOG NO TERMINAL
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if( req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    app.use(cors());
    next();
});

app.use('/user', rotaUser);
app.use('/game', rotaGame);
app.use('/news', rotaNews);
app.use('/favorites', rotaFavorites);

//CASO NAO TENHA A ROTA INFORMADA
app.use((req, res, next) => {
    const erro = new Error('Nao encontrado!');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;