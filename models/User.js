import { sql } from "../database/db.js";

// Inserting new user into the database
export const registerUserInDb = async (userId, fullName, username, userEmail, profilePhotoDir, hashedPassword) => {
  await sql`
    INSERT INTO users(id, fullname, username, email, password, profileimagedir)
    VALUES (${userId}, ${fullName}, ${username}, ${userEmail}, ${hashedPassword}, ${profilePhotoDir});
    `;
};

// Getting data from an existing user
export const getUserInDb = async (userData, searchType) => {
  try {
    return await sql`SELECT * FROM users WHERE ${sql(searchType)} = ${userData}`;
  } catch (err) {
    console.error(err);
  }
};

// Updating data for an existing user
export const updateUserInDb = async (userData, oldUsername) => {
  return await sql`UPDATE users SET username = ${userData.username}, fullname = ${userData.name}, profileimagedir = ${userData.profileimagedir}
  WHERE username = ${oldUsername} RETURNING *;`
}

// Increasing XP for the user
export const addXpToUser = async (username, gainedXp) => {
  try {
    return await sql`
    UPDATE users
    SET xp = xp + ${username}
    WHERE username = ${gainedXp};
    `;
  } catch (err) {
    console.error(err);
  }
}

export const updateUserXp = (userId, videoXp) => {
  try {
    return sql`
    UPDATE users
    SET xp = xp + ${videoXp}
    WHERE id = ${userId}
    RETURNING *;
    `;
  } catch (err) {
    console.log(err)
  }
}

export const addVideoToHistory = (userId, videoId) => {
  try {
    return sql`
    UPDATE users
    SET moduleshistory = COALESCE(moduleshistory, '') || ${videoId + ';'}
    WHERE id = ${userId}
    RETURNING moduleshistory;`
  } catch (error) {

  }
}

export const checkIfUserHasSeenThisVideo = async (userId, videoId) => {
  try {
    const [query] = await sql`
    SELECT moduleshistory
    FROM users
    WHERE id = ${userId}
      AND array_position(string_to_array(moduleshistory, ';'), ${videoId}) IS NOT NULL;
    `;

    return query;
  } catch (err) {
    console.log(err);
  }
}
