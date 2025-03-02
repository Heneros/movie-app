FROM postgres:latest


COPY ./postgresql.conf /etc/postgresql/postgresql.conf
COPY ./pg_hba.conf /etc/postgresql/pg_hba.conf

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf", "-c", "hot_standby=on"]
