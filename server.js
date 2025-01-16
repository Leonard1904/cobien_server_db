// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuration Nodemailer avec votre service SMTP 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adresse_e-mail', // Adresse e-mail               
        pass: 'mot_de_passe', // mot de passe généré pour l'application Gmail
    },
});

// Configuration de la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',   // Nom d'utilisateur
    password: '',   // Mot de passe
    database: 'cobien', // Nom de la base de données
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connecté à la base de données MySQL');
});

// Endpoint pour ajouter un contact à la base de données
app.post('/add-contact', (req, res) => {
    const { name, email } = req.body;

    const query = 'INSERT INTO contact (name, email) VALUES (?, ?)';
    db.query(query, [name, email], (err) => {
        if (err) {
            console.error('Erreur lors de l\'insertion dans la base de données:', err);
            return res.status(500).send('Erreur lors de l\'ajout du contact.');
        }
        res.status(200).send('Contact ajouté avec succès.');
    });
});

// Endpoint pour récupérer tous les contacts
app.get('/contacts', (req, res) => {
    const query = 'SELECT * FROM contact';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des contacts:', err);
            return res.status(500).send('Erreur lors de la récupération des contacts.');
        }
        res.json(results);
    });
});

// Endpoint pour envoyer un e-mail
app.post('/send-email', (req, res) => {
    const { to, meetUrl } = req.body;

    const mailOptions = {
        from: 'leonardkamdem28@gmail.com',
        to: to,
        subject: 'Invitation à une visioconférence',
        text: `Bonjour,\n\nJ'ai planifié une visioconférence. Voici le lien : ${meetUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
            return res.status(500).send('Erreur lors de l\'envoi de l\'e-mail.');
        }
        res.status(200).send('E-mail envoyé avec succès.');
    });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
