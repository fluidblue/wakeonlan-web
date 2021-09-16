-- Adminer 4.8.1 MySQL 5.5.5-10.6.4-MariaDB-1:10.6.4+maria~focal dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `wakeonlan-web`;
CREATE DATABASE `wakeonlan-web` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `wakeonlan-web`;

DROP TABLE IF EXISTS `SavedHosts`;
CREATE TABLE `SavedHosts` (
  `mac` varchar(17) NOT NULL,
  `hostname` varchar(255) NOT NULL,
  PRIMARY KEY (`mac`),
  UNIQUE KEY `mac` (`mac`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `Settings`;
CREATE TABLE `Settings` (
  `autoDetectNetworks` bit(1) NOT NULL,
  `port` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `Settings_IPNetworks`;
CREATE TABLE `Settings_IPNetworks` (
  `ip` varchar(15) NOT NULL,
  `prefix` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `VendorMapping`;
CREATE TABLE `VendorMapping` (
  `mac` varchar(17) NOT NULL,
  `organization` varchar(255) NOT NULL,
  PRIMARY KEY (`mac`),
  UNIQUE KEY `mac` (`mac`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 2021-09-16 19:36:18
