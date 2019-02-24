const Constants = require("./CryptoConstants");
const crypto = require("crypto");
class Tools
{
    RotateLeft(x, n)
    {
        return (((x) << (n)) | ((x) >> (32 - (n))));
    }
    getIVKeyByVersion(version)
    {
        switch (version)
        {
            case Constants.versions.EMS:
                return Constants.WZ_MSEAIV;//?
            case Constants.versions.GMS:
                return Constants.WZ_GMSIV;
            case Constants.versions.BMS:
            case Constants.versions.CLASSIC:
            default:

                return new Uint8Array(4);
        }
    }
    GenerateWzKey(key)
    {
        return this.GenerateWzKeyAes(key,Constants.getTrimmedUserKey());
    }
    GenerateWzKeyAes(WzIv,aesKey)
    {
        let key = aesKey;
        let iv = Buffer.alloc(16, 0);
        let cipher = crypto.createCipheriv("aes-256-ecb",Buffer.from(aesKey),'',iv);
        cipher.setAutoPadding(false);
        let input = this.multiplyBytes(WzIv,4,4);
        let wzKey = new Uint8Array(65535);

        for(let i = 0; i < wzKey.length/16; i++)
        {
            input = cipher.update(input);
            this.copy(input,0,wzKey,i*16,16);
        }
        input = cipher.update(input);
        this.copy(input,0,wzKey,(wzKey.length-15),15);
        cipher.final();
        console.log("wz key length: ",wzKey.length);
        return wzKey;
    }

    copy(arr,i,dest,desti,len)
    {
        for(let j = i; j < len; j++)
        {
            dest[desti+j] = arr[j];
        }
    }
    multiplyBytes(input, count, mult)
		{
			let ret = new Uint8Array(count * mult);
			for (let x = 0; x < ret.length; x++)
			{
				ret[x] = input[x % count];
			}
			return ret;
		}
}
module.exports = new Tools();