const Packet = require("./Packet");
const RankLoader = require("../tools/RankLoader");
class CharactersPacket extends Packet
{
    getCharacters()
    {
        return this.res.locals.characters;
    }

    onPageLoad(req,res,callback)
    {
        RankLoader.loadRank({max:5},((result)=>
        {
            res.locals.characters = result;
            callback();
        }).bind(res));
    }
}
module.exports = CharactersPacket;