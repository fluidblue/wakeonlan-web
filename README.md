# wakeonlan-web

wakeonlan-web.


## Installation

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

    cd backend
    yarn test


### Backend

**Installation**

    cd backend
    npm install

**Test**

    cd backend
    npm test
