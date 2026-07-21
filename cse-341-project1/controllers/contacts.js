const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('contacts').find();
    const contacts = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
};

const getSingle = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('contacts')
      .find({ _id: contactId });
    const contacts = await result.toArray();

    if (contacts.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching contact' });
  }
};

const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        message:
          'firstName, lastName, email, favoriteColor, and birthday are all required'
      });
    }

    const contact = { firstName, lastName, email, favoriteColor, birthday };

    const result = await mongodb
      .getDb()
      .db()
      .collection('contacts')
      .insertOne(contact);

    if (result.acknowledged) {
      res.status(201).json({ _id: result.insertedId, ...contact });
    } else {
      res.status(500).json({ message: 'Error creating contact' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating contact' });
  }
};

const updateContact = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        message:
          'firstName, lastName, email, favoriteColor, and birthday are all required'
      });
    }

    const contact = { firstName, lastName, email, favoriteColor, birthday };

    const result = await mongodb
      .getDb()
      .db()
      .collection('contacts')
      .replaceOne({ _id: contactId }, contact);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ _id: contactId, ...contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating contact' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDb()
      .db()
      .collection('contacts')
      .deleteOne({ _id: contactId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting contact' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};