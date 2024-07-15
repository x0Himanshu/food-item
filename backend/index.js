import express from "express";
import pg from "pg";
import env from "dotenv";
import bodyParser from "body-parser"
import * as searchAPI from "./recipe-api.js";

env.config();

const db = new pg.Client({
    user: process.env.PG_UNAME,
    host: process.env.PG_HOST,
    database : "project-recipe",
    password : process.env.PG_PASS,
    port: process.env.PG_PORT
});
db.connect();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next();
  });


app.get("/api/recipes/search", async(req,res)=>
{
    const searchIem = req.query.searchItem;
    const num_page = parseInt(req.query.page);
    const data = await searchAPI.searchRec(searchIem,num_page);
    res.json(data);
});

app.get("/api/recipes/:id/summary", async(req,res)=>
  {
      const id = req.params.id;
      const data = await searchAPI.recipe(id);
      res.json(data);
  });

app.post("/api/recipes/favorites", async(req,res)=>{
  const recipeid = req.body.recipeid;
  try{
    const response = await db.query("INSERT INTO Favorites(recipeid) VALUES($1) RETURNING *",[recipeid]);
    res.status(201).json(response.rows[0]);

  }catch(err)
  {
    console.error("Db error"+err);
    res.status(500).json({Error:"DB error"});
  }
});

app.get("/api/recipes/favorites", async(req,res)=>{
  try{
    const response = await db.query("SELECT * FROM Favorites");
    const recids = response.rows.map((r)=>(r.recipeid));
    const result = await searchAPI.favRecipe(recids);
    res.status(201).json(result);

  }
  catch(err)
  {
    console.error("Db error: "+err);
    res.status(500).json({Error:"DB error"});
  }
});

app.delete("/api/recipes/favorites", async(req,res)=>{
  const id = req.body.recipeid;
  try{
    console.log("Backend called");
    await db.query("DELETE FROM Favorites WHERE recipeid=($1)",[id]);
    console.log("Exiting");
    res.status(200).json({
      "message": "Recipe deleted successfully"
    });
    
  }
  catch(err)
  {
    res.status(404);
  }
});

app.listen(5000, ()=>{
    
    console.log("Server started at port 5000");
});