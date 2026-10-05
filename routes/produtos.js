const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Produto, Categoria } = require('../models');

// Listagem de produtos (com pesquisa por nome - desafio extra)
router.get('/', async (req, res) => {
  const { busca } = req.query;
  const where = {};

  if (busca) {
    where.nome = { [Op.like]: '%' + busca + '%' };
  }

  const produtos = await Produto.findAll({ where });
  const categorias = await Categoria.findAll();

  // Mapa id -> nome para exibir a categoria na listagem
  const categoriasMap = {};
  categorias.forEach(c => { categoriasMap[c.id] = c.nome; });

  res.render('produtos/index', { produtos, categorias, categoriasMap, busca });
});

// Formulário de novo produto
router.get('/novo', async (req, res) => {
  const categorias = await Categoria.findAll();
  res.render('produtos/novo', { categorias });
});

// Desafio 2: produtos de uma determinada categoria
router.get('/categoria/:id', async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  if (!categoria) {
    return res.redirect('/produtos');
  }
  const produtos = await Produto.findAll({
    where: { categoriaId: req.params.id },
    include: Categoria
  });
  res.render('produtos/categoria', { categoria, produtos });
});

// Cadastrar produto
router.post('/', async (req, res) => {
  await Produto.create({
    nome: req.body.nome,
    preco: req.body.preco,
    quantidade: req.body.quantidade,
    categoriaId: req.body.categoriaId || null
  });
  res.redirect('/produtos');
});

// Formulário de edição
router.get('/:id/editar', async (req, res) => {
  const produto = await Produto.findByPk(req.params.id, { include: Categoria });
  const categorias = await Categoria.findAll();
  res.render('produtos/editar', { produto, categorias });
});

// Atualizar produto
router.post('/:id', async (req, res) => {
  await Produto.update(
    {
      nome: req.body.nome,
      preco: req.body.preco,
      quantidade: req.body.quantidade,
      categoriaId: req.body.categoriaId || null
    },
    { where: { id: req.params.id } }
  );
  res.redirect('/produtos');
});

// Excluir produto
router.post('/:id/deletar', async (req, res) => {
  await Produto.destroy({ where: { id: req.params.id } });
  res.redirect('/produtos');
});

module.exports = router;