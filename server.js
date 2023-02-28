const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const postgres = require('postgres');
const cors = require('cors')

dotenv.config();

const app = express();

app.use(cors({ origin: '*'}));

app.use(morgan('tiny'));
app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const sql = postgres(DATABASE_URL);

app.get('/all', async (req, res) => {
   try {
      const data = await sql`SELECT * FROM weeklies ORDER BY id ASC`;
      res.json(data)
   } catch (error) {
      console.log(error);
      res.status(500).json({error})
   }
});

app.put('/add', async (req, res) => {
   const { text } = req.body
   try {
      const data = await sql`INSERT INTO weeklies (task_name) VALUES (${text})`
      res.json({message: `"${text}" added to database`})
   } catch (error) {
      console.log(error);
      res.status(500).json({error})
   }
})

app.patch('/task/:id', async (req, res) => {
   const id = req.params.id
   const { bool } = req.body

   try {
      const data = await sql`UPDATE weeklies SET complete = ${bool} WHERE id = ${id}`
      res.json({message: `task #${id} completion set to ${bool}`})
   } catch (error) {
      console.log(error);
      res.status(500).json({error})
   }
})

app.delete('/task/:id', async (req, res) => {
   const id = req.params.id

   try {
      const data = await sql`DELETE FROM weeklies WHERE id = ${id}`
      res.json({message: `task #${id} deleted`})
   } catch (error) { 
      console.log(error);
      res.status(500).json({error})
   }
})

app.listen(PORT, () => {
   console.log(`Listening on PORT : ${PORT}`);
})