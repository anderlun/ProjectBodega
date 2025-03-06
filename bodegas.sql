-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 06-03-2025 a las 19:45:20
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bodegas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `baterias`
--

CREATE TABLE `baterias` (
  `id` int NOT NULL,
  `nombre_bateria` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `baterias`
--

INSERT INTO `baterias` (`id`, `nombre_bateria`) VALUES
(1, 'Bateria1'),
(2, 'Bateria2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bodega_aseo`
--

CREATE TABLE `bodega_aseo` (
  `id` int NOT NULL,
  `nombre_producto` varchar(255) NOT NULL,
  `stock` int NOT NULL,
  `stock_minimo` int NOT NULL,
  `stock_maximo` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `bodega_aseo`
--

INSERT INTO `bodega_aseo` (`id`, `nombre_producto`, `stock`, `stock_minimo`, `stock_maximo`) VALUES
(74, 'Detergente', 8, 2, 10),
(75, 'Jabon de manos', 4, 2, 10),
(76, 'Bolsas de basura pequeña', 9, 2, 40),
(77, 'Bolsa de basura grande', 43, 3, 100),
(78, 'Limpido', 10, 2, 20),
(79, 'Jabon liquido multiusos', 6, 2, 15),
(80, 'Kit de duchas', 10, 3, 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encargados`
--

CREATE TABLE `encargados` (
  `id` int NOT NULL,
  `nombre_encargado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `encargados`
--

INSERT INTO `encargados` (`id`, `nombre_encargado`) VALUES
(49, 'Felipe '),
(50, 'Anderson Luna'),
(54, 'Ana Mercedes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salidas_bateria`
--

CREATE TABLE `salidas_bateria` (
  `id` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_bateria` int NOT NULL,
  `id_encargado` int NOT NULL,
  `cantidad` int NOT NULL,
  `fecha_salida` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `salidas_bateria`
--

INSERT INTO `salidas_bateria` (`id`, `id_producto`, `id_bateria`, `id_encargado`, `cantidad`, `fecha_salida`) VALUES
(178, 75, 1, 54, 1, '2025-03-05 09:32:15'),
(179, 77, 2, 50, 7, '2025-03-05 09:32:42'),
(180, 80, 1, 49, 9, '2025-03-05 09:33:27'),
(181, 80, 1, 50, 4, '2025-03-05 09:33:53'),
(182, 80, 2, 50, 3, '2025-03-05 09:34:13'),
(183, 80, 2, 54, 3, '2025-03-05 09:34:42'),
(184, 79, 1, 54, 1, '2025-03-06 14:30:34'),
(185, 80, 2, 54, 1, '2025-03-06 14:43:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('admin','usuario') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `contraseña`, `rol`) VALUES
(1, 'anderson', 'anderzito1999@gmail.com', 'andersito', 'admin'),
(3, 'anderson', 'anderzito199@gmail.com', '$2b$10$MhWybtfJ10CgBFM09IUo8OP/YY5vzA19cii7etgnE7QOwFt0HcYHy', 'admin'),
(4, 'anderson', 'anderzito19@gmail.com', '$2b$10$ogveNR06VcQtQhqiC5k0iOCbiKIP.2f9F76fvO0azRZRB9S5D/D9.', 'admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `baterias`
--
ALTER TABLE `baterias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `bodega_aseo`
--
ALTER TABLE `bodega_aseo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `encargados`
--
ALTER TABLE `encargados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `salidas_bateria`
--
ALTER TABLE `salidas_bateria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bateria` (`id_bateria`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_encargado` (`id_encargado`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `baterias`
--
ALTER TABLE `baterias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `bodega_aseo`
--
ALTER TABLE `bodega_aseo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT de la tabla `encargados`
--
ALTER TABLE `encargados`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `salidas_bateria`
--
ALTER TABLE `salidas_bateria`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `salidas_bateria`
--
ALTER TABLE `salidas_bateria`
  ADD CONSTRAINT `salidas_bateria_ibfk_1` FOREIGN KEY (`id_bateria`) REFERENCES `baterias` (`id`),
  ADD CONSTRAINT `salidas_bateria_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `bodega_aseo` (`id`),
  ADD CONSTRAINT `salidas_bateria_ibfk_3` FOREIGN KEY (`id_encargado`) REFERENCES `encargados` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
