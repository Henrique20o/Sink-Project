
import { sql } from "../database/db.js";

export const getCommentsByPostId = async (postId) => {
  try {
    const comments = await sql`
      SELECT comments.*, users.username, users.profileimagedir, TO_CHAR(post_date - INTERVAL '3 hours', 'DD-MM-YYYY HH24:MI') AS new_date
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE post_id = ${postId}`;
    return comments;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao obter comentários por postId');
  }
};

export const createComment = async (postId, content, userId) => {
  try {
    if (postId === undefined || content === undefined || userId === undefined) {
      throw new Error('Valores indefinidos ao criar comentário');
    }

    const result = await sql`
      INSERT INTO comments (post_id, content, user_id)
      VALUES (${postId}, ${content}, ${userId})
      RETURNING *
    `;
    
    return result[0];
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar comentário');
  }
};
