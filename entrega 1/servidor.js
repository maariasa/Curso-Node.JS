const { cursos, mostrarCursos, argv } = require('./principal.js');
const express = require('express');
const app = express();

app.get('/', async (req, res) =>{
  console.log('Funciona!!!');
  res.send('Nani??');
})

app.listen(3000);
