-- SETUP SQL FILE;

DROP TABLE IF EXISTS prefix_settings;
DROP TABLE IF EXISTS prefix_vote;
DROP TABLE IF EXISTS prefix_voting;
DROP TABLE IF EXISTS prefix_palettes;
DROP TABLE IF EXISTS prefix_downloads;
DROP TABLE IF EXISTS prefix_layout;
DROP TABLE IF EXISTS prefix_file_tags;
DROP TABLE IF EXISTS prefix_files;

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
    file VARCHAR(180),
    upload TIMESTAMP,
    PRIMARY KEY(file)
);
CREATE TABLE prefix_file_tags
(
    file VARCHAR(180),
    tag VARCHAR(80),
    PRIMARY KEY(file, tag),
    FOREIGN KEY (file)
                REFERENCES prefix_files(file)
);
CREATE TABLE prefix_downloads
(
    ID INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(80),
    url VARCHAR(80),
    PRIMARY KEY(id)
);
CREATE TABLE prefix_layout
(
    ID INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(22),
    json mediumtext,
    PRIMARY KEY(id)
);
