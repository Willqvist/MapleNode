const mysql = require("mysql2/promise");

w();
async function w() {

    let conn = await mysql.createConnection({
        user:"root",password:"",host:"localhost",database:"leaderms",multipleStatements:true
    });

    let [r,t] = await conn.query(`SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='leaderms' `);
    for(let i = 0; i < r.length; i++) {
        let obj = {};
        let table = r[i].TABLE_NAME;
        let [r1,t1] = await conn.query(`DESCRIBE ${table}`);
        console.log(`export interface ${capitalize(table.replace("mn_",""))}Interface {`);
        let j = 0;
        for(j = 0; j < r1.length; j++) {
            let name = r1[j].Field;
            let type = r1[j].Type;
            console.log("   "+name+"?: "+getType(type)+";");
        }
        console.log(`}`);
    }
}

function contains(str,vals) {
    for(let i = 0; i < vals.length; i++) {
        if(str.includes(vals[i]))
            return true;
    }
    return false;
}

function getType(type) {
    if(contains(type,["int"])) {
        return "number";
    }
    if(contains(type,["varchar","text"])) {
        return "string";
    }
    if(contains(type,["timestamp","date"])) {
        return "Date";
    }
    return "string"
}
console.log = function(d) {
    process.stdout.write(d + '\n');
};

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}