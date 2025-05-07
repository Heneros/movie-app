FROM nginx:1.27.3-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/prod/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY docker/prod/nginx/nginx.conf /etc/nginx/nginx.conf

