/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/**
 * This module implements a REST-inspired webservice for the Monopoly DB.
 * The database is hosted on ElephantSQL.
 *
 * Currently, the service supports the player table only.
 *
 * To guard against SQL injection attacks, this code uses pg-promise's built-in
 * variable escaping. This prevents a client from issuing this URL:
 *     https://cs262-webservice.azurewebsites.net//players/1%3BDELETE%20FROM%20PlayerGame%3BDELETE%20FROM%20Player
 * which would delete records in the PlayerGame and then the Player tables.
 * In particular, we don't use JS template strings because it doesn't filter
 * client-supplied values properly.
 * TODO: Consider using Prepared Statements.
 *      https://vitaly-t.github.io/pg-promise/PreparedStatement.html
 *
 * This service assumes that the database connection strings and the server mode are
 * set in environment variables. See the DB_* variables used by pg-promise. And
 * setting NODE_ENV to production will cause ExpressJS to serve up uninformative
 * server error responses for all errors.
 *
 * @author: kvlinden
 * @date: Summer, 2020
 */

// Set up the database connection.

const pgp = require('pg-promise')();
require('dotenv').config();

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
    res.send('Hello, CS 262 Monopoly service!');
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