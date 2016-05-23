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

module.exports = Lobby;
