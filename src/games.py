import uuid

class Game:

    def __init__(self, name):
        self.id = str(uuid.uuid4())
        self.name = name
        self.players = []
    
    def join(self, player):
        if len(self.players) >= 2:
            return "Game full."
        self.players.append(player)
        return "Joined."

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }
    
    def available(self):
        return len(self.players) < 2

class Games:

    games = []

    @staticmethod
    def create(name, player):
        game = Game(name)
        game.join(player)
        Games.games.append(game)

    @staticmethod
    def list_available():
        return [ game.serialize() for game in Games.games if game.available() ]