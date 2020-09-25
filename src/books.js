const fetch = require('node-fetch');

const fetchBook = function (id) {
  return new Promise((resolve, reject) => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${id}`)
      .then((res) => res.json())
      .then((bookData) => {
        const book = bookData.items[0];
        const author =
          book.volumeInfo.authors && book.volumeInfo.authors[0].toLowerCase();
        return {
          id: book.id,
          title: book.volumeInfo.title,
          author,
          publisher: book.volumeInfo.publisher,
          publishedDate: book.volumeInfo.publishedDate,
          description: book.volumeInfo.description,
          pageCount: book.volumeInfo.pageCount,
          Genre: book.volumeInfo.categories
            ? book.volumeInfo.categories[0]
            : 'Fiction',
          imageUrl:
            book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail,
        };
      })
      .then(resolve);
  });
};

module.exports = { fetchBook };
