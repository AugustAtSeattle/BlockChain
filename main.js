const express = require('express')
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
