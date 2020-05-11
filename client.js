const udp = require('dgram');
const client = udp.createSocket('udp4');

const data = Buffer.from("HELLO");
client.on('message',function(msg,info){
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
});

client.send(data,2222,"localhost",function(error){
    if(error){
        client.close();
    }else{
        console.log('Data sent !!!');
    }
});
