const express = require('express');
const mysql = require('../mysql').pool;
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/game/');
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

//LISTAR GAMES
router.get('/', (req,res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT id_game, name_game, picture_game
            FROM novigames.game;`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    users: result.map(prod => {
                        return {
                            id_game: prod.id_game,
                            name_game: prod.name_game,
                            picture_game: prod.picture_game,
                            requrest: {
                                tipo: 'GET',
                                descricao: 'Ver detalhes do game',
                                url: 'http://localhost:8082/game/'+ prod.id_game
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
});

//LISTA GAME INFORMADO
router.get('/:id_game', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT id_game, name_game, picture_game
            FROM novigames.game WHERE id_game = ?;`,
            [req.params.id_game],
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }

                if(result.length == 0){
                    return res.status(404).send({
                        messagem: 'Não foi encontrado game com este ID!'
                    })
                }
                const response = {
                    quantidade: result.length,
                    users: result.map(prod => {
                        return {
                            id_game: result[0].id_game,
                            name_game: result[0].name_game,
                            picture_game: result[0].picture_game,
                            requrest: {
                                tipo: 'GET',
                                descricao: 'Listar todos os games',
                                url: 'http://localhost:8082/game/'
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
});

//ALTERA GAME
router.patch('/', (req,res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE novigames.game
                SET  name_game = ?
                    ,picture_game = ?
                WHERE id_game = ?;`,
            [req.body.name_game, req.body.picture_game, req.body.id_game],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Game alterado com sucesso!'
                });
            }
        )
    });
});

//INSERIR GAME
router.post('/', upload.single('picture_game'), (req, res, next) => {
    console.log(req.file)
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO novigames.game (name_game, picture_game) VALUES(?, ?);',
            [req.body.name_game, req.file.path],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(201).send({
                    mensagem: 'Game cadastrado com sucesso!'
                });
            }
        )
    });
});

//EXCLUIR GAME
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM novigames.game WHERE id_game = ?;`,
             [req.body.id_game],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Game excluido com sucesso!'
                });
            }
        )
    });
});

module.exports = router;