
    CREATE TABLE IF NOT EXISTS urls (
    	id  SERIAL,
    	l_url VARCHAR(2048) NOT NULL,
    	s_url VARCHAR(64) NOT NULL,
    	c_cnt INT NOT NULL,
    	usr char(36),
        CONSTRAINT s_url_unique_cons UNIQUE (s_url)
    );
