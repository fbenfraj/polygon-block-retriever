-- initdb/init.sql
CREATE TABLE IF NOT EXISTS block (
  id SERIAL PRIMARY KEY,
  hash VARCHAR(66) NOT NULL,
  number VARCHAR(66) NOT NULL,
  parent_hash VARCHAR(66) NOT NULL,
  timestamp timestamp NOT NULL,
  forked BOOLEAN NOT NULL DEFAULT FALSE
);
