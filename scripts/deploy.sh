#!/usr/bin/env bash

BRANCH=$(git branch --show-current)
TIMESTAMP=$(date +"%Y%m%d--%H%M")

BACKUP_DIR="$PWD/deploy/$TIMESTAMP"
BACKUP_BASE="backup.tar.gz"
BACKUP_FILE="$BACKUP_DIR/$BACKUP_BASE"

REMOTE_HOST=${1:-ekb71}

XRED="\033[31;1m"
XGREEN="\033[32;1m"

x() {
  echo -ne " + $@.."
}
ok() {
  echo -e "${XGREEN}done\033[0m"
}
fail() {
  echo "${XRED}fail\033[0m"
  exit 1
}

try() {
  COMMAND="$1"
  MESSAGE="$2"

  x $MESSAGE
  if [[ "$COMMAND" != "" ]]; then
    if eval "$COMMAND"; then
      ok
    else
      fail
    fi
  else
    echo ""
  fi
}

echo " > Current branch: $BRANCH"
echo " > Timestamp: $TIMESTAMP"

if [[ "$BRANCH" == "master" ]]; then
  echo " > Let's deploy, then"
  echo ""

  rm -rf "./deploy"
  mkdir -p "$BACKUP_DIR"

  cd stages/display_buildings/
  try "npm run build >/dev/null 2>&1" "Build javascript with vite"

  cd - >/dev/null 2>&1

  tar -cz -f "$BACKUP_FILE" -C "$PWD/stages/display_buildings/dist" .

  try "scp $BACKUP_FILE $REMOTE_HOST:~/frontend/ >/dev/null 2>&1" "Copying $BACKUP_BASE onto host"
  # echo -ne " * Copying $BACKUP_BASE onto host."
  # scp "$BACKUP_FILE" $REMOTE_HOST:~/frontend/ >/dev/null 2>&1
  # echo ".done"

  try "scp ./scripts/nginx/nginx.conf $REMOTE_HOST:~/frontend/ >/dev/null 2>&1" "Copying nginx.conf to frontend"

  x "Building volume with docker."
  ssh $REMOTE_HOST "
    # Очистка volume перед распаковкой
    cd /home/ekb3d/frontend &&
      docker stop nginx-app &&
      docker rm nginx-app &&
      docker run --rm -v excursion-gpt-frontend:/app/data alpine sh -c 'rm -rf /app/data/* /app/data/.[!.]* /app/data/..?* || true' &&
      docker run --rm -v excursion-gpt-frontend:/app/data -v /home/ekb3d/frontend:/backup alpine tar xzf /backup/backup.tar.gz -C /app/data &&
      docker run -d --name nginx-app -p 3000:3000 -v ./nginx.conf:/etc/nginx/conf.d/default.conf:ro -v excursion-gpt-frontend:/app/data:ro nginx:alpine
  " >/dev/null 2>&1
  ok
else
  echo " ! No deploys from $BRANCH"
  echo " > only from master"
fi
