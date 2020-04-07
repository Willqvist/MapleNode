-- SETUP SQL FILE

DROP TABLE IF EXISTS prefix_settings;
DROP TABLE IF EXISTS prefix_vote;
DROP TABLE IF EXISTS prefix_voting;
DROP TABLE IF EXISTS prefix_palettes;
DROP TABLE IF EXISTS prefix_design;
DROP TABLE IF EXISTS prefix_downloads;
DROP TABLE IF EXISTS prefix_layout;

CREATE TABLE prefix_settings
(
    ID int NOT NULL AUTO_INCREMENT,
    serverName varchar(255),
    version varchar(8),
    expRate varchar(8),
    dropRate varchar(8),
    mesoRate varchar(8),
    nxColumn varchar(8),
    vpColumn varchar(8),
    gmLevel int(1),
    PRIMARY KEY(ID)
);
CREATE TABLE prefix_vote
(
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    nx int(20),
    time varchar(255),
    url varchar(255),
    PRIMARY KEY(id)
);
CREATE TABLE prefix_voting
(
    ID int NOT NULL AUTO_INCREMENT,
    accountid int(22),
    voteid int(22),
    date timestamp,
    PRIMARY KEY(id)
);
CREATE TABLE prefix_palettes
(
    name varchar(255),
    mainColor varchar(20),
    secondaryMainColor varchar(20),
    fontColorLight varchar(20),
    fontColorDark varchar(20),
    fillColor varchar(20),
    active int(1),
    PRIMARY KEY(name)
);
CREATE TABLE prefix_design
(
    ID int NOT NULL AUTO_INCREMENT,
    heroImage varchar(80),
    logo varchar(80),
    PRIMARY KEY(id)
);
CREATE TABLE prefix_downloads
(
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(80),
    url varchar(80),
    PRIMARY KEY(id)
);
CREATE TABLE prefix_layout
(
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(22),
    json mediumtext,
    PRIMARY KEY(id)
);