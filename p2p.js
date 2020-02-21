import WebSocket = require('ws')

enum MessageType{
  QUERY_LATEST = 0,
  QUERY_ALL = 1,
  RESPONSE = 2,
}

class Message {
  public type : MessageType
  public data : any
}

var sockets:WebSocket[] = []

const server = new WebSocket.server({port:6001} );

server.on('connection', ws=>{
  sockets.push(ws);
})

server.on('message', ws=>{
  const message = JSON.parser(ws.data);
  switch (message.type) {
    case MessageType.QUERY_LATEST:{
      write(ws,queryLatestBlock())
    }
    case MessageType.QUERY_ALL:{
      write(ws,queryBlockChain())
    }
    case MessageType.responseBlockChain:{

    }
    default: break;

  }
})


var write = (ws,message) => {ws.send(message)};
var broadcast = (message:Message):void => sockets.forEach((ws) => { write(ws,message)});
var queryLatestBlock = ():Message => { 'type': MessageType.QUERY_LATEST, 'data':null}
var queryBlockChain =  ():Message => {'type': MessageType.QUERY_ALL, 'data':null}
var responseLatestBlock = ():Message =>{'type' : MessageType.RESPONSE, 'data': JSON.stringify([getLatestBlock()])}
var responseBlockChain = ():Message =>{'type' : MessageType.RESPONSE, 'data': JSON.stringify(getBlockChain())}
