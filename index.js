import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "Mydp#nayak09",
  port: 5432,
  database: "world",
});
let myarr = [];
db.connect();
db.query("SELECT* FROM country_flag", (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log("response from database is");
    myarr = res.rows;
  }
});


// let index = Math.floor(Math.random() * myarr.length);
let currentscore=0;
let index = 0;
app.get("/", (err, res) => {
  try {

     index = Math.floor(Math.random() * myarr.length);
    console.log(myarr[index])
    res.render("index.ejs", {
      question: myarr[index],
    })
  } catch (error) {
    console.log(error.message);
    res.sendStatus(404).json("ther is problem loading page");
  }
});

app.post("/submit", (req, res) => {
  try {
    const namer = req.body.answer;
    console.log(namer + "==" + myarr[index].name);

    if (namer.toLowerCase() ==  (myarr[index].name).toLowerCase() ){
      currentscore+=1;  
      index = Math.floor(Math.random() * myarr.length);
      res.render("index.ejs",{
              question: myarr[index],
              wasCorrect: true, 
              totalScore: currentscore,
         });
    }else{
      res.render("index.ejs",{
        question: myarr[index],
        wasCorrect: false,
        totalScore: currentscore,
   });
    }
  
  } catch (error) {
    console.log(error.message);
    res.sendStatus(404).json("ther is problem loading page");
  }
});

app.listen(port, () => {
  console.log(`website is running at http://localhost${port}`);
})