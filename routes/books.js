'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps')

router.get('/', (req, res, next) => {
    knex('books')
      .orderBy('title')
      .then(books => {
        res.send(humps.camelizeKeys(books))
      })
      .catch((err) => {
        next(err);
      });
})

router.get('/:id', (req, res, next) => {
    knex('books')
      .where('books.id', req.params.id)
      .first()
      .then((book) => {
        res.send(humps.camelizeKeys(book))
      })
      .catch((err) => {
        next(err);
      });
})

router.post('/', (req, res, next) => {
  const newBook = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.cover_url,
  }

  console.log(newBook);

  knex('books')
    .insert(newBook,'id', 'created_at', 'updated_at', '*')
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]))
      console.log(book);
    })

})

module.exports = router;
