const udp = require('dgram');
const server = udp.createSocket({type: "udp4", reuseAddr: true });

const PORT = 20000;
const MULTICAST_ADDR = "192.168.2.255";

server.on('error', function (error) {
    console.log('Error: ' + error);
    server.close();
});

server.on('message', function (msg, info) {
    console.log('Data received from client : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
    server.send(msg, info.port, 'localhost', function (error) {
        if (error) {
            client.close();
        } else {
            console.log('Data sent !!!');
        }

    });

});

server.on('listening', function () {
    server.addMembership(MULTICAST_ADDR);
    const address = server.address();
    const port = address.port;
    const family = address.family;
    const ipaddr = address.address;
    console.log('Server is listening at port' + port);
    console.log('Server ip :' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);
});

server.on('close', function () {
    console.log('Socket is closed !');
});

server.bind(PORT);
