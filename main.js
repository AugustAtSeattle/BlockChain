const express = require('express')
const CryptoJS = require('crypto')
const app = express()
const port = 3000

app.use(bodyParser)
app.get('/', (req,res) => res.send('Hello World!'))
app.get('/blocks',(req,res) => res.send(JSON.stringify(blockchain)))
app.post('/addBlock',(req,res) =>{
	var block = generateNewBlock(req.body.data);
	addBlock(block);
	notifyLatestBlock();
	res.send();
})
app.get('/peers', (req,res)=> res.send(sockets.map( "address:" + socket )));
app.post('/addPeer', (req,res) => {
	var ws = new WebSocket(req.body.peer);
	ws.on('open', ws)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

class Block {
	constructor(index, data, timestamp, previousHash, hash) {
		this.index = index
		this.data = data
		this.timestamp = timestamp
		this.previousHash = previousHash.toString();
		this.hash = hash.toString();
	}
}
var blockchain = [getGenesisBlock()]
var getGenesisBlock = ()=>{
	return new Block(0,'In & Out Burger', 1465154705, "0","todo")
}
var generateNewBlock = (data) =>{
	const latestBlock = blockchain[length - 1]
	const index = latestBlock.index + 1
	const timestamp = new Date().getTime()/1000
	const hash = calculateHash(index,data,timestamp,latestBlock.hash)
	return new Block(index,data,timestamp,latestBlock.hash,hash)
}

var calculateHash = (index, data, timestamp, previousHash) => {
	return CryptoJS.sha512(index+data+timestamp+previousHash).toString();
}

var addBlock = (block) => {
	if (isValidNewBlock(block,getLatestBlock()),) {
		blockchain.push(block)
	}
}

var isValidNewBlock = (newBlock, previousBlcok) =>{
	if (newBlock.index !== previousBlcok.index + 1) {
		return false;
	}else if (newBlock.previousHash !== previousBlcok.hash) {
		return false;
	}else if (calculateHash(newBlock.index,newBlock.data,newBlock.timestamp,newBlock.previousHash)!== newBlock.hash){
		return false;
	}

	return true;
}

var getLatestBlock = ()=> blockchain[blockchain.length - 1];
