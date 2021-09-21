## Development installation

You only need this type of installation if you want to help developing.
If you just want to use wakeonlan-web, you can [install it using Docker](Installation.md).

1. In the root directory of this repository, create a file `database_password.txt` and save a new password for the database in it.

2. Install MariaDB locally (or on a VM).

3. Go through steps for both frontend and backend.

### Frontend

**Installation**

    cd frontend
    yarn install
    yarn start

**Test**

    cd frontend
    yarn test


### Backend

**Installation**

    cd backend
    npm install

    # Update DATABASE_HOST to match your configuration. If you installed MariaDB locally, enter 127.0.0.1 as host.
    nano development_start.sh

    ./development_start.sh

**Test**

    cd backend

    # Update DATABASE_HOST to match your configuration. If you installed MariaDB locally, enter 127.0.0.1 as host.
    nano development_test.sh

    ./development_test.sh
