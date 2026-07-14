// =====================
// Imports
// =====================
const express = require("express");
const cors = require("cors");
const Joi = require("joi");

const app = express();

const port = 3000;


// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML, CSS, and JS files
app.use(express.static(__dirname));

// =====================
// Temporary Book Database
// =====================

let books = [
    {
        isbn: "9780134685991",
        title: "Effective Java",
        author: "Joshua Bloch",
        publisher: "Addison-Wesley",
        numOfPages: 416
    }
];


// =====================
// Validation
// =====================

const bookSchema = Joi.object({

    isbn: Joi.string()
        .required(),

    title: Joi.string()
        .min(3)
        .required(),

    author: Joi.string()
        .min(3)
        .required(),

    publisher: Joi.string()
        .allow(""),

    numOfPages: Joi.number()
        .integer()
        .positive()

});


// =====================
// GET All Books
// =====================

app.get("/books", (req, res)=>{

    res.status(200).json(books);

});


// =====================
// GET Book by ISBN
// =====================

app.get("/book/:isbn", (req,res)=>{

    const book =
    books.find(
        b => b.isbn === req.params.isbn
    );


    if(!book){

        return res.status(404).json({

            message:"Book not found"

        });

    }


    res.status(200).json(book);

});


// =====================
// POST Create Book
// =====================

app.post("/book",(req,res)=>{


    const {error} =
    bookSchema.validate(req.body);


    if(error){

        return res.status(400).json({

            message:error.details[0].message

        });

    }


    const exists =
    books.find(
        b => b.isbn === req.body.isbn
    );


    if(exists){

        return res.status(409).json({

            message:"ISBN already exists"

        });

    }


    books.push(req.body);


    res.status(201).json({

        message:"Book created successfully",
        book:req.body

    });


});


// =====================
// DELETE Book
// =====================

app.delete("/book/:isbn",(req,res)=>{


    const index =
    books.findIndex(
        b => b.isbn === req.params.isbn
    );


    if(index === -1){

        return res.status(404).json({

            message:"Book not found"

        });

    }


    const deleted =
    books.splice(index,1);


    res.status(200).json({

        message:"Book deleted",
        book:deleted[0]

    });


});


// =====================
// 404 Handler
// =====================

app.use((req,res)=>{

    res.status(404).json({

        message:"Route not found"

    });

});


// =====================
// Start Server
// =====================

app.listen(port,()=>{

    console.log(
        `Server running on http://localhost:${port}`
    );

});
