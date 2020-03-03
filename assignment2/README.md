# Assignment 2

## Running sender and receiver

Run the command `docker run -it -p {externalPort}:{internalPort}/udp granhof/telekom2 {sender | receiver}.js` where externalPort is the port that is on your network. The internal port is the port you want to expose in the docker network, its the same port you enter when you run the program. The last bit you need to specify which script to run, here you can enter `sender.js` or `receiver.js`.