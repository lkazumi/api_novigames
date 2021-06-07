-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 28-Maio-2021 às 02:27
-- Versão do servidor: 10.4.19-MariaDB
-- versão do PHP: 8.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `novigames`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `favorites`
--

CREATE TABLE `favorites` (
  `id_favorite` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_game` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `favorites`
--

INSERT INTO `favorites` (`id_favorite`, `id_user`, `id_game`) VALUES
(1, 1, 1),
(2, 2, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `game`
--

CREATE TABLE `game` (
  `id_game` int(11) NOT NULL,
  `name_game` varchar(100) NOT NULL,
  `picture_game` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `game`
--

INSERT INTO `game` (`id_game`, `name_game`, `picture_game`) VALUES
(1, 'Valorant', NULL),
(2, 'Fortnite', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `news`
--

CREATE TABLE `news` (
  `id_news` int(11) NOT NULL,
  `description_news` text NOT NULL,
  `emissao_news` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_game` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `picture_news` longblob DEFAULT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `news`
--

INSERT INTO `news` (`id_news`, `description_news`, `emissao_news`, `id_game`, `id_user`, `picture_news`, `title`) VALUES
(1, 'Oi, pessoal! Aqui é a Lisa Ohanian, Produtora Sênior da equipe de Modos de Jogo do VALORANT. Esperamos que vocês tenham curtido o Replicação (e a enxurrada de torretas e fumaças que vieram junto com ele!).\r\nComo já dissemos antes em outra publicação, o modo Replicação só ficará disponível até o dia 25 de maio. Mas e depois? O que vem por aí?\r\nDepois que o Replicação for embora, vamos começar uma nova abordagem de disponibilização de modos. Vamos dar início a uma rotação com os modos que já existem (Replicação, Disparada e Batalha Nevada), que seguirá o mesmo ritmo das nossas atualizações – ou seja, a cada duas semanas. Essa rotação começa oficialmente no dia 26 de maio, duas semanas após o lançamento do Replicação.\r\nAí vocês pensam: \"Mas por que vocês não deixam todos esses modos disponíveis de uma vez só?\". Pois é, ótima pergunta! E a resposta é simples: com muitos modos disponíveis ao mesmo tempo, as filas deles acabam se diluindo... o que faz com que demore mais pra todo mundo encontrar uma partida em qualquer um deles.\r\nPor isso, em vez de tornar a experiência dos nossos modos mais frustrante, escolhemos oferecer uma opção mais seleta e garantir que vocês conseguirão encontrar partidas bem rápido e com um gerenciamento top de linha.\r\nQueremos usar essa rotação por alguns ciclos e depois pensar e decidir o que faremos no longo prazo (dependendo do estado de produção de outras coisas iradas que estamos preparando). Já temos algumas ideias em mente... mas, francamente, preferimos dar atenção ao que a comunidade acha sobre essa abordagem primeiro e garantir que a opinião de vocês será levada em conta quando formos tomar a decisão, mais pra frente. Então não deixem de falar pra gente o que acharam da rotação!\r\nNossa abordagem em relação aos modos de jogo é parecida com o nosso plano de rotação: vamos prestar atenção no feedback de vocês; então caso vocês queiram que alguma coisa volte ou fique por mais tempo, é só falar! E fiquem de olho nas Notas de Atualização, pois é ali que sempre revelaremos qual modo ficará disponível nas duas semanas seguintes.\r\nPor enquanto, continuem acompanhando os perfis e canais oficiais do VALORANT e preparem-se, porque tem coisa boa sobre novos modos de jogo (e outras coisas legais relacionadas a isso) vindo aí em breve!', '2021-05-23 22:29:34', 1, 2, NULL, 'ATUALIZAÇÃO NA ROTAÇÃO DE MODOS DO VALORANT');

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `name_user` varchar(100) NOT NULL,
  `email_user` varchar(100) NOT NULL,
  `password_user` varchar(100) NOT NULL,
  `escritor_user` int(11) NOT NULL COMMENT '0=No, 1=Yes',
  `picture_user` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `user`
--

INSERT INTO `user` (`id_user`, `name_user`, `email_user`, `password_user`, `escritor_user`, `picture_user`) VALUES
(1, 'kazumi', 'kazumi@gmail.com', '1234', 0, NULL),
(2, 'zezim', 'zezim@gmail.com', '1234', 1, NULL),
(3, 'tio123', 'tio@gmail.com', 'tio123', 1, NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id_favorite`),
  ADD KEY `favorites_FK` (`id_game`),
  ADD KEY `favorites_FK_1` (`id_user`);

--
-- Índices para tabela `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id_game`);

--
-- Índices para tabela `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id_news`),
  ADD KEY `news_FK` (`id_user`),
  ADD KEY `news_FK_1` (`id_game`);

--
-- Índices para tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id_favorite` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `game`
--
ALTER TABLE `game`
  MODIFY `id_game` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `news`
--
ALTER TABLE `news`
  MODIFY `id_news` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_FK` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`),
  ADD CONSTRAINT `favorites_FK_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);

--
-- Limitadores para a tabela `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_FK` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `news_FK_1` FOREIGN KEY (`id_game`) REFERENCES `game` (`id_game`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
