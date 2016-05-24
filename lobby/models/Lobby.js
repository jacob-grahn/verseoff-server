const thinky = require('../util/thinky.js');
const type = thinky.type;

const Lobby = thinky.createModel("Lobby", {
    id: type.string(),
    members: [{
      id: type.string(),
      language: type.string(),
      friends: [type.string()],
      joinTime: type.date()
    }]
}).removeExtra();

Lobby.addMember = (lobbyId: string, userId: string) => {
  Lobby.get(lobbyId)('members').append(user).run()
}

Lobby.removeMember = (lobbyId: string, userId: string) => {
  Lobby.get(lobbyId).update(row => {
    return {
      'members': row('members').filter(item => {
        return item('id').ne(userId)
      })
    }
  })
}

module.exports = Lobby;
