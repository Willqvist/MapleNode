export interface ErrnoConversion {
    error(code:any) : string;
}

class ConverterImp implements ErrnoConversion {
    private data : {[key:string]:string};
    constructor(data) {
        this.data = data;
    }

    error(code: any): string {
        if(!this.data[code]) {
            return this.data["default"];
        }
        return this.data[code];
    }

}

export const ServerListenError = transform(
    {
        "EADDRINUSE":"Port already in use!",
        "default":null,
    }
);

function transform(data: {[key:string]:string}) : ErrnoConversion {
    return new ConverterImp(data);
}