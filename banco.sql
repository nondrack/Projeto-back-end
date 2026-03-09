-- Estrutura de Banco de Dados: Site de Cinema
-- Ferramenta: DrawSQL.app

CREATE TABLE `genero` (
    `id_genero` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL
);

CREATE TABLE `filme` (
    `id_filme` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `titulo` VARCHAR(255) NOT NULL,
    `sinopse` TEXT,
    `duracao_minutos` INTEGER,
    `classificacao_etaria` VARCHAR(10),
    `data_lancamento` DATE,
    `cartaz_url` VARCHAR(255)
);

-- Tabela N-N para filme e genero (nomes no singular)
CREATE TABLE `filme_genero` (
    `filme_id` INTEGER NOT NULL,
    `genero_id` INTEGER NOT NULL,
    PRIMARY KEY (`filme_id`, `genero_id`),
    FOREIGN KEY (`filme_id`) REFERENCES `filme`(`id_filme`),
    FOREIGN KEY (`genero_id`) REFERENCES `genero`(`id_genero`)
);

CREATE TABLE `cinema` (
    `id_cinema` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cidade` VARCHAR(100) NOT NULL,
    `endereco` VARCHAR(255)
);

CREATE TABLE `sala` (
    `id_sala` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `cinema_id` INTEGER NOT NULL,
    `nome_sala` VARCHAR(50) NOT NULL,
    `capacidade` INTEGER,
    FOREIGN KEY (`cinema_id`) REFERENCES `cinema`(`id_cinema`)
);

CREATE TABLE `sessao` (
    `id_sessao` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `filme_id` INTEGER NOT NULL,
    `sala_id` INTEGER NOT NULL,
    `data_hora` DATETIME NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `tipo` VARCHAR(50), -- ex: 2D, 3D, IMAX, Dublado, Legendado
    FOREIGN KEY (`filme_id`) REFERENCES `filme`(`id_filme`),
    FOREIGN KEY (`sala_id`) REFERENCES `sala`(`id_sala`)
);

CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `senha` VARCHAR(255) NOT NULL
);

CREATE TABLE `compra` (
    `id_compra` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `sessao_id` INTEGER NOT NULL,
    `data_compra` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `total` DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id_usuario`),
    FOREIGN KEY (`sessao_id`) REFERENCES `sessao`(`id_sessao`)
);

-- Tabela para assentos/ingressos específicos
CREATE TABLE `ingresso` (
    `id_ingresso` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `compra_id` INTEGER NOT NULL,
    `assento` VARCHAR(10) NOT NULL, -- ex: A10, B05
    FOREIGN KEY (`compra_id`) REFERENCES `compra`(`id_compra`)
);

