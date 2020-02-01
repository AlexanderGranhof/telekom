const net = require("net");
const os = require("os");
const dns = require("dns");

let { port } = process.env;

if (!port) {
    console.log("Port is not set, using default '10000'");
    port = 10000;
}

const machineHostname = os.hostname();

const server = net.createServer(socket => {
    console.log("Client connected!")

    socket.on("data", buffer => {
        console.log("Message from client:", buffer.toString());

        socket.write(`I got your message: '${buffer.toString()}'`)
    });

    socket.on("close", () => {
        console.log("Client disconnected");
    })
});

dns.lookup(machineHostname, (err, ip) => {
    if (err) {
        throw err;
    }

    server.listen(port, () => {
        console.log(`Server is listening on ${ip}:${port}\n`);
    });
});
