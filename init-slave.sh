#!/bin/bash
set -e

# Удаляем данные, если они есть
rm -rf /var/lib/postgresql/data/*

# Выполняем резервное копирование с мастера
pg_basebackup -h postgres-master -U replicator -D /var/lib/postgresql/data -P --wal-method=stream

# Настраиваем слейв
echo "standby_mode = 'on'" > /var/lib/postgresql/data/standby.signal
echo "primary_conninfo = 'host=postgres-master port=5432 user=replicator password=yourpassword'" >> /var/lib/postgresql/data/postgresql.conf