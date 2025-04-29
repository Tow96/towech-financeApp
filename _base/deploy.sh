#!/bin/bash

git reset --hard

read -p 'IP Address that will hold the complete app: ' ipAddr
echo 'FRONTEND=http://'$ipAddr':3000' >> ./environments/UserService.env
echo 'CORS_ORIGIN=http://'$ipAddr':3001' >> ./environments/WebAPI.env

read -p 'Email account the app will use: ' email
echo 'EMAIL='$email >> ./environments/UserService.env

read -p 'Email Client Id: ' email_client_id
echo 'EMAIL_CLIENT_ID='$email_client_id >> ./environments/UserService.env

read -p 'Email Client Secret: ' email_client_secret
echo 'EMAIL_CLIENT_SECRET='$email_client_secret >> ./environments/UserService.env

read -p 'Email Refresh Token: ' email_refresh_token
echo 'EMAIL_REFRESH_TOKEN='$email_refresh_token >> ./environments/UserService.env

# Deletes the WebClient folder to re-download it
if [ -d "./WebClient"]; then
  rm -r ./WebClient
fi

# Define variables to be used later
git_path="https://github.com/towech-financeApp/WebClient"

# Fetches the WebClient to build with the correct arguments
git clone --depth=1 --branch master $git_path ./WebClient
rc=$?; if [[$rc != 0]]; then exit $rc; fi

# Check if the script was able to pull the code
if [ ! -d "./WebClient"]; then
  echo "The script could not get the code from git. Quitting..."
  exit 1
fi

echo "Cleaning previous containers"
docker container rm -f mongo rabbitmq user-worker1 transaction-worker1 category-worker1 web-api1 web-client1 2> /dev/null || true

echo "Building docker containers"
docker compose build --build-arg REACT_APP_WEBAPI=http://$ipAddr:3001

echo "Initiating docker compose"
docker compose up -d

# TODO: Add example categories
