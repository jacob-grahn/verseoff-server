/* @flow */

const _ = require('lodash');
import type { User } from './user'
const LobbyModel = require('./models/Lobby.js');

// weights for competing goals
const wantFullRoom = 100;
const wantNoWait = 100;
const wantSameLanguage = 100;
const wantFriends = 100;

const maxWaitSeconds = 10;
const startThreshold = 200;
const fullRoom = 10;

class Lobby {

  id: string;

  constructor(id: string = 'default'): void {
    this.id = id
  }

  addUser(user: User): void {
    LobbyModel.addUser(this.id, user.id);
  }

  removeUser(user: User): void {
    LobbyModel.removeUser(this.id, user.id);
  }

}

type Room = Array<User>;

function matchmake (users): void {
  const rooms: Array<Room> = [];
  let room:Room = [...users];
  _.sortBy(room, calcHappiness);
  room.splice(0, fullRoom);
  if(averageHappiness(room) > startThreshold) {
    startRoom(room);
  }
}

function startRoom (room: Room) {

}

function calcHappiness(user: User, room: Room): number {
  user.happiness = 0;
  user.happiness += calcHappinessFromFriends(user, room);
  user.happiness += calcHappinessFromFullRoom(user, room);
  user.happiness += calcHappinessFromLanguage(user, room);
  user.happiness += calcHappinessFromBoredom(user);
  return user.happiness;
}

function calcHappinessFromFriends (user: User, room: Room): number {
  if(!user.fiends) {
    return 0;
  }
  let friends = 0;
  for (let otherUser: User of room) {
    if(user !== otherUser && user.friends.indexOf(otherUser.id) !== -1) {
      friends++;
    }
  }
  return friends * wantFriends / fullRoom;
}

function calcHappinessFromLanguage (user: User, room: Room): number {
  let sameLanguage: number = 0;
  for(let otherUser: User of room) {
    if(user !== otherUser && otherUser.language === user.language) {
      sameLanguage++;
    }
  }
  return sameLanguage * wantSameLanguage / fullRoom;
}

function calcHappinessFromFullRoom (user: User, room: Room): number {
  const roomSize = Math.min(room.length, fullRoom);
  return roomSize * wantFullRoom / fullRoom;
}

function calcHappinessFromBoredom (user: User) {
  const secondsWaited = Math.round((new Date() - user.joinTime) / 1000);
  return secondsWaited * wantNoWait / maxWaitSeconds;
}

function averageHappiness(room: Room): number {
  let total = 0,
      average;
  for(let user of room) {
    total += user.happiness;
  }
  average = total / room.length;
  return average;
}
