const express = require('express');
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

//CADASTRO
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err) {return res.status(500).send({ error: error }) }
        conn.query(`SELECT * FROM novigames.user WHERE email_user = ?`,
        [req.body.email_user],
        (error, result) => {
            if(error) {return res.status(500).send({ error: error }) }
            if(result.length > 0) {
                res.status(409).send({ menasgem: 'Usuario ja cadastrado' })
            }else {
                bcrypt.hash(req.body.password_user, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(`INSERT INTO user (name_user, email_user, password_user, escritor_user, picture_user) VALUES(?, ?, ?, ?, ?);`
                    , [req.body.name_user, req.body.email_user, hash, req.body.escritor_user, req.body.picture_user],
                    (error, results) => {
                        conn.release();
                        if (error) {return res.status(500).send({error: error }) }
                        response = {
                            mensagem: 'Usuário criado com sucesso',
                            usuarioCriado: {
                                id_user: results.insertId
                            }
                        }
                        return res.status(201).send(response);
                    });
                });
            }
        })       
    });
});

//LOGIN
router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {  return res.status(500).send({ error: error }) }
        const query = `SELECT * FROM novigames.user WHERE email_user = ?`;
        conn.query(query, [req.body.email_user],(error, results, fields) => {
            conn.release();
            if (error) {  return res.status(500).send({ error: error }) }
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação!' })
            }
            bcrypt.compare(req.body.password_user, results[0].password_user, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação!' })
                }
                if (result) {
                    const token = jwt.sign({
                        id_user: results[0].id_user,
                        name_user: results[0].name_user
                    }, 
                        process.env.JWT_KEY
                    )
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso!',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação!' })
            });
        });
    });
});

module.exports = router;