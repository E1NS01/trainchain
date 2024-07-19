# Trainchain Node

Trainchain Node is a blockchain-based project designed to provide a robust and scalable platform for blockchain applications. This project leverages the power of NestJS, a progressive Node.js framework, for building efficient and reliable server-side applications.

## Features

- **Blockchain Storage**: Utilizes a custom block storage mechanism to efficiently store and retrieve blockchain data.
- **Modular Architecture**: Built with a modular approach using NestJS modules, making it easy to extend and maintain.
- **Real-time Communication**: Supports real-time communication through WebSockets, enabling dynamic data exchange.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

```sh
git clone https://github.com/E1NS01/trainchain.git
cd trainchain-node
```

2. Install dependencies:

```sh
npm install
```

### Running the Node

Development Mode:
Production Mode:
First, build the application:

```sh
npm run build
```

Then, start the application:

```sh
npm run start:prod
```

## Architecture

This project is structured as follows:

- src/: Contains the source code of the application.

  - block-storage/: Module for blockchain data storage.
  - app.module.ts: The root module of the application.
  - chain/: Module for blockchain logic and operations.
  - classes/: Definitions of blockchain entities like Block and Transaction.
  - constants/: Constants used across the application.
  - main.ts: Entry point of the application.

- test/: Contains end-to-end tests.
- blockchain/: Directory for blockchain data storage (ignored by git).
- blockchain-index/: Directory for blockchain index data (ignored by git).

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.
