const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  original_content_html: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  original_content_text: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true
  },
  published_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  source_url: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  is_updated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  updated_content: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  references: {
    type: DataTypes.JSON,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Article;
