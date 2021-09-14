#!/bin/sh
set -m

# start chain with db
ganache-cli --gasLimit 12000000 --allowUnlimitedContractSize=true --db $SNAPSHOT_NAME -p 8545 -m "$MNEMONIC" -q &
GANACHE_PID=$!

git clone https://github.com/tkmct/peek-a-book.git
cd peek-a-book

npm i
npm run build
npm run deploy -- --network localhost

# kill chain process
kill $GANACHE_PID