FROM node:18.19.0 as build
WORKDIR /app

COPY package* ./

RUN npm install --silent

COPY . .

COPY vite.config.js ./
RUN npm run build



FROM ubuntu:18.04

RUN apt update -y\
    && apt install nginx curl vim -y \
    && apt-get install software-properties-common -y \
    && add-apt-repository ppa:certbot/certbot -y \
    && apt-get update -y \
    && apt-get install python-certbot-nginx -y \
    && apt-get clean 

COPY --from=build /app/dist /var/www/react
COPY ./nginx/default.conf /etc/nginx/sites-available/default

EXPOSE 80
STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]