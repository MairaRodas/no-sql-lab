const express = require('express');
const Author = require('../models/author');

const router = express.Router();

/**
 * GET authors listing.
 */
router.get('/', async (req, res) => {
  try {
    let filters = {};
    if (req.query.pais) filters = { pais: req.query.pais };
    const authors = await Author.find(filters);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Create a new Author
 */
router.post('/', async (req, res) => {
  try {
    let author = new Author(req.body);
    author = await author.save({ new: true });
    res.status(201).json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Consultar los nombres y los apellidos de los autores que tengan publicaciones superiores o iguales a 20 y su país sea Colombia.
 */
router.get('/sup20Colombia', async (req, res) => {
  try {
    let filters = {pais: "Colombia", publicados:{$gt:20}};
    let projections = {nombre:1, apellido:1, _id:0};
    const authors = await Author.find(filters, projections);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Consultar los nombres de los autores que no tengan apellido en la base de datos.
 */
router.get('/sinApellido', async (req, res) => {
  try {
    let filters = {apellido: null};
    let projections = {nombre:1, _id:0};
    const authors = await Author.find(filters, projections);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Consultar los apellidos de los autores que tengan menos de 20 publicaciones o que su país sea Argentina.
 */
router.get('/inf20orArgentina', async (req, res) => {
  try {
    let filters ={$or:[{publicados:{$lt:20}},{pais: "Argentina"}]};
    let projections = {apellido:1, _id:0};
    const authors = await Author.find(filters, projections);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
