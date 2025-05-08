FROM nginx:1.27.5-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/dev/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY docker/dev/nginx/nginx.conf /etc/nginx/nginx.conf