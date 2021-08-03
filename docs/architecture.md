# Architecture

This document provides a architectural overview of **Private Exchange**. Explaining technology stack, usecases and system architecture.

## Technology stack

Private exchange consists of 3 main funtionalities. Order advertisement and private matching, peer finding and atomic swap. We use Peek a book, blind-find, SMP and ZKOPRU for each functionalities.

### Peek a book: Order advertisement and private order matching

[peek-a-book](https://github.com/mhchia/peek-a-book)  
[js-smp](https://github.com/mhchia/js-smp-peer)

### Blind-find: Peer finding

[blind-find](https://ethresear.ch/t/blind-find-private-social-network-search/6988)

### ZKOPRU: Atomic swap

[zkopru atomic swap](https://docs.zkopru.network/how-it-works/atomic-swap)

## System architecture

## Use Cases diagram

Use cases of Private exchange system includes.

- Post order ads
- Search order ads
- Find/Connect peer
- Execute private order matching
- Execute atomic swap
- View History

Through these use cases, users can exchange their assets without revealing any information to others.

![Usecase diagram](./assets/usecase-diagram.jpeg)
