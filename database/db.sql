CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL CHECK (username !~ ' '),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    xp INT NOT NULL DEFAULT 0,
    profileimagedir VARCHAR(150) NOT NULL,
    signed BOOLEAN DEFAULT TRUE,
    moduleshistory TEXT,
    created_at TIMESTAMP DEFAULT Now()
);

INSERT INTO users (id, fullname, username, email, password, profileimagedir, moduleshistory, created_at, signed)
VALUES
  ('1', 'João da Silva', 'joao_silva', 'joao@example.com', 'senha123', '/img/profileImg/7.jpg', NULL, Now(), TRUE),
  ('2', 'Maria Oliveira', 'maria_oliveira', 'maria@example.com', 'senha456', '/img/profileImg/4.jpg', '1,3,5', NULL, TRUE),
  ('3', 'Carlos Pereira', 'carlos_pereira', 'carlos@example.com', 'senha789', '/img/profileImg/3.jpg', NULL, '2023-01-15 08:30:00', TRUE),
  ('4', 'Ana Souza', 'ana_souza', 'ana@example.com', 'senha987', '/img/profileImg/4.jpg', NULL, Now(), TRUE),
  ('5', 'Lucas Santos', 'lucas_santos', 'lucas@example.com', 'senha654', '/img/profileImg/5.jpg', '2,4,6', NULL, FALSE),
  ('6', 'Fernanda Lima', 'fernanda_lima', 'fernanda@example.com', 'senha321', '/img/profileImg/6.jpg', NULL, Now(), TRUE),
  ('7', 'Ricardo Almeida', 'ricardo_almeida', 'ricardo@example.com', 'senha111', '/img/profileImg/2.jpg', NULL, '2023-02-01 12:45:00', TRUE),
  ('8', 'Patrícia Costa', 'patricia_costa', 'patricia@example.com', 'senha222', '/img/profileImg/7.jpg', NULL, Now(), TRUE),
  ('9', 'Daniel Oliveira', 'daniel_oliveira', 'daniel@example.com', 'senha333', '/img/profileImg/4.jpg', '3,5,7', NULL, FALSE),
  ('10', 'Amanda Silva', 'amanda_silva', 'amanda@example.com', 'senha444', '/img/profileImg/10.jpg', NULL, Now(), TRUE);

CREATE TABLE courses (
    id VARCHAR(25) PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(120) UNIQUE NOT NULL,
    description VARCHAR(500) NOT NULL,
    imgdir VARCHAR(120) NOT NULL
);

INSERT INTO courses 
(id, name, description, imgdir) VALUES
('lol', 'League of Legends', 'League of Legends é um renomado jogo online de batalha estratégica em equipe, no qual jogadores assumem o papel de campeões com habilidades únicas. Ambientado em um mundo fantástico, o objetivo é destruir o Nexus inimigo, enfrentando desafios táticos, trabalho em equipe e estratégias avançadas. Com uma comunidade global apaixonada e uma cena competitiva vibrante, LoL é um dos títulos mais populares no cenário de esports.', '/img/coursesimg/lol.jpg'),
('valorant', 'Valorant', 'Desenvolvido pela Riot Games, Valorant é um jogo tático de tiro em primeira pessoa que combina elementos de estratégia e habilidades especiais. Os jogadores assumem o papel de Agentes, cada um com habilidades únicas, enquanto competem em partidas intensas. A jogabilidade estratégica e a precisão são fundamentais, tornando Valorant um favorito entre os entusiastas de esports que apreciam desafios táticos e mecânicas de tiro precisas.', '/img/coursesimg/valorant.jpg'),
('fortnite', 'Fortnite', 'Fortnite é um jogo inovador de battle royale que se destaca por seu estilo artístico único, construção de estruturas e eventos épicos. Com 100 jogadores lutando pela sobrevivência em uma ilha em constante mudança, o jogo combina habilidade de tiro, estratégia de construção e um toque de humor. A comunidade global e os eventos regulares tornam Fortnite uma escolha emocionante para aqueles que buscam uma experiência dinâmica e competitiva.', '/img/coursesimg/fortnite.jpg'),
('dota2', 'DOTA 2', 'DOTA 2 é um jogo de estratégia em equipe que desafia os jogadores a controlar heróis poderosos em batalhas épicas. Com um mapa complexo, ampla variedade de heróis e um sistema de progressão estratégica, DOTA 2 é conhecido por sua profundidade estratégica. A cena competitiva é rica em torneios globais, oferecendo oportunidades para jogadores aprimorarem suas habilidades e competirem em níveis mais altos.', '/img/coursesimg/dota.jpg'),
('cs2', 'CS 2', 'CS 2 é um clássico jogo de tiro em primeira pessoa que se destaca pela jogabilidade tática, trabalho em equipe e habilidades de tiro precisas. Divididos em equipes de terroristas e contra-terroristas, os jogadores competem em partidas estratégicas para atingir objetivos específicos. Com uma cena competitiva robusta e uma base de jogadores dedicada, CS 2 é um título atemporal no cenário de esports.', '/img/coursesimg/cs.jpg');


CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title VARCHAR(120) NOT NULL,
    description VARCHAR(500) NOT NULL, 
    imgdir VARCHAR(120) NOT NULL,
    xp_earned INT, -- Removendo o NOT NULL
    course_id VARCHAR(25) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses (id) 
);



CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    title VARCHAR,
    course_id VARCHAR(25) NOT NULL,
    content VARCHAR,
    post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);

INSERT INTO posts (title, content, user_id, course_id) 
VALUES
  ('Dúvida sobre Ranked', 'Estou com dúvidas sobre o sistema de ranked no LoL. Alguém pode me ajudar?', 1, 'lol'),
  ('Melhores agentes para ranqueada', 'Quais são os melhores agentes para jogar em partidas ranqueadas no Valorant?', 2, 'valorant'),
  ('Evento épico em Fortnite', 'Vocês viram o último evento em Fortnite? Foi incrível!', 3, 'fortnite'),
  ('Estratégias para DOTA 2', 'Compartilhem suas estratégias favoritas para vencer no DOTA 2.', 4, 'dota2'),
  ('Dicas avançadas de mira no CS 2', 'Preciso de dicas avançadas para melhorar minha mira no CS 2.', 5, 'cs2'),
  ('Novidades no League of Legends', 'Alguém sabe das últimas novidades no universo do League of Legends?', 6, 'lol'),
  ('Discussão sobre patches no Valorant', 'Vamos discutir as mudanças mais recentes nos patches do Valorant.', 7, 'valorant'),
  ('Estratégias avançadas em DOTA 2', 'Compartilhe suas estratégias avançadas para DOTA 2 aqui.', 8, 'dota2'),
  ('Competindo em Fortnite', 'Como se preparar para competições em Fortnite? Alguma dica?', 9, 'fortnite'),
  ('CS 2 vs Valorant: Qual é o melhor?', 'Vamos debater sobre as diferenças entre CS 2 e Valorant.', 10, 'cs2');

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    content VARCHAR,
    post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id) 

);


INSERT INTO videos 
(id, title, description, imgdir, xp_earned, course_id) VALUES
('aula1_lol', 'Como kaitar no League of Legends', 'Hoje iremos ensinar a kaitar no League of Legends', '/img/videosimg/comokaitar.jpg', 300, 'lol'),
('aula1_valorant', 'Como Dar Tapa Drop!', 'Meu HighLight muito top de valorant para ensina-los a jogar corretamente!', '/img/videosimg/aula1_valorant.png', 400, 'valorant'),
('aula2_valorant', 'Como Destruir de AwP!', 'Hoje Vou Ensinalos A Destruir de AwP!', '/img/videosimg/aula2_valorant.png', 450, 'valorant'),
('aula1_cs2', 'Como bangar a perfeitinha!', 'Hoje ensinarei pixels ROUBADISSIMOS DE BANGS no Cs2', '/img/videosimg/aula1_cs2.png', 500, 'cs2'),
('aula1_dota2', 'Teleporte do vagabundo no DOTA 2', 'Aprenda o teleporte do desgraçado máximo com DinossauroHU3', '/img/videosimg/tpdovagabundo.jpg', 288, 'dota2')
('aula1_fortnite', 'Como jogar fornite da maneira correta', 'Aprenda a jogar fortnite agora', '/img/videosimg/aula1_fortnite.jpg', 621, 'fortnite');



