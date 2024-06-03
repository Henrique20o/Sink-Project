import * as PostModel from "../models/Post.js";

// Controller display all posts
export const showAllPosts = async (req, res) => {
  try {
    const user = req.user; // Obtém o objeto do usuário da solicitação
    const posts = await PostModel.getPostsPaginated();
    const topGames = await PostModel.getTopGames();

    const currentGame = null;

    // Certifique-se de passar o objeto `user` para a renderização
    res.render('forum', { user, posts, topGames, currentGame });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao obter postagens');
  }
};
export const submitPost = async (req, res) => {
  const { title, content, courseId } = req.body;
  const userId = req.user.userId;

  try {
    // Verificar se os valores são válidos
    if (!title || !content || !userId || !courseId) {
      throw new Error('Valores inválidos para criar postagem');
    }

    // Adicionar a nova postagem ao banco de dados
    await PostModel.createPost(title, content, userId, courseId);
    res.redirect(`/posts`); // Redirecionar para a página do fórum após criar a postagem
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar postagem');
  }
};
// Filtering posts by CourseId
export const showPostsByClassId = async (req, res) => {
  try {
    const user = req.user; // Obtém o objeto do usuário da solicitação
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const courseId = req.params.courseId;

    const posts = await PostModel.getPostsByClassIdPaginated(courseId, page, pageSize);
    const totalPages = Math.ceil(posts.length / pageSize);

    const topGames = await PostModel.getTopGames();
    const currentGame = topGames.find(game => game.id === courseId) || {};

    // Passando o user para a renderização
    res.render('forum', { user, posts, totalPages, currentPage: parseInt(page), courseId, topGames, currentGame });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao obter postagens por Class ID');
  }
};


