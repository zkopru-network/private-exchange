FROM node:lts

RUN apt-get update -y

WORKDIR /HOME
RUN git clone https://github.com/zkopru-network/zkopru.git
WORKDIR /HOME/zkopru

RUN git checkout main

RUN yarn
RUN yarn build

WORKDIR /HOME/zkopru/packages/circuits

RUN yarn download-keys

WORKDIR /HOME/zkopru/packages/cli
COPY config.json config.json

CMD ["yarn", "coordinator", "--config", "config.json", "-d"]