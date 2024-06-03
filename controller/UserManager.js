// Imports
import { randomUUID } from "node:crypto";
import { tokenGeneration } from "./TokenController.js";
import bcrypt from "bcrypt";
import * as User from "../models/User.js";

// Function to obtain user data and generate a unique ID, random profile photo and then save it in the database
export const registerUser = async (req, res) => {
  const userId = randomUUID();
  const profilePhotoDir = `/img/profileImg/${Math.ceil(
    Math.random() * 10
  )}.jpg`;
  const fullName = req.body.fullname;
  const username = req.body.username;
  const userEmail = req.body.email;

  // generating a hashed password to save in the database
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    await User.registerUserInDb(
      userId,
      fullName,
      username,
      userEmail,
      profilePhotoDir,
      hashedPassword
    );
    return res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

// Function to login the user and provide a jwt token in the user's browser
export const loginUser = async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  console.log(userEmail)

  // getting user data from database
  let [user] = await User.getUserInDb(userEmail, "email");
  console.log(user);

  if (user) {
    // checking hashed password with bcrypt
    const passwordCheck = await bcrypt.compare(userPassword, user.password);

    if (passwordCheck) {
      const token = await tokenGeneration(
        user.id,
        user.username,
        user.profileimagedir,
        user.xp
      );

      // saving the generated JWT token in the user's browser cookies
      res.cookie("token", token, {
        httpOnly: true,
      });

      console.log("logado");
      return res.redirect("/home");
    }
  } else {
    console.log("Usuário não encontrado");
    return res.redirect("/login");
  }
};

// Function to update a logged in user data
export const updateUser = async (req, res) => {
  try {
    // getting user data saved in database
    const [userInDb] = await User.getUserInDb(req.user.userId, 'id');

    if (userInDb) {
      // checking hashed password with bcrypt
      const passwordCheck = await bcrypt.compare(
        req.body.password,
        userInDb.password
      );
      if (passwordCheck) {
        // upadating user data in the database
        const [updatedUserData] = await User.updateUserInDb(req.body, userInDb.username);

        // cleaning old JWT token
        res.clearCookie("token");

        // generating new JWT token with updated credentials
        const token = await tokenGeneration(
          updatedUserData.id,
          updatedUserData.username,
          updatedUserData.profileimagedir,
          updatedUserData.xp
        );

        // saving the generated JWT token in the user's browser cookies
        res.cookie("token", token, {
          httpOnly: true,
        });

        return res.redirect(`/user/${updatedUserData.username}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
};


export const addXpToUser = async (req, res) => {
  const videoData = req.body;
  const userId = req.user.userId;

  const verifiedUserData = await User.checkIfUserHasSeenThisVideo(userId, videoData.videoId);
  console.log(verifiedUserData);
  if (!verifiedUserData) {
    const [user] = await User.updateUserXp(userId, videoData.earnedXp);
    await User.addVideoToHistory(userId, videoData.videoId);

    // cleaning old JWT token
    res.clearCookie("token");

    // generating new JWT token with updated credentials
    const token = await tokenGeneration(
      user.id,
      user.username,
      user.profileimagedir,
      user.xp
    );

    // saving the generated JWT token in the user's browser cookies
    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).json({ xp: user.xp });
  } else {
    return res.status(400).json({ error: 'Usuário já viu este vídeo' });
  }
}
