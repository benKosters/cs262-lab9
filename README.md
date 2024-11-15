# cs262-lab9

This is a sample web app that connects to a sample database of monopoly games.


The web app is deployed here:
[https://cs272-lab9-teamd.azurewebsites.net/](https://cs272-lab9-teamd.azurewebsites.net/)

To get all players:
[https://cs272-lab9-teamd.azurewebsites.net/players](https://cs272-lab9-teamd.azurewebsites.net/players)

To return player with id 1:
[https://cs272-lab9-teamd.azurewebsites.net/players/1](https://cs272-lab9-teamd.azurewebsites.net/players/1)

To return played with id -1 (this will not work):
[https://cs272-lab9-teamd.azurewebsites.net/players/-1](https://cs272-lab9-teamd.azurewebsites.net/players/-1)

And an undefined endpoint:
[https://cs272-lab9-teamd.azurewebsites.net/blob](https://cs272-lab9-teamd.azurewebsites.net/blob)


For Homework3, I've added these routes:
[httpshttps://cs272-lab9-teamd.azurewebsites.net/owners](https://cs272-lab9-teamd.azurewebsites.net/owners)
This GET will return the result of the names of the players who own properties in a game.

[https://cs272-lab9-teamd.azurewebsites.net/scores](https://cs272-lab9-teamd.azurewebsites.net/scores)
This GET will return the result of the players, their scores, and the total cash that they have as well.