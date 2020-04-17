<p align="center">
    <img
      alt="MapleNode"
      src="https://i.imgur.com/kMAiROs.png"
      width="320"
    />
</p>


# MapleNode
MapleNode is a Maplestory CMS built using.
* [Node.js](https://nodejs.org/en/) 
* [Express](https://expressjs.com/)
* [Typescript](https://www.typescriptlang.org/)
* [EJS](https://ejs.co/)

## Notice
MapleNode is still in development and is not currently functional

## Installation
Before installing, [Download and Install Node.js](https://nodejs.org/en/download/) and setup a [MySQL](https://www.mysql.com/) database.

Download MapleNode 
```
$ git clone https://github.com/Willqvist/MapleNode.git
```
When files are downloaded, run the following command in project directory to build the server
```
$ npm run build
```
When the building is done the server is up and running on port 80 and visit `/setup` to start the website setup.

## Commands

### npm
To start the server:

```
$ npm start
```

To rebuild the code:
```
$ npm run compile
``` 

To compile and start server:
``` 
$ npm run cs
``` 

### MapleNode
. To stop the server. Either type `Ctrl+C` or
```$xslt
MapleNode> quit
```
and type **Y** when asked `Terminate batch job (Y/N)?`.

## Maple character image generator.
Maple character image generator is an application that generates a maple character image with information from the database. This application uses files provided by greenelfx. To download them visit the following link.

https://github.com/greenelfx/MapleBit/blob/master/assets/img/GD/GD%20v148.7z

Place the downloaded folders under ./MapleCharacterGenerator/items/


### How to use
```
{your url}/Character/{character name}.chr
```
This url will return a .png with the character.

[logo]: https://i.imgur.com/kMAiROs.png
