'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex');
const humps = require('humps');
const boom = require('boom')

const authorize = function(req, res, next) {
    if (!req.session.userInfo) {
        throw boom.create(401, 'Unauthorized');
    }
    next();
}

router.get('/', authorize, (req, res, next) => {
    knex('favorites')
        .innerJoin('books', 'books.id', 'favorites.book_id')
        .where('user_id', req.session.userInfo.id)
        .then((book) => {
            res.send(humps.camelizeKeys(book))
        })
});

router.get('/check', authorize, (req, res, next) => {
  const bookId = Number.parseInt(req.query.bookId);
    knex('books')
        .innerJoin('favorites', 'books.id', 'favorites.book_id')
        .where('books.id', bookId)
        .then((books) => {
            if (books.length === 0) {
              return res.send(false)
            }
            res.send(true)
        })
})

router.post('/', authorize, (req, res, next) => {
  knex('favorites')
    .insert({
      book_id: req.body.bookId,
      user_id: req.session.userInfo.id
    }, '*')
    .then((books) => {
        res.send(humps.camelizeKeys(books[0]))
    })
})

router.delete('/', authorize, (req, res, next) => {
  knex('favorites')
    .del()
    .where('book_id', req.body.bookId)
    .first()
    .then((book) => {
      delete book.id
      res.send(humps.camelizeKeys(book))
    })
})

module.exports = router;
