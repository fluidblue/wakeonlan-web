## Standard installation

The standard installation uses Docker.

1. Install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)

2. Clone this repository to your local disk

3. In the root directory of the repository, create a file `database_password.txt` and save a new password for the database in it.

4. Execute the following commands (also in the root directory of the repository):
```
docker-compose build
docker-compose up -d
```

5. After starting up, you can navigate with your browser to http://localhost:8000

Please note that only Linux hosts (e.g. Ubuntu, Debian, Raspbian, etc.) are supported. This is because [host networking](https://docs.docker.com/network/host/) is used.
If you want to run wakeonlan-web on macOS or Windows, you need to run it inside a VM.
