import { Router } from "express";
import * as UserManager from "../controller/UserManager.js";
import * as PagesController from "../controller/PagesController.js";
import * as PostController from "../controller/postController.js";
import { verifyToken } from "../controller/TokenController.js";
import cookieParser from "cookie-parser";

const routes = Router();
routes.use(cookieParser());

// Rotas para renderizar páginas estáticas
routes.get("/", PagesController.renderIndex);
routes.get("/courses", PagesController.rederCoursePage)
routes.get("/register", PagesController.renderRegisterPage);
routes.get("/login", PagesController.renderLoginPage);
routes.get("/forum", PagesController.renderForumPage);

// Rotas para registro e login de usuários
routes.post("/register", UserManager.registerUser);
routes.post("/login", UserManager.loginUser);

// Rotas para Criar, Obter e Obter por ID do Curso do Fórum
routes.get("/posts", verifyToken, PostController.showAllPosts);
routes.post("/posts", verifyToken, PostController.submitPost);
routes.get("/posts/:courseId", verifyToken, PostController.showPostsByClassId);

// Rota da página inicial com verificação de token
routes.get("/home", verifyToken, PagesController.renderHomePage);

// Rota para acessar a página de qualquer usuário
routes.get("/user/:username", verifyToken, PagesController.renderUserPage);
// Rota para atualizar dados do usuário
routes.put("/user/:username", verifyToken, UserManager.updateUser);

// Rota para acessar a página de qualquer curso
routes.get("/courses/:id", verifyToken, PagesController.renderCoursePage);

// Rota para acessar qualquer página de vídeo
routes.get("/video/:id", verifyToken, PagesController.renderVideoPage);

// Rota para adicionar mais xp a um usuário
routes.post("/addUserXp", verifyToken, UserManager.addXpToUser);

export { routes };