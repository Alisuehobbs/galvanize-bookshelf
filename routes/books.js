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
    coverUrl: req.body.coverUrl,
  }

  knex('books')
    .insert(humps.decamelizeKeys(newBook), '*')
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]))
  })
})

router.patch('/:id', (req, res, next) => {
  const updateBook = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    coverUrl: req.body.coverUrl
  }

  knex('books')
    .where('books.id', req.params.id)
    .update(humps.decamelizeKeys(updateBook))
    .then((book) => {
      knex('books')
        .where('books.id', req.params.id)
        .first()
        .then((book) => {
        const returnUpdatedBook = {
          id: book['id'],
          title: book['title'],
          author: book['author'],
          genre: book['genre'],
          description: book['description'],
          cover_url: book['cover_url']
        }
        res.json(humps.camelizeKeys(returnUpdatedBook))
    })
  })
})

router.delete('/:id', (req, res, next) => {
    knex('books')
        .where('books.id', req.params.id)
        .del()

    knex('books')
        .where('books.id', req.params.id)
        .first()
        .then((book) => {
            const returnObj = {
                title: book['title'],
                author: book['author'],
                genre: book['genre'],
                description: book['description'],
                cover_url: book['cover_url']
            }
            res.json(humps.camelizeKeys(returnObj))
        })
})

module.exports = router;
