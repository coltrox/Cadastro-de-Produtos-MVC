const express = require('express');
const { sequelize } = require('./models');

const indexRouter = require('./routes/index');
const produtosRouter = require('./routes/produtos');
const categoriasRouter = require('./routes/categorias');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/produtos', produtosRouter);
app.use('/categorias', categoriasRouter);

// Cria as tabelas no banco e inicia o servidor
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:' + PORT);
  });
});