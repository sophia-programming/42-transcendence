FROM nginx

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./frontend /static/

# HTTPS config
RUN apt-get update -y && apt-get install openssl

RUN mkdir -p /etc/ssl/certs/ && mkdir -p /etc/ssl/private/

RUN openssl genpkey -algorithm RSA -out /etc/ssl/private/key.pem && \
    openssl req -new -key /etc/ssl/private/key.pem -out /etc/ssl/private/csr.pem -subj "/C=JP/ST=Tokyo/L=Shinjuku/O=42Tokyo/OU=TranscendenceTeam/CN=42pong.com" && \
    openssl x509 -req -days 365 -in /etc/ssl/private/csr.pem -signkey /etc/ssl/private/key.pem -out /etc/ssl/certs/cert.pem
