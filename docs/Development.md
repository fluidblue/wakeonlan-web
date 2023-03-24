## Development installation

You only need this type of installation if you want to help developing.
If you just want to use wakeonlan-web, you can [install it using Docker](Installation.md).

1. In the root directory of this repository, create a file `database_password.txt` and save a new password for the database in it.

2. Install MariaDB locally (or on a VM).

3. Install `arp-scan` (e.g. `apt-get install arp-scan` on Linux or `brew install arp-scan` on macOS).

4. Go through steps for both frontend and backend.

### Frontend

**Installation**

    cd frontend
    yarn install
    yarn start

**Test**

    cd frontend
    yarn test


### Backend

Update DATABASE_HOST in the file `backend/scripts/development_env.sh`.
For example, if you installed MariaDB locally, enter 127.0.0.1 as host.

    nano backend/scripts/development_env.sh

**Installation**

    cd backend
    npm install
    npm start

**Test**

    cd backend
    npm test
