-- SETUP SQL FILE;

DROP TABLE IF EXISTS prefix_settings;
DROP TABLE IF EXISTS prefix_vote;
DROP TABLE IF EXISTS prefix_voting;
DROP TABLE IF EXISTS prefix_palettes;
DROP TABLE IF EXISTS prefix_downloads;
DROP TABLE IF EXISTS prefix_layout;
DROP TABLE IF EXISTS prefix_file_tags;
DROP TABLE IF EXISTS prefix_tags;
DROP TABLE IF EXISTS prefix_files;
DROP TABLE IF EXISTS prefix_logs;
DROP TABLE IF EXISTS prefix_download_urls;

CREATE TABLE prefix_settings
(
    ID INT NOT NULL AUTO_INCREMENT,
    serverName VARCHAR(255),
    version VARCHAR(8),
    expRate VARCHAR(8),
    dropRate VARCHAR(8),
    mesoRate VARCHAR(8),
    nxColumn VARCHAR(8),
    vpColumn VARCHAR(8),
    gmLevel INT(1),
    PRIMARY KEY(ID)
);
CREATE TABLE prefix_vote
(
    ID INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    nx INT(20),
    time VARCHAR(255),
    url VARCHAR(255),
    PRIMARY KEY(id)
);
CREATE TABLE prefix_voting
(
    ID INT NOT NULL AUTO_INCREMENT,
    ip VARCHAR(255),
    accountid INT(22),
    voteid INT(22),
    date TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE TABLE prefix_palettes
(
    name VARCHAR(255),
    mainColor VARCHAR(20),
    secondaryMainColor VARCHAR(20),
    fontColorLight VARCHAR(20),
    fontColorDark VARCHAR(20),
    fillColor VARCHAR(20),
    active INT(1),
    PRIMARY KEY(name)
);
CREATE TABLE prefix_files
(
    file VARCHAR(180) NOT NULL,
    upload TIMESTAMP,
    PRIMARY KEY(file)
);
CREATE TABLE prefix_logs
(
    id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(120),
    creation TIMESTAMP,
    body VARCHAR(255),
    PRIMARY KEY(id)
);
CREATE TABLE prefix_tags
(
    tag VARCHAR(80) NOT NULL,
    PRIMARY KEY(tag)
);
CREATE TABLE prefix_file_tags
(
    file VARCHAR(180) NOT NULL,
    tag VARCHAR(80) NOT NULL,
    PRIMARY KEY(file, tag),
    FOREIGN KEY (file) REFERENCES prefix_files(file) ON DELETE CASCADE,
    FOREIGN KEY (tag) REFERENCES prefix_tags(tag) ON DELETE CASCADE
);
CREATE TABLE prefix_downloads
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(80),
    description VARCHAR(255),
    image VARCHAR(180) NOT NULL,
    FOREIGN KEY(image) REFERENCES prefix_files(file),
    PRIMARY KEY(id)
);
CREATE TABLE prefix_download_urls
(
    downloadId INT NOT NULL,
    url VARCHAR(110) NOT NULL,
    PRIMARY KEY(downloadId, url),
    FOREIGN KEY (downloadId) REFERENCES prefix_downloads(id) ON DELETE CASCADE
);
CREATE TABLE prefix_layout
(
    ID INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(22),
    json mediumtext,
    PRIMARY KEY(id)
);
