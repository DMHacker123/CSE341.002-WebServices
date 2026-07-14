const API_URL = "http://localhost:3000";


// Load books from API

async function loadBooks() {

    const booksDiv = document.getElementById("books");


    try {

        const response =
            await fetch(`${API_URL}/books`);


        if (!response.ok) {

            throw new Error(
                "Unable to load books"
            );

        }


        const books =
            await response.json();


        booksDiv.innerHTML = "";


        if (books.length === 0) {

            booksDiv.innerHTML =
                "<p>No books available</p>";

            return;

        }


        books.forEach(book => {


            const div =
                document.createElement("div");


            div.className = "book";


            div.innerHTML = `

                <h2>${book.title}</h2>

                <p>
                <strong>ISBN:</strong>
                ${book.isbn}
                </p>

                <p>
                <strong>Author:</strong>
                ${book.author}
                </p>

                <p>
                <strong>Publisher:</strong>
                ${book.publisher || "N/A"}
                </p>

                <p>
                <strong>Pages:</strong>
                ${book.numOfPages || "N/A"}
                </p>


                <button onclick="deleteBook('${book.isbn}')">
                    Delete
                </button>

            `;


            booksDiv.appendChild(div);


        });


    } catch(error) {


        booksDiv.innerHTML = `

            <p>
            Error loading books:
            ${error.message}
            </p>

        `;


    }

}



// Delete book

async function deleteBook(isbn) {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmDelete) {

        return;

    }


    try {


        const response =
            await fetch(
                `${API_URL}/book/${isbn}`,
                {
                    method:"DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );

        }


        loadBooks();


    } catch(error) {


        alert(error.message);

    }


}



// Start

loadBooks();