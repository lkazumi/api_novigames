const express = require('express');
const mysql = require('../mysql').pool;
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/news/');
    },
    filename: function(req, file, cb){
        let data = new Date().toISOString().replace(/:/g,'-')+'-';
        cb(null, data + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === `image/jpg`){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//LISTAR NOVIDADES
router.get('/', (req,res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT id_news, upper(title_news), description_news, emission_news, id_game, id_user, picture_news
            FROM novigames.news;`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    users: result.map(prod => {
                        return {
                            id_news: prod.id_news,
                            title_news: prod.title_news,
                            description_news: prod.description_news,
                            emission_news: prod.emission_news,
                            id_game: prod.id_game,
                            id_user: prod.id_user,
                            picture_news: prod.picture_news,
                            requrest: {
                                tipo: 'GET',
                                descricao: 'Ver detalhes da noticia',
                                url: 'http://localhost:8082/news/'+ prod.id_news
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
});

//LISTA NOVIDADES INFORMADO
router.get('/:id_user', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT id_news, upper(title_news) as title_news, description_news, emission_news, id_game, id_user, picture_news
            FROM novigames.news where id_news = ?;`,
            [req.params.id_news],
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }

                if(result.length == 0){
                    return res.status(404).send({
                        messagem: 'Não foi encontrado noticia com este ID!'
                    })
                }
                const response = {
                    quantidade: result.length,
                    users: result.map(prod => {
                        return {
                            id_news: result[0].id_news,
                            title_news: result[0].title_news,
                            description_news: result[0].description_news,
                            emission_news: result[0].emission_news,
                            id_game: result[0].id_game,
                            id_user: result[0].id_user,
                            picture_news: result[0].picture_news,
                            requrest: {
                                tipo: 'GET',
                                descricao: 'Listar todos as noticias',
                                url: 'http://localhost:8082/news/'
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
});

//ALTERA NOVIDADES
router.patch('/', (req,res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE novigames.news
                SET title_news = ?
                    ,description_news = ?
                    ,id_game = ?
                    ,id_user = ?
                    ,picture_news = ?
                WHERE id_news = ?;
            `,
            [req.body.title_news, req.body.description_news, req.body.id_game, req.body.id_user, req.body.picture_news, req.body.id_news],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Noticia alterada com sucesso!'
                });
            }
        )
    });
});

//INSERIR NOVIDADES
router.post('/', upload.single('picture_news'), (req, res, next) => {
    console.log(req.file)
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO novigames.news (title_news, description_news, emission_news, id_game, id_user, picture_news) VALUES (?, ?, ?, ?, ?);',
            [req.body.title_news, req.body.description_news, req.body.emission_news, req.body.id_game, req.body.id_user, req.file.path],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(201).send({
                    mensagem: 'Noticia inserida com sucesso!'
                });
            }
        )
    });
});

//EXCLUIR NOVIDADES
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM novigames.news WHERE id_news = ?;`, 
            [req.body.id_user],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Noticia excluido com sucesso!'
                });
            }
        )
    });
});

module.exports = router;