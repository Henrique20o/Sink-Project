import * as CommentModel from "../models/Comment.js";
import * as PostModel from "../models/Post.js";

export const showCommentsByPostId = async (req, res) => {
  const { postId } = req.params;

  try {
  
    const post = await PostModel.getPostById(postId);

    const comments = await CommentModel.getCommentsByPostId(postId);

    res.render('comments', { postId, post, comments });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao obter comentários por postId');
  }
};

export const submitComment = async (req, res) => {
  const { postId, content, userId } = req.body;

  try {
    const newComment = await CommentModel.createComment(postId, content, userId);
    res.redirect(`/posts/open/${postId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar comentário');
  }
};
