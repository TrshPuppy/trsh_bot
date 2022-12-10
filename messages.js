// This module is meant to envelope functions r/t parsing through chat messages in order to delegate functions.

// Imports:

export default function parseMessage(event) {
  console.log(event);
}

/*
[
  '#trshpuppy',
  {
    'badge-info': { subscriber: '4' },
    badges: { broadcaster: '1', subscriber: '3000' },
    'client-nonce': 'x',
    color: '#8A2BE2',
    'display-name': 'TrshPuppy',
    emotes: null,
    'first-msg': false,
    flags: null,
    id: 'x-x-x',
    mod: false,
    'returning-chatter': false,
    'room-id': 'x',
    subscriber: true,
    'tmi-sent-ts': 'x',
    turbo: false,
    'user-id': 'x',
    'user-type': null,
    'emotes-raw': null,
    'badge-info-raw': 'subscriber/4',
    'badges-raw': 'broadcaster/1,subscriber/3000',
    username: 'trshpuppy',
    'message-type': 'chat'
  },
  'tiddies'
]
*/
