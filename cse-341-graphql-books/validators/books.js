const validateAuthor = ({ name, age }) => {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }

  if (age !== undefined && age !== null) {
    if (typeof age !== 'number' || age < 0 || age > 130) {
      errors.push('age must be a number between 0 and 130');
    }
  }

  return errors;
};

const validateBook = ({ name, genre, pages, authorId }) => {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }

  if (!genre || typeof genre !== 'string' || genre.trim().length === 0) {
    errors.push('genre is required and must be a non-empty string');
  }

  if (pages !== undefined && pages !== null) {
    if (typeof pages !== 'number' || pages <= 0) {
      errors.push('pages must be a positive number');
    }
  }

  if (!authorId) {
    errors.push('authorId is required');
  } else if (!/^[a-f\d]{24}$/i.test(authorId)) {
    errors.push('authorId must be a valid MongoDB ObjectId');
  }

  return errors;
};

module.exports = { validateAuthor, validateBook };
