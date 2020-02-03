const os = require("os");
const dns = require("dns");
const { createSocket } = require("dgram");

const server = createSocket("udp4");

let { port } = process.env;

console.log("Starting udp server...")

if (!port) {
    console.log("Port is not set, using default '10000'");
    port = 10000;
}

server.on("message", (buffer, client) => {
    console.log("Message from client:", buffer.toString());

    server.send(`I got your message: '${buffer.toString()}'`, client.port, client.address);
});

dns.lookup(os.hostname(), (err, ip) => {
    if (err) {
        throw err;
    }

    server.bind(port, () => {
        console.log(`Server listening on ${ip}:${port}`)
    })
})