const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

const getAll = async (req, res) => {
  try {
    const movies = await mongodb.getDb().db().collection('movies').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movies', error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const movieId = new ObjectId(req.params.id);
    const movie = await mongodb.getDb().db().collection('movies').findOne({ _id: movieId });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching movie', error: err.message });
  }
};

const createMovie = async (req, res) => {
  try {
    const { title, director, releaseYear, genre, runtimeMinutes, rating, synopsis, posterUrl } = req.body;
    const movie = { title, director, releaseYear, genre, runtimeMinutes, rating, synopsis, posterUrl };
    const result = await mongodb.getDb().db().collection('movies').insertOne(movie);
    if (result.acknowledged) {
      res.status(201).json({ _id: result.insertedId, ...movie });
    } else {
      res.status(500).json({ message: 'Error creating movie' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error creating movie', error: err.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const movieId = new ObjectId(req.params.id);
    const { title, director, releaseYear, genre, runtimeMinutes, rating, synopsis, posterUrl } = req.body;
    const movie = { title, director, releaseYear, genre, runtimeMinutes, rating, synopsis, posterUrl };
    const result = await mongodb.getDb().db().collection('movies').replaceOne({ _id: movieId }, movie);
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json({ _id: movieId, ...movie });
  } catch (err) {
    res.status(500).json({ message: 'Error updating movie', error: err.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movieId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('movies').deleteOne({ _id: movieId });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting movie', error: err.message });
  }
};

module.exports = { getAll, getSingle, createMovie, updateMovie, deleteMovie };
