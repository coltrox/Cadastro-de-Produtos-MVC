const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const Categoria = sequelize.define('Categoria', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Relacionamento: uma categoria tem muitos produtos
// e um produto pertence a uma categoria (chave estrangeira categoriaId)
Categoria.hasMany(Produto, { foreignKey: 'categoriaId' });
Produto.belongsTo(Categoria, { foreignKey: 'categoriaId' });

module.exports = {
  sequelize,
  Categoria,
  Produto
};