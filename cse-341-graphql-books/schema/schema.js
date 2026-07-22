const { buildSchema } = require('graphql');
const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');
const { validateAuthor, validateBook } = require('../validators/books');

const schema = buildSchema(`
  type Book {
    id: ID!
    name: String!
    genre: String!
    pages: Int
    author: Author
  }

  type Author {
    id: ID!
    name: String!
    age: Int
    books: [Book]
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
    authors: [Author]
    author(id: ID!): Author
  }

  type Mutation {
    addAuthor(name: String!, age: Int): Author
    addBook(name: String!, genre: String!, pages: Int, authorId: ID!): Book
    deleteBook(id: ID!): String
    deleteAuthor(id: ID!): String
  }
`);

const formatAuthor = (doc) => ({
  id: doc._id.toString(),
  name: doc.name,
  age: doc.age,
  books: async () => {
    const bookDocs = await mongodb.getDb().db().collection('books').find({ authorId: doc._id }).toArray();
    return bookDocs.map(formatBook);
  }
});

function formatBook(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    genre: doc.genre,
    pages: doc.pages,
    author: async () => {
      if (!doc.authorId) return null;
      const authorDoc = await mongodb.getDb().db().collection('authors').findOne({ _id: doc.authorId });
      if (!authorDoc) return null;
      return formatAuthor(authorDoc);
    }
  };
}

const root = {
  books: async () => {
    const docs = await mongodb.getDb().db().collection('books').find().toArray();
    return docs.map(formatBook);
  },

book: async ({ id }) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid book ID');
    }

    const doc = await mongodb
      .getDb()
      .db()
      .collection('books')
      .findOne({ _id: new ObjectId(id) });

    if (!doc) {
      throw new Error('Book not found');
    }

    return formatBook(doc);
  } catch (error) {
    throw new Error(`Failed to retrieve book: ${error.message}`);
  }
},

  authors: async () => {
    const docs = await mongodb.getDb().db().collection('authors').find().toArray();
    return docs.map(formatAuthor);
  },

author: async ({ id }) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid author ID');
    }

    const doc = await mongodb
      .getDb()
      .db()
      .collection('authors')
      .findOne({ _id: new ObjectId(id) });

    if (!doc) {
      throw new Error('Author not found');
    }

    return formatAuthor(doc);
  } catch (error) {
    throw new Error(`Failed to retrieve author: ${error.message}`);
  }
},

  addAuthor: async (args) => {
    const errors = validateAuthor(args);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`);
    }
    const { name, age } = args;
    const result = await mongodb.getDb().db().collection('authors').insertOne({ name, age });
    return formatAuthor({ _id: result.insertedId, name, age });
  },

addBook: async (args) => {
  try {
    const errors = validateBook(args);

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    const { name, genre, pages, authorId } = args;

    if (!ObjectId.isValid(authorId)) {
      throw new Error('Invalid author ID');
    }

    const author = await mongodb
      .getDb()
      .db()
      .collection('authors')
      .findOne({ _id: new ObjectId(authorId) });

    if (!author) {
      throw new Error('Author does not exist');
    }

    const book = {
      name,
      genre,
      pages,
      authorId: new ObjectId(authorId)
    };

    const result = await mongodb
      .getDb()
      .db()
      .collection('books')
      .insertOne(book);

    return formatBook({
      _id: result.insertedId,
      ...book
    });
  } catch (error) {
    throw new Error(`Failed to add book: ${error.message}`);
  }
},

deleteBook: async ({ id }) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid book ID');
    }

    const result = await mongodb
      .getDb()
      .db()
      .collection('books')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new Error('Book not found');
    }

    return `Book ${id} deleted successfully`;
  } catch (error) {
    throw new Error(`Failed to delete book: ${error.message}`);
  }
},

deleteAuthor: async ({ id }) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid author ID');
    }

    const result = await mongodb
      .getDb()
      .db()
      .collection('authors')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new Error('Author not found');
    }

    return `Author ${id} deleted successfully`;
  } catch (error) {
    throw new Error(`Failed to delete author: ${error.message}`);
  }
},
};
module.exports = { schema, root };
