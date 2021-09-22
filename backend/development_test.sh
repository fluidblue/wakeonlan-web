DATABASE_HOST="raspberrypi" \
DATABASE_DB="wakeonlan-web" \
DATABASE_USER="wakeonlan-web" \
DATABASE_PASSWORD_FILE="$(pwd)/../database_password.txt" \
npm test
