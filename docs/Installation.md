## Standard installation

The standard installation uses Docker.

1. Install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)

2. Clone this repository to your local disk
```
git clone https://github.com/fluidblue/wakeonlan-web.git
```

3. In the root directory of the repository, create a file `database_password.txt` and save a new password for the database in it.

4. Execute the following commands (also in the root directory of the repository):
```
docker-compose build
docker-compose up -d
```

5. After starting up, you can navigate with your browser to http://localhost:9000

Please note that only Linux hosts (e.g. Ubuntu, Debian, Raspbian, etc.) are supported. This is because [host networking](https://docs.docker.com/network/host/) is used.
If you want to run wakeonlan-web on macOS or Windows, you need to run it inside a VM.


## Update existing installation

1. Go to installation directory

2. Execute the following commands:
```
docker-compose down
git pull origin
docker-compose build
docker-compose up -d
```
