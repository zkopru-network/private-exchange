# Private Exchange local demo environment setup

Prerequisites

- node@^12.x.x
- docker, docker compose

## Setup local geth node and coordinator

### Clone zkopru repository

```
$ git clone https://github.com/zkopru-network/zkopru.git
```

### Build and run geth and coordinator inside docker containers

```
$ yarn bootstrap
$ yarn develop
```

By running these commands, it installs dependencies and build packages. Then start local geth node and coordinator inside docker containers.

It also starts coordinator TUI in http://localhost:1234.

### Start auto coordination and setup url

1. Open http://localhost:1234
2. Select `setup menu`, then select `register as a coordinator`.
3. Go back to previous menu and select `start auto coordination`.
4. Select `auction menu`, then select `update url` and input `127.0.0.1:8888` to target local coordinator process.

### Setup zkopru wallet and deposit ETH and ERC20

clone zkopru wallet repo

```
$ git clone https://github.com/zkopru-network/wallet.git
```

setup following README of [wallet repo](https://github.com/zkopru-network/wallet)

Change ws url and zkopru contract address to local ones.
wallet repo `src/stores/zkopru.js:5L`

```typescript
// const URL = 'wss://goerli.infura.io/ws/v3/5b122dbc87ed4260bf9a2031e8a0e2aa'
// const URL = 'wss://goerli2.zkopru.network'
const URL = 'ws://127.0.0.1:5000'
const ZKOPRU_CONTRACT = '0x970e8f18ebfEa0B08810f33a5A40438b9530FBCF'
```

### Register ERC20 and Deposit to use for swap

1. Deploy any ERC20 contract to Local geth node.
2. Register deployed ERC20 to zkopru from wallet token library page.
3. Deposit ETH and ERC20 in two different accounts for swap. Note that in order to send transaction on zkopru, you need ETH for fee.

### Setup private exchange

clone private exchange repo

```
$ git clone https://github.com/zkopru-network/private-exchange.git
```

install dependencies

```
$ yarn
```

change zkopru ws url to `ws://127.0.0.1:5000` and zkopru contract address to `0x970e8f18ebfEa0B08810f33a5A40438b9530FBCF`

start dev server and frontend in two different terminal

```bash
$ yarn start:server
$ yarn start # in different terminal
```
