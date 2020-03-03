FROM node:13

RUN mkdir -p /usr/app/sender-receiver

WORKDIR /usr/app

RUN mkdir helpers

COPY ./helpers/* ./helpers/
COPY ./receiver/receiver.js ./sender-receiver
COPY ./sender/sender.js ./sender-receiver

WORKDIR /usr/app/sender-receiver

ENTRYPOINT ["node"]
CMD []