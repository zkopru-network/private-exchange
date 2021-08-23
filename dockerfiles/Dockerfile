FROM node:14.17


ENV MNEMONIC='concert load couple harbor equip island argue ramp clarify fence smart topic'
ENV NETWORK_ID=1337
ENV CHAIN_ID=1337
ENV SNAPSHOT_NAME=chain.db

WORKDIR /HOME

RUN npm i -g ganache-cli@6.12.1
COPY dockerfiles/setup.sh setup.sh

RUN /bin/sh setup.sh

EXPOSE 8545
CMD ["sh", "-c", "ganache-cli --gasLimit 12000000 --noVMErrorsOnRPCResponse -p 8545 --keepAliveTimeout=40000 --db chain.db --networkId \"$NETWORK_ID\" --chainId \"$CHAIN_ID\" -m \"$MNEMONIC\" -h 0.0.0.0"]
