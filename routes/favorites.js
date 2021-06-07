const express = require('express');
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/favorites');
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

//LISTAR FAVORITOS
router.get('/', (req,res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT g.name_game as name_game, g.picture_game as picture_game
            FROM novigames.favorites f
            JOIN novigames.game g ON (g.id_game = f.id_game)
            JOIN novigames.user u ON (u.id_user = f.id_user);`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    users: result.map(prod => {
                        return {
                            name_game: prod.name_game,
                            picture_game: prod.picture_game,
                            requrest: {
                                tipo: 'GET',
                                descricao: 'Ver detalhes do game favoritado',
                                url: 'http://localhost:8082/favorites/'+ prod.id_favorites
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
});


//LISTA FAVORITOS INFORMADO
router.get('/:id_favorites', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT  f.id_favorites as id_favorites
                    ,f.id_user      as id_user
                    ,f.id_game      as id_game
                    ,g.name_game    as name_game
                    ,g.picture_game as picture_game
            FROM novigames.favorites f
            JOIN novigames.game g ON (g.id_game = f.id_game)
            JOIN novigames.user u ON (u.id_user = f.id_user)
            WHERE g.name_game like = '%?%';`,
            [req.params.name_game],
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }

                if(result.length == 0){
                    return res.status(404).send({
                        messagem: 'Não foi encontrado game com este nome!'
                    })
                }
                const response = {
                    quantidade: result.length,
                    users: result.map(prod => {
                        return {
                            id_favorites: result[0].id_favorites,
                            id_user: result[0].id_user,
                            id_game: result[0].id_game,
                            name_game: result[0].name_game,
                            picture_game: result[0].picture_game,
                            requrest: {
                                tipo: 'GET',
                                descricao: 'Listar todos os favoritos',
                                url: 'http://localhost:8082/favorites/'
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
});


//ALTERA FAVORITOS
router.patch('/', login.obrigatorio, (req,res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE novigames.favorites
                SET  id_user = ?
                    ,id_game = ?
                WHERE id_favorite = ?;`,
            [req.body.id_user, req.body.id_game, req.body.id_favorite],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Favoritos alterado com sucesso!'
                });
            }
        )
    });
});

//INSERIR FAVORITOS
router.post('/', login.obrigatorio, upload.single('picture_user'), (req, res, next) => {
    console.log(req.file)
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO novigames.favorites (id_user, id_game) VALUES(?, ?);',
            [req.body.id_user, req.body.id_game],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(201).send({
                    mensagem: 'Favorito cadastrado com sucesso!'
                });
            }
        )
    });
});

//EXCLUIR FAVORITOS
router.delete('/', login.obrigatorio, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM novigames.favorites WHERE id_favorite = ?;`, 
            [req.body.id_favorite],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Favorito excluido com sucesso!'
                });
            }
        )
    });
});

module.exports = router;