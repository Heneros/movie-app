FROM postgres:17.4

COPY ./postgresql.conf /etc/postgresql/postgresql.conf
COPY ./pg_hba.conf /etc/postgresql/pg_hba.conf

RUN chown postgres:postgres /etc/postgresql/pg_hba.conf \
    && chown postgres:postgres /etc/postgresql/postgresql.conf \
    && chmod 640 /etc/postgresql/pg_hba.conf \
    && chmod 640 /etc/postgresql/postgresql.conf

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]