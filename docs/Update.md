## Update existing standard installation

This procedure requires that you followed the steps in [standard installation](Installation.md).

1. Change to installation directory, e.g.
```
cd /opt/wakeonlan-web
```

2. Run
```
sudo docker-compose down
sudo git pull
sudo docker-compose build --no-cache
sudo docker-compose up -d
```
