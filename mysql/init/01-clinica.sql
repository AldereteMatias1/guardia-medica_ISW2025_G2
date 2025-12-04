-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/

-- ============================================================
-- CONFIGURACIÓN GENERAL
-- ============================================================

CREATE DATABASE IF NOT EXISTS clinica_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE clinica_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;
SET NAMES utf8mb4;

-- ============================================================
-- TABLAS
-- ============================================================

CREATE TABLE `afiliado` (
  `id` int NOT NULL,
  `numero_afiliado` int NOT NULL,
  `cuil` varchar(15) NOT NULL,
  `id_obra_social` varchar(50) NOT NULL,
  `id_paciente` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `atencion` (
  `id` int NOT NULL,
  `informe` text,
  `id_medico` int NOT NULL,
  `id_ingreso` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `direccion` (
  `id` int NOT NULL,
  `calle` varchar(100) NOT NULL,
  `numero` int NOT NULL,
  `localidad` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `enfermero` (
  `id` int NOT NULL,
  `matricula` varchar(45) NOT NULL,
  `id_usuario` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `estado_ingreso` (
  `id` int NOT NULL,
  `estado` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ingreso` (
  `id` int NOT NULL,
  `id_enfermero` int DEFAULT NULL,
  `id_paciente` int NOT NULL,
  `id_estado_ingreso` int NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_ingreso` datetime NOT NULL,
  `temperatura` double NOT NULL,
  `frecuencia_respiratorio` double NOT NULL,
  `frecuencia_cardiaca` double NOT NULL,
  `tension_arterial` varchar(45) NOT NULL,
  `id_nivel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `medico` (
  `id` int NOT NULL,
  `matricula` varchar(45) NOT NULL,
  `id_usuario` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `nivel` (
  `id` int NOT NULL,
  `nivel` int NOT NULL,
  `espera_maxima` int NOT NULL,
  `id_nivel_emergencia` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `nivel_emergencia` (
  `id` int NOT NULL,
  `nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `obra_social` (
  `id` varchar(50) NOT NULL,
  `nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `paciente` (
  `id` int NOT NULL,
  `id_direccion` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `persona` (
  `id` int NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `cuil` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `rol` (
  `id` int NOT NULL,
  `nombre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usuario` (
  `id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- DATOS
-- ============================================================

INSERT INTO `afiliado` (`id`, `numero_afiliado`, `cuil`, `id_obra_social`, `id_paciente`) VALUES
(1, 123456789, '20-12345678-6', 'OSDE', NULL),
(2, 4789, '27-23456789-4', 'PAMI', NULL),
(3, 1414, '20-12345678-6', 'PAMI', NULL),
(5, 5856, '27-23456789-1', 'PAMI', 29);

INSERT INTO `direccion` (`id`, `calle`, `numero`, `localidad`) VALUES
(1, '25 de Mayo', 789, 'Santa Ana'),
(2, 'Av. Siempre Viva', 742, 'San Miguel de Tucumán'),
(3, 'Av. Siempre Viva', 742, 'San Miguel de Tucumán'),
(4, 'República de Siria', 1364, 'CONCEPCION'),
(5, 'Córdoba', 1058, 'San Miguel De Tucumán'),
(6, 'San Juan', 1478, 'Concepcion');

INSERT INTO `enfermero` (`id`, `matricula`, `id_usuario`) VALUES
(10, '9696', 41);

INSERT INTO `estado_ingreso` (`id`, `estado`) VALUES
(2, 'En proceso'),
(3, 'Finalizado'),
(1, 'Pendiente');

INSERT INTO `ingreso` (`id`, `id_enfermero`, `id_paciente`, `id_estado_ingreso`, `descripcion`, `fecha_ingreso`, `temperatura`, `frecuencia_respiratorio`, `frecuencia_cardiaca`, `tension_arterial`, `id_nivel`) VALUES
(14, NULL, 23, 1, 'Dolor de Pie', '2025-11-24 13:24:23', 37, 20, 80, '120/80', 5),
(15, 10, 24, 1, 'Dolor de Muela', '2025-11-24 16:02:52', 38, 20, 90, '120/80', 3),
(16, 10, 23, 1, 'Fractura de brazo', '2025-11-24 16:03:36', 38, 24, 59, '120/80', 2),
(17, 10, 30, 1, 'Fractura de Pie', '2025-11-24 16:12:41', 40, 23, 96, '130/90', 5),
(18, 10, 30, 1, 'Paciente con fractura de brazo', '2025-11-24 16:13:46', 37, 18, 80, '100/80', 2),
(19, 10, 30, 1, 'Paciente con fractura de craneo', '2025-11-24 16:17:42', 37, 18, 80, '100/80', 1),
(20, 10, 30, 1, 'Paciente con COVID', '2025-11-24 16:18:22', 37, 18, 80, '100/80', 3),
(21, 10, 24, 1, 'Paciente con Dengue', '2025-11-24 16:27:11', 36, 42, 80, '100/80', 2),
(22, 10, 25, 1, 'Dolor de Hígado', '2025-11-24 18:03:23', 38, 25, 90, '120/80', 4);

INSERT INTO `medico` (`id`, `matricula`, `id_usuario`) VALUES
(2, '27-23456789-5', 42),
(10, '9090', 40);

INSERT INTO `nivel` (`id`, `nivel`, `espera_maxima`, `id_nivel_emergencia`) VALUES
(1, 1, 5, 1),
(2, 2, 30, 2),
(3, 3, 60, 3),
(4, 4, 120, 4),
(5, 5, 240, 5);

INSERT INTO `nivel_emergencia` (`id`, `nombre`) VALUES
(1, 'CRITICA'),
(2, 'EMERGENCIA'),
(3, 'URGENCIA'),
(4, 'URGENCIA_MENOR'),
(5, 'SIN_URGENCIA');

INSERT INTO `obra_social` (`id`, `nombre`) VALUES
('OSDE', 'OSDE'),
('PAMI', 'PAMI'),
('SWISS', 'Swiss Musical');

INSERT INTO `paciente` (`id`, `id_direccion`) VALUES
(23, 2),
(24, 3),
(25, 4),
(29, 5),
(30, 6);

INSERT INTO `persona` (`id`, `nombre`, `apellido`, `cuil`) VALUES
(1, 'Juan', 'Gómez', '20-12345678-6'),
(2, 'María', 'López', '27-23456789-5'),
(3, 'Carlos', 'Pereyra', '23-34567890-8'),
(4, 'Lucía', 'Martínez', '27-45678901-4'),
(5, 'Sofía', 'Ramírez', '27-56789012-0'),
(6, 'Matías', 'Fernández', '20-67890123-9'),
(7, 'Valentina', 'Duarte', '27-78901234-7'),
(8, 'Nicolás', 'Sosa', '20-89012345-2'),
(9, 'Camila', 'Ríos', '27-90123456-5'),
(10, 'Alejandro', 'Maldonado', '20-01234567-4'),
(23, 'Mauro', 'Armas', '20-44581626-5'),
(24, 'Jorge', 'Ávila', '20-11111111-2'),
(25, 'Thiago', 'Diaz', '23-11111111-1'),
(29, 'Lucas', 'Janson', '27-23456789-1'),
(30, 'Daniel', 'Alves', '23-12345678-5');

INSERT INTO `rol` (`id`, `nombre`) VALUES
(1, 'ENFERMERO'),
(2, 'MEDICO');

INSERT INTO `usuario` (`id`, `email`, `password`, `id_rol`) VALUES
(40, 'mauro.armas14@gmail.com', '$argon2id$v=19$m=65536,t=3,p=1$jiuJK5qTQH6Z/eDP2bOblw$BNxhyvcQ6EFuVDJDi+8JPtnL+vonPK72qvZEOoQQ+6k', 2),
(41, 'enfermero@gmail.com', '$argon2id$v=19$m=65536,t=3,p=1$N0GZBA/UBLlt0DKUBI71bQ$i+39/mdy5SwZs4H4o+2wXc9jolegwAFVFqO58OXadpk', 1),
(42, 'medico@gmail.com', '$argon2id$v=19$m=65536,t=3,p=1$pL4il5oCNkc95O7folo2eg$JtVk3J+OBvNltnZs/ByA2+nxgWmI9GEk8PNLDQ7KVm4', 2);

-- ============================================================
-- ÍNDICES
-- ============================================================

ALTER TABLE `afiliado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_afiliado_persona_obra` (`cuil`,`numero_afiliado`,`id_obra_social`),
  ADD KEY `fk_afiliado_obra_social` (`id_obra_social`),
  ADD KEY `fk_afiliado_paciente` (`id_paciente`);

ALTER TABLE `atencion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_atencion_medico` (`id_medico`),
  ADD KEY `fk_atencion_ingreso` (`id_ingreso`);

ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `enfermero`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_enfermero_matricula` (`matricula`),
  ADD UNIQUE KEY `uk_enfermero_usuario` (`id_usuario`);

ALTER TABLE `estado_ingreso`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_estado_ingreso_estado` (`estado`);

ALTER TABLE `ingreso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ingreso_enfermero` (`id_enfermero`),
  ADD KEY `fk_ingreso_paciente` (`id_paciente`),
  ADD KEY `fk_ingreso_estado_ingreso` (`id_estado_ingreso`),
  ADD KEY `fk_ingreso_nivel` (`id_nivel`);

ALTER TABLE `medico`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_medico_matricula` (`matricula`),
  ADD UNIQUE KEY `uk_medico_usuario` (`id_usuario`);

ALTER TABLE `nivel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_nivel_nivel_emergencia` (`id_nivel_emergencia`);

ALTER TABLE `nivel_emergencia`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `obra_social`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_obra_social_nombre` (`nombre`);

ALTER TABLE `paciente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_paciente_direccion` (`id_direccion`);

ALTER TABLE `persona`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_persona_cuil` (`cuil`);

ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_rol_nombre` (`nombre`);

ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_usuario_email` (`email`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

-- ============================================================
-- AUTO INCREMENT
-- ============================================================

ALTER TABLE `afiliado`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `atencion`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `direccion`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `estado_ingreso`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `ingreso`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

ALTER TABLE `nivel`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `nivel_emergencia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `persona`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

ALTER TABLE `rol`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `usuario`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

-- ============================================================
-- FOREIGN KEYS
-- ============================================================

ALTER TABLE `afiliado`
  ADD CONSTRAINT `fk_afiliado_obra_social` FOREIGN KEY (`id_obra_social`) REFERENCES `obra_social` (`id`),
  ADD CONSTRAINT `fk_afiliado_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id`) ON DELETE SET NULL;

ALTER TABLE `atencion`
  ADD CONSTRAINT `fk_atencion_ingreso` FOREIGN KEY (`id_ingreso`) REFERENCES `ingreso` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_atencion_medico` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`id`);

ALTER TABLE `enfermero`
  ADD CONSTRAINT `fk_enfermero_persona` FOREIGN KEY (`id`) REFERENCES `persona` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_enfermero_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `ingreso`
  ADD CONSTRAINT `fk_ingreso_enfermero` FOREIGN KEY (`id_enfermero`) REFERENCES `enfermero` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ingreso_estado_ingreso` FOREIGN KEY (`id_estado_ingreso`) REFERENCES `estado_ingreso` (`id`),
  ADD CONSTRAINT `fk_ingreso_nivel` FOREIGN KEY (`id_nivel`) REFERENCES `nivel` (`id`),
  ADD CONSTRAINT `fk_ingreso_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id`);

ALTER TABLE `medico`
  ADD CONSTRAINT `fk_medico_persona` FOREIGN KEY (`id`) REFERENCES `persona` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_medico_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `nivel`
  ADD CONSTRAINT `fk_nivel_nivel_emergencia` FOREIGN KEY (`id_nivel_emergencia`) REFERENCES `nivel_emergencia` (`id`);

ALTER TABLE `paciente`
  ADD CONSTRAINT `fk_paciente_direccion` FOREIGN KEY (`id_direccion`) REFERENCES `direccion` (`id`),
  ADD CONSTRAINT `fk_paciente_persona` FOREIGN KEY (`id`) REFERENCES `persona` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;

SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;
