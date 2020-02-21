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

const initP2PServer = () =>{
  const server = new WebSocket.server({port:6001} );
  server.on('connection', (ws:WebSocket)=>{
    initConnection(ws)
  })
}

const initConnection = (ws:WebSocket) =>{
  sockets.push(ws);
  initMessageHandler(ws);
  initErrorHandler(ws);
  write(ws,queryLatestBlock())
}

const JSON2Obj = <T>(data):T =>{
  try {
    return JSON.parse(data)
  } catch (e) {
    console.log(e);
    return null
  }
}

const initMessageHandler = (ws)=>{
  ws.on('message', (data)=>{
    const message:Message = JSON2Obj<Message>(data);
    if (message === null) {
      return;
    }
    switch (message.type) {
      case MessageType.QUERY_LATEST:{
        write(ws,queryLatestBlock())
        break;
      }
      case MessageType.QUERY_ALL:{
        write(ws,queryBlockChain())
        break;
      }
      case MessageType.responseBlockChain:{
        const receivedblocks:[Block] = JSON2Obj<[Block]>(message.data);
        if(data === null){
          return;
        }
        handleResponse(receivedblocks);
        break;
      }
    }
  })
}

const initErrorHandler = (ws)=>{
  const closeConnection = (ws) =>{
    sockets.splice(sockets.indexOf(ws),1)
  }
  ws.on('error',()=>closeConnection(ws));
  ws.on('close',()=>closeConnection(ws));
}



const write = (ws,message) => {ws.send(message)};
const broadcast = (message:Message):void => sockets.forEach((ws) => { write(ws,message)});
const queryLatestBlock = ():Message => { 'type': MessageType.QUERY_LATEST, 'data':null}
const queryBlockChain =  ():Message => {'type': MessageType.QUERY_ALL, 'data':null}
const responseLatestBlock = ():Message =>{'type' : MessageType.RESPONSE, 'data': JSON.stringify([getLatestBlock()])}
const responseBlockChain = ():Message =>{'type' : MessageType.RESPONSE, 'data': JSON.stringify(getBlockChain())}

const handleResponse = (receivedblocks) => {
    const blockchain = getBlockChain();
}

const connectToPeer = (peer : string):void =>{
  const ws = new WebSocket(peer);
  ws.on('open', ()=>{initConnection(ws)})
}
