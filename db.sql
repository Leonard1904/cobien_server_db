-- Création de la base de données
CREATE DATABASE cobien;

-- Utilisation de la base de données
USE cobien;

-- Création de la table avec les champs spécifiés
CREATE TABLE contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);