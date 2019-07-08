const fs = require('fs');
const async = require("async");
const packets = 
{
    UserPacket :require('./UserPacket'),
    CharactersPacket :require('./CharactersPacket')
}
const globalPackets =
[
    require("./Basic")
];
class PacketHandler
{
    static handlePackets(app,req,res,callback)
    {
        let meta_packets = PacketHandler.getPackets(req.originalUrl);
        if(!meta_packets || packets.length == 0)
            return;
        async.each(meta_packets,(meta_packet,callback)=>
        {
            let packet = PacketHandler.createPacket(meta_packet);
            let funcs = Object.getOwnPropertyNames(Object.getPrototypeOf(packet));
            if(!packet)
                throw "Could not find packet " + meta_packet;

            packet.init(app,req,res);
            funcs.forEach(func=>
             {
                if(func=="init" || func == "onPageLoad" || func.includes('server')) return;
                res.locals[func] = packet[func].bind(packet);
            });
            packet.onPageLoad(req,res,callback);
        },callback);
    }
    static setupGlobalPackets(app)
    {
        globalPackets.forEach(global_packet => {
            let packet = new global_packet();
            let funcs = Object.getOwnPropertyNames(Object.getPrototypeOf(packet));
            if(!packet)
                throw "Could not find packet " + meta_packet;

            packet.init(app);
            funcs.forEach(func=>
             {
                if(func=="init") return;
                app.locals[func] = packet[func].bind(packet);
            });
        });
    }
    static createPacket(packet)
    {
        try
        {
            return new packets[packet+"Packet"]();
        }
        catch(error)
        {
            throw "Could not find packet " + packet + " in packets folder";
        }
    }
    static getPackets(path)
    {
        if(!PacketHandler.meta.packets[path]) return PacketHandler.meta.packets["*"];
        return [...PacketHandler.meta.packets[path],...PacketHandler.meta.packets["*"]];
    }
    static setup()
    {
        PacketHandler.meta = JSON.parse(fs.readFileSync("./public_meta/meta_data.json"));
    }
}
module.exports = PacketHandler;