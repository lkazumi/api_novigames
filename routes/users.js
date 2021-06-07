const express = require('express');
const mysql = require('../mysql').pool;
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
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

//LISTAR USUARIOS
router.get('/', (req,res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT id_user, name_user, email_user, password_user, escritor_user,
             picture_user FROM novigames.user;`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    users: result.map(prod => {
                        return {
                            id_user: prod.id_user,
                            name_user: prod.name_user,
                            email_user: prod.email_user,
                            picture_user: prod.picture_user,
                            requrest: {
                                tipo: 'GET',
                                descricao: 'Ver detalhes do usuario',
                                url: 'http://localhost:8082/user/'+ prod.id_user
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
});

//LISTA USUARIO INFORMADO
router.get('/:id_user', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT id_user, name_user, email_user, password_user, escritor_user,
             picture_user FROM novigames.user where id_user = ?;`,
            [req.params.id_user],
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }

                if(result.length == 0){
                    return res.status(404).send({
                        messagem: 'Não foi encontrado usuario com este ID!'
                    })
                }
                const response = {
                    quantidade: result.length,
                    users: result.map(prod => {
                        return {
                            id_user: result[0].id_user,
                            name_user: result[0].name_user,
                            email_user: result[0].email_user,
                            password_user: result[0].password_user,
                            escritor_user: result[0].escritor_user,
                            picture_user: result[0].picture_user,
                            requrest: {
                                tipo: 'GET',
                                descricao: 'Listar todos os usuarios',
                                url: 'http://localhost:8082/user/'
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
});

//ALTERA USUARIO
router.patch('/', (req,res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE novigames.user
                SET name_user = ?
                    ,email_user = ?
                    ,password_user = ?
                    ,escritor_user = ?
                    ,picture_user = ?
                WHERE id_user = ?;`,
            [req.body.name_user, req.body.email_user, req.body.password_user, req.body.escritor_user, req.body.picture_user, req.body.id_user],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Usuário alterado com sucesso!'
                });
            }
        )
    });
});

//INSERIR USUARIO
router.post('/', upload.single('picture_user'), (req, res, next) => {
    console.log(req.file)
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO user (name_user, email_user, password_user, escritor_user, picture_user) VALUES(?, ?, ?, ?, ?);',
            [req.body.name_user, req.body.email_user, req.body.password_user, req.body.escritor_user, req.file.path],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(201).send({
                    mensagem: 'Usuário cadastrado com sucesso!'
                });
            }
        )
    });
});

//EXCLUIR USUARIO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM novigames.user WHERE id_user = ?;`, [req.body.id_user],
            (error, result, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Usuário excluido com sucesso!'
                });
            }
        )
    });
});

module.exports = router;