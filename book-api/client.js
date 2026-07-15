const axios = require("axios");

const API_URL = "http://localhost:3000";

async function getBooks() {
    try {
        const response = await axios.get(`${API_URL}/books`);

        console.log("\n=== BOOKS ===");
        console.log(response.data);

    } catch (error) {
        console.error("GET Error:", error.message);
    }
}

async function createBook() {
    try {
        const response = await axios.post(
            `${API_URL}/book`,
            {
                isbn: "9781593275846",
                title: "Eloquent JavaScript",
                author: "Marijn Haverbeke",
                publisher: "No Starch Press",
                numOfPages: 472
            }
        );

        console.log("\n=== CREATE BOOK ===");
        console.log(response.data);

    } catch (error) {
        console.error(
            "POST Error:",
            error.response?.data || error.message
        );
    }
}

async function deleteBook() {
    try {
        const response = await axios.delete(
            `${API_URL}/book/9781593275846`
        );

        console.log("\n=== DELETE BOOK ===");
        console.log(response.data);

    } catch (error) {
        console.error(
            "DELETE Error:",
            error.response?.data || error.message
        );
    }
}

async function run() {

    await getBooks();

    await createBook();

    await getBooks();

    await deleteBook();

    await getBooks();

}

run();