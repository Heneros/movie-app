FROM postgres:17.4 

COPY ./postgresql_master.conf /etc/postgresql/postgresql.conf
COPY ./pg_hba_master.conf /etc/postgresql/pg_hba.conf


CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
