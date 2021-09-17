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


## Installation using Docker

Note: This type of installation only installs a wakeonlan-web container.
A MariaDB instance must be added manually.
If you want MariaDB to be added automatically, please refer to [Installation using Docker Compose](#installation-using-docker-compose).

    docker build --progress=plain -t wakeonlan-web .

**Production (Host network driver)**

From the Docker docs:
"The host networking driver only works on Linux hosts, and is not supported on Docker Desktop for Mac, Docker Desktop for Windows, or Docker EE for Windows Server."

    docker run -d --network host wakeonlan-web

**Docker testing (Standard network driver)**

    docker run -dp 8000:8000 wakeonlan-web


## Development

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
    npm start

**Test**

    cd backend
    npm test
