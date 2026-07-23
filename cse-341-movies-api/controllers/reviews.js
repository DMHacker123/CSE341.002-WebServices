const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

const getAll = async (req, res) => {
  try {
    const reviews = await mongodb.getDb().db().collection('reviews').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const reviewId = new ObjectId(req.params.id);
    const review = await mongodb.getDb().db().collection('reviews').findOne({ _id: reviewId });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching review', error: err.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { movieId, reviewerName, rating, comment, reviewDate } = req.body;
    const review = { movieId: new ObjectId(movieId), reviewerName, rating, comment, reviewDate: new Date(reviewDate) };
    const result = await mongodb.getDb().db().collection('reviews').insertOne(review);
    if (result.acknowledged) {
      res.status(201).json({ _id: result.insertedId, ...review });
    } else {
      res.status(500).json({ message: 'Error creating review' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error creating review', error: err.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = new ObjectId(req.params.id);
    const { movieId, reviewerName, rating, comment, reviewDate } = req.body;
    const review = { movieId: new ObjectId(movieId), reviewerName, rating, comment, reviewDate: new Date(reviewDate) };
    const result = await mongodb.getDb().db().collection('reviews').replaceOne({ _id: reviewId }, review);
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ _id: reviewId, ...review });
  } catch (err) {
    res.status(500).json({ message: 'Error updating review', error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('reviews').deleteOne({ _id: reviewId });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
};

module.exports = { getAll, getSingle, createReview, updateReview, deleteReview };
