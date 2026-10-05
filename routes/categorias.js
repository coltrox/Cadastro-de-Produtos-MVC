const express = require('express');
const router = express.Router();
const { Categoria, Produto } = require('../models');

// Listar categorias (com quantidade de produtos)
router.get('/', async (req, res) => {
  const categorias = await Categoria.findAll({ include: Produto });
  res.render('categorias/index', { categorias });
});

// Formulário de nova categoria
router.get('/nova', (req, res) => {
  res.render('categorias/nova');
});

// Cadastrar categoria
router.post('/', async (req, res) => {
  await Categoria.create({ nome: req.body.nome });
  res.redirect('/categorias');
});

// Formulário de edição
router.get('/:id/editar', async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  res.render('categorias/editar', { categoria });
});

// Atualizar categoria
router.post('/:id', async (req, res) => {
  await Categoria.update(
    { nome: req.body.nome },
    { where: { id: req.params.id } }
  );
  res.redirect('/categorias');
});

// Excluir categoria (os produtos dela ficam sem categoria)
router.post('/:id/deletar', async (req, res) => {
  await Produto.update(
    { categoriaId: null },
    { where: { categoriaId: req.params.id } }
  );
  await Categoria.destroy({ where: { id: req.params.id } });
  res.redirect('/categorias');
});

module.exports = router;