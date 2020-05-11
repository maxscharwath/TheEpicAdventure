const os = require("os");
const ip = require("ip");

console.log(ip.address2());
return;
const udp = require("dgram");
const client = udp.createSocket({type: "udp4", reuseAddr: true });

const PORT = 20000;
const MULTICAST_ADDR = "192.168.2.255";

const data = Buffer.from("HELLO");
client.on("message", function(msg, info) {
    console.log("Data received from server : " + msg.toString());
    console.log("Received %d bytes from %s:%d\n", msg.length, info.address, info.port);
});

client.send(data, 0, data.length, PORT, MULTICAST_ADDR, function(error) {
    if (error) {
        client.close();
        console.log(error);
    } else {
        console.log("Data sent !!!");
    }
});
