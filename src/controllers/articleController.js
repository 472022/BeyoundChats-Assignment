const Article = require('../models/Article');

// Create Article
exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Articles (with simple pagination)
exports.getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      articles: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Article
exports.updateArticle = async (req, res) => {
  try {
    const [updated] = await Article.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Article not found' });
    
    const updatedArticle = await Article.findByPk(req.params.id);
    res.json(updatedArticle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Article
exports.deleteArticle = async (req, res) => {
  try {
    const deleted = await Article.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Article not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
