const form =
document.getElementById("bookForm");


form.addEventListener(
"submit",
async(event)=>{


event.preventDefault();


const data = {

isbn:
document.getElementById("isbn").value,

title:
document.getElementById("title").value,

author:
document.getElementById("author").value,

publisher:
document.getElementById("publisher").value,

numOfPages:
Number(
document.getElementById("numOfPages").value
)

};


const response =
await fetch(
"http://localhost:3000/book",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

});


const result =
await response.json();


alert(result.message);


if(response.ok){

form.reset();

}


});