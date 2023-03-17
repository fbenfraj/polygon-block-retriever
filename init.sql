-- initdb/init.sql
CREATE TABLE IF NOT EXISTS block (
  id SERIAL PRIMARY KEY,
  hash VARCHAR(66) NOT NULL,
  parent_hash VARCHAR(66) NOT NULL,
  timestamp VARCHAR(66) NOT NULL,
  forked BOOLEAN NOT NULL DEFAULT FALSE
);
