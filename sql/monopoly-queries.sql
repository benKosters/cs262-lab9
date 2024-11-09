 Get the number of Game records.
SELECT *
  FROM Game
  ;

-- Get the player records.
SELECT *
  FROM Player
  ;

-- Get all the users with Calvin email addresses.
SELECT *
  FROM Player
 WHERE email LIKE '%calvin%'
 ;

-- Get the highest score ever recorded.
SELECT score FROM PlayerGame ORDER BY score DESC LIMIT 1;

-- Get the cross-product of all the tables.
SELECT * FROM Player, PlayerGame, Game;