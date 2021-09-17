# wakeonlan-web

wakeonlan-web.


## Installation using Docker Compose

1. In the root directory of this repository, create a file `database_password.txt` and save a new password for the database in it.

2. Then, still in the root directory of the repository, execute the following commands:
```
docker-compose build
docker-compose up -d
```

3. After starting up, you can navigate with your browser to http://localhost:8000


## Development installation

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
    nano start_development.sh 

    ./start_development.sh

**Test**

    cd backend
    npm test
