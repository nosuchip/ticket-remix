CREATE USER {DB_MIGRATOR_USER} WITH PASSWORD '{DB_MIGRATOR_PASSWORD}';
ALTER DATABASE {DB_DATABASE} OWNER TO {DB_MIGRATOR_USER};