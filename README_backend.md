# wakeonlan-web

wakeonlan-web.


## Installation

    docker build --progress=plain -t wakeonlan-web .

**Development**

    docker run -dp 8000:8000 wakeonlan-web

**Production**

From the Docker docs:
"The host networking driver only works on Linux hosts, and is not supported on Docker Desktop for Mac, Docker Desktop for Windows, or Docker EE for Windows Server."

    docker run -d --network host wakeonlan-web


## Development installation

    npm install


## Test

    npm test
