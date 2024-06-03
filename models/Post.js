import { sql } from "../database/db.js";

// Getting all posts from database
const postsPerPage = 10;

export const getPostsPaginated = async (page = 1, pageSize = 10) => {
  try {
    const posts = await sql`
      SELECT posts.*, users.username, users.xp, users.profileimagedir, TO_CHAR(post_date - INTERVAL '3 hours', 'DD-MM-YYYY HH24:MI') AS new_date
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY post_date DESC
    `;
    return posts;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao obter postagens paginadas');
  }
};

// Create a new post in the database
export const createPost = async (title, content, userId, courseId,) => {
  try {
    const result = await sql`
    INSERT INTO posts (title, content, user_id, course_id) 
    VALUES (${title}, ${content}, ${userId}, ${courseId}) 
    RETURNING *;`;

    return result[0];
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar postagem');
  }
};

// Getting posts by CourseId
export const getPostsByClassIdPaginated = async (courseId, page = 1, pageSize = 10) => {
  try {
    if (!courseId) {
      throw new Error('Course ID não fornecido');
    }

    const offset = (page - 1) * pageSize;

    const result = await sql`
      SELECT posts.*, users.username, users.profileimagedir, TO_CHAR(post_date - INTERVAL '3 hours', 'DD-MM-YYYY HH24:MI') AS new_date
      FROM posts
      JOIN users ON posts.user_id = users.id
      JOIN courses ON posts.course_id = courses.id
      WHERE LOWER(courses.name) = LOWER(${courseId})
      ORDER BY post_date DESC
      LIMIT ${pageSize} OFFSET ${offset}`;

    console.log('Query Result:', result);

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao obter postagens paginadas por Course ID');
  }
};

export const getPostById = async (postId) => {
  try {
    const post = await sql`
      SELECT posts.*, users.username, users.profileimagedir, TO_CHAR(post_date - INTERVAL '3 hours', 'DD-MM-YYYY HH24:MI') AS new_date
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = ${postId}`;

    return post[0];
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao obter post por ID');
  }
};


export const getTotalPosts = async () => {
  try {
    return await sql`SELECT * FROM posts`;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao obter o total de postagens');
  }
};

export const getTotalPostsByClassId = async (courseId) => {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM posts WHERE course_id = ${courseId}`;
    return result[0].count;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao obter o total de postagens por Course ID');
  }
};

export const getTopGames = async () => {
  try {
    const topGames = await sql`
      SELECT id, name, description
      FROM courses
      LIMIT 5;
    `;
    return topGames;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao obter os jogos mais vistos');
  }
};

export const getPostsByUserId = async (userId) => {
  try {
    const posts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`;
    return posts; // Assumindo que há apenas um post com esse ID
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao obter post por ID');
  }
}
