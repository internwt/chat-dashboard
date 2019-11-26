var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usernames = [];
var PORT = 3000
server.listen(process.env.PORT ||PORT);
console.log(`Server Running.. ...........  port${PORT}`);

app.get('/', (req, res)=>{
	res.sendFile(__dirname + '/index.html');
});

app.get('/main.css', (req, res) =>  res.sendFile(__dirname + "/" + "main.css")
  );

io.sockets.on('connection',(socket)=>{
	console.log('Socket has Connected...with the... server....');

	socket.on('new user', (data, callback)=>{
		if(usernames.indexOf(data) != -1){
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
		}
	});

	const updateUsernames=()=>{
		io.sockets.emit('usernames', usernames);
	}

	socket.on('send message', (data)=>{
		io.sockets.emit('new message', {msg: data, user:socket.username});
	});

	socket.on('disconnect', (data)=>{
		if(!socket.username){
			return;
		}

		usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames();
	});
});

