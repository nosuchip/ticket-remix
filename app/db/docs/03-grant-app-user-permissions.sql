GRANT CONNECT ON DATABASE {DB_DATABASE} TO {DB_APP_USER};
GRANT USAGE ON SCHEMA public TO {DB_APP_USER};
GRANT ALL ON ALL TABLES IN SCHEMA public TO {DB_APP_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON TABLES TO {DB_APP_USER};