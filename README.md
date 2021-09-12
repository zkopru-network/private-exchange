# Private Exchange

Private exchange is an experimental exchange app on zkopru.
By utilizing [peek-a-book](https://ethresear.ch/t/peekabook-private-order-matching/6987), [blind-find](https://ethresear.ch/t/blind-find-private-social-network-search/6988) and [zkopru atomic swap](https://zkopru.network/), it realizes complete privacy while exchanging assets.

## Development Setup

By default, local development environment connect to Goerli testnet.

### Clone this repository and install dependencies:

```bash
# Clone repository
$ git clone https://github.com/zkopru-network/private-exchange.git
$ cd private-exchange

# Install dependencies
$ yarn
# if you prefer npm
$ npm i
```

### Setup docker environment

```bash
$ npm run bootstrap
$ npm run docker:start
```

### Start zkopru coordinator locally:

Follow instruction [here](https://docs.zkopru.network/getting-started/configure-coordinator)

### Start frontend dev server:

```bash
$ yarn start
# or if you prefer npm
$ npm start
```
