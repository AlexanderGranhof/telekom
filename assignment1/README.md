# Assignment 1

## Testing UDP and TCP

### Running locally
To run the client on this machine you can run `docker-compose run -e host={hostIP} -e port={portNumber} client {protocol}` where hostIP is the target server ip, portNumber being which port it will send to and protocol being `udp` or `tcp`. The porst parameter will default to `localhost` and the port will default to `10000`. This also applies to the server container.

To run the server on this machine you can run `docker-compose run -e port={portNumber} server {protocol}` where the parameters mean the same as above. When the machine logs which IP its listeneing to, not that its the IP inside the docker network and not in your local network.

### Running remotely

If you want to run the client remotely you can run `docker run granhof/telekom1-client -p {portNumber}:{localPort}/udp -i -e host={hostIP} -e port={portNumber} {protocol}`. The `-p` flag takes in two ports seperated by a `:`. The left port number is which port the container should use inside the docker network, it needs to be the same as the `-e port=`. The right side is which port the container should bind to on your local network. Its recommended that its the same port. The `-i` flag is important, it enables the container to be shell interactive.

You can also run the server remotely and pull an image from docker by running `docker run granhof/telekom1-server {protocol}`. Note that you need to pass the `-p` parameter to expose a port on the machine. E.g. `docker run -p 10000:10000/udp granhof/telekom1-server tcp`.