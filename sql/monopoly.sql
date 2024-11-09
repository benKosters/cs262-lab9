--
-- This SQL script builds a monopoly database, deleting any pre-existing version.
--
-- @author kvlinden
-- @version Summer, 2015
--
-- edited for lab08 by @bak32
--
-- Drop previous versions of the tables if they they exist, in reverse order of foreign keys.
-- Drop existing tables if they exist.
DROP TABLE IF EXISTS Board;
DROP TABLE IF EXISTS Property;
DROP TABLE IF EXISTS PlayerGame;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Player;

-- Create the schema.
CREATE TABLE Game (
        ID integer PRIMARY KEY,
        time timestamp,
        status varchar(20) CHECK (status IN ('in-progress', 'finished')) NOT NULL
);

CREATE TABLE Player (
        ID integer PRIMARY KEY,
        emailAddress varchar(50) NOT NULL,
        name varchar(50)
);

CREATE TABLE PlayerGame (
        gameID integer REFERENCES Game(ID),
        playerID integer REFERENCES Player(ID),
        cash integer DEFAULT 1500,
        score integer,
        PRIMARY KEY (gameID, playerID)
);

CREATE TABLE Property (
        ID integer PRIMARY KEY,
        playerID integer REFERENCES Player(ID),
        propertyType varchar(20) NOT NULL,
        propertyName varchar(50) NOT NULL
);

CREATE TABLE Board (
        gameID integer REFERENCES Game(ID),
        playerID integer REFERENCES Player(ID),
        position integer NOT NULL,
        PRIMARY KEY (gameID, playerID)
);

-- Allow users to select data from the tables.
GRANT SELECT ON Game TO PUBLIC;
GRANT SELECT ON Player TO PUBLIC;
GRANT SELECT ON PlayerGame TO PUBLIC;
GRANT SELECT ON Property TO PUBLIC;
GRANT SELECT ON Board TO PUBLIC;

-- Add sample records.
INSERT INTO Game VALUES (1, '2006-06-27 08:00:00', 'finished');
INSERT INTO Game VALUES (2, '2006-06-28 13:20:00', 'in-progress');
INSERT INTO Game VALUES (3, '2006-06-29 18:41:00', 'finished');

INSERT INTO Player(ID, emailAddress, name) VALUES (1, 'me@calvin.edu', 'Player1');
INSERT INTO Player VALUES (2, 'king@gmail.edu', 'The King');
INSERT INTO Player VALUES (3, 'dog@gmail.edu', 'Dogbreath');

INSERT INTO PlayerGame VALUES (1, 1, 1500, 0);
INSERT INTO PlayerGame VALUES (1, 2, 1500, 0);
INSERT INTO PlayerGame VALUES (1, 3, 1350, 2350);
INSERT INTO PlayerGame VALUES (2, 1, 1000, 1000);
INSERT INTO PlayerGame VALUES (2, 2, 1500, 0);
INSERT INTO PlayerGame VALUES (2, 3, 2000, 500);
INSERT INTO PlayerGame VALUES (3, 2, 1500, 0);
INSERT INTO PlayerGame VALUES (3, 3, 1000, 5500);

-- Sample property records.
INSERT INTO Property VALUES (1, 1, 'house', 'Boardwalk');
INSERT INTO Property VALUES (2, 2, 'hotel', 'Park Place');
INSERT INTO Property VALUES (3, 3, 'utility', 'Electric Company');

-- Sample board position records.
INSERT INTO Board VALUES (1, 1, 10);
INSERT INTO Board VALUES (1, 2, 20);
INSERT INTO Board VALUES (1, 3, 30);
INSERT INTO Board VALUES (2, 1, 5);
INSERT INTO Board VALUES (2, 2, 15);
INSERT INTO Board VALUES (2, 3, 25);
INSERT INTO Board VALUES (3, 2, 0);
INSERT INTO Board VALUES (3, 3, 35);


--8.1a) Retrieve a list of all the games, ordered by date with the most
--recent game coming first
--SELECT * FROM Game ORDER BY time DESC;

--b) Retrieve all the games that occurred in the past week.
--(all games in the table occured in 2006, so nothing should return)
--SELECT * FROM GAME WHERE time >= '2024-10-24 00:00:00';

--c) Retrieve a list of players who have (non-NULL) names.
--SELECT * FROM Player WHERE name IS NOT NULL;

--d)Retrieve a list of IDs for players
--who have some game score larger than 2000.
--SELECT playerid FROM PlayerGame WHERE score > 2000;

--e) Retrieve a list of players who have GMail accounts.
--SELECT name FROM Player WHERE email LIKE '%gmail%';

-----------------------------------------------------------------------
--8.2
--a) Retrieve all “The King”’s game scores in decreasing order
--This will return the score and the game it was associated with in decending order
-- SELECT score, gameid from PlayerGame, Player
-- WHERE Player.id = playerid
-- AND name = 'The King'
-- ORDER BY PlayerGame.score DESC;

--b) Retrieve the name of the winner of the game played on 2006-06-28 13:20:00.
-- SELECT name, score, gameid FROM Player, PlayerGame, Game
-- WHERE time = '2006-06-28 13:20:00'
-- AND Player.id = playerid
-- AND PlayerGame.score = (SELECT MAX(score)
-- FROM PlayerGame
-- WHERE gameid = game.id
-- );

--c)So what does that P1.ID < P2.ID clause do in the last example query
--(i.e., the from SQL Examples)?
--this insures that the ids are unique, and do not return duplicate results

--d)The query that joined the Player table to itself seems rather contrived.
--Can you think of a realistic situation in which you’d want to join a table to itself?
--It is helpful to compare within the table based on a column, where there may be
--a common cloumn, and it useful for finding related rows (ie if there are different products
--offered by different stores, and you want to see which products share the common store)


--A self join would be helpful when you are comparing rows within the same table, like if
--they have the same record for a column, but other different parts (ex if you want to compare the
--students all taking cs262, they all share the same class but there are different students)