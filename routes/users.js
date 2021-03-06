'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex');
const humps = require('humps')

router.post('/', (req, res, next) => {

    const hashedPassword = bcrypt.hashSync(req.body.password, 8)

    const newUserObj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        hashedPassword: hashedPassword
    }

    knex('users')
        .returning('id')
        .insert(humps.decamelizeKeys(newUserObj), 'id')
        .then((users) => {
            const id = users[0]
            knex('users')
            .where('id', id)
            .first()
            .then((returnUserObject) => {
              delete returnUserObject.hashed_password;
              req.session.userInfo = returnUserObject;
              res.json(humps.camelizeKeys(returnUserObject))
              // res.redirect('/login')
            })
        })
});

module.exports = router;
