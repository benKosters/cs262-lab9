/*
 *
 * @author: kvlinden
 * @date: Summer, 2020
 */

// Set up the database connection.

const pgp = require('pg-promise')();

// uncomment these two lines to test locally
// const dotenv = require('dotenv');
// dotenv.config();


const db = pgp({
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Configure the server and its routes.


const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get('/', readHelloMessage);
router.get('/players', readPlayers);
router.get('/players/:id', readPlayer);
router.put('/players/:id', updatePlayer);
router.post('/players', createPlayer);
router.delete('/players/:id', deletePlayer);
//new routes for homework 3
router.get('/owners', getPropertyOwners);
router.get('/scores', getCashAndScore);

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function returnDataOr404(res, data) {
    if (data == null) {
        res.sendStatus(404);
    } else {
        res.send(data);
    }
}

function readHelloMessage(req, res) {
    res.send('Hello from team no-pain-no-main!');
}

function readPlayers(req, res, next) {
    db.many('SELECT * FROM Player')
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            next(err);
        });
}

function readPlayer(req, res, next) {
    db.oneOrNone('SELECT * FROM Player WHERE id=${id}', req.params)
        .then((data) => {
            returnDataOr404(res, data);
        })
        .catch((err) => {
            next(err);
        });
}

function updatePlayer(req, res, next) {
    db.oneOrNone('UPDATE Player SET email=${body.email}, name=${body.name} WHERE id=${params.id} RETURNING id', req)
        .then((data) => {
            returnDataOr404(res, data);
        })
        .catch((err) => {
            next(err);
        });
}

function createPlayer(req, res, next) {
    db.one('INSERT INTO Player(email, name) VALUES (${email}, ${name}) RETURNING id', req.body)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            next(err);
        });
}

function deletePlayer(req, res, next) {
    db.oneOrNone('DELETE FROM Player WHERE id=${id} RETURNING id', req.params)
        .then((data) => {
            returnDataOr404(res, data);
        })
        .catch((err) => {
            next(err);
        });
}

function getPropertyOwners(req, res, next) {
    db.any('SELECT player.name, property.propertyname FROM player, property WHERE property.playerid = player.id')
        .then((data) => {
            returnDataOr404(res, data);
        })
        .catch((err) => {
            next(err);
        });
}


function getCashAndScore(req, res, next) {
    db.any(
        `SELECT player.name, playergame.cash, playergame.score
         FROM player, playergame
         WHERE player.id = playergame.playerid`
    )
        .then((data) => {
            returnDataOr404(res, data);
        })
        .catch((err) => {
            next(err);
        });
}