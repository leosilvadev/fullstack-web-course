const net = require('net');

var lastId = 1;

const server = net.createServer(function(socket) {
	socket.id = lastId++;
	socket.lastMessage = new Date();

	socket.write(`Welcome, you are connected with the id: ${socket.id}\r\n`);

	var interval = setInterval(function() {
		if (socket.lastMessage < tenSecondsBefore()) { 
			console.log(`Disconnecting client ${socket.id} after 10 second without iteraction...`);
			socket.end("Sorry, you are disconnected!!!\r\n");
			clearInterval(interval);
		}
	}, 1000);

	socket.on('error', function(err) {
	   console.log(err);
	   clearInterval(interval);
	});

	socket.on("close", function() {
		console.log("One client just disconnected...");
		clearInterval(interval);
	});

	socket.on('data', function(data){
		console.log(`Data received from socket ${socket.id}: ${data}`);
		socket.lastMessage = new Date();
	});
});

function tenSecondsBefore() {
	var before = new Date();
	before.setSeconds(before.getSeconds() - 10);
	return before;
}

server.listen(1337, '127.0.0.1');
