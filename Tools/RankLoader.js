const constants = require("../Tools/Constants");
const mysql = require("../Tools/mysql").getMysql();

class RankLoader
{
    static loadRank(body,callback)
    {
        let jobs = constants.getConstant("jobs");
        let whereString = "";
        let job;
        if(body.job)
            job = jobs[body.job];
        if(!body.max)
            body.max = 5;

        let whereStatement = "WHERE";
        let queryData = [];

        if(body.name && typeof body.name !== 'undefined')
        {
            whereString += ` ${whereStatement} name LIKE ?`;
            queryData.push("%" + body.name + "%");
            whereStatement = "AND";
        }
        if(body.job && body.job !== 'undefined' && body.job != -1)
        {
            whereString += ` ${whereStatement} job = ?`;
            queryData.push(body.job);
        }
        if(!body.page)
            body.page = 0;
        
        if(!body.order)
            body.order = "Level"; 

        queryData.push(Math.max(parseInt(body.page),0)*body.max);

        let sql = 
        `
        SELECT 
        player.name,
        player.level,
        player.job,
        player.fame,
        player.jobRank,
        player.rank
        FROM
            (SELECT 
                player.name,
                    player.level,
                    player.job,
                    player.fame,
                    player.rank,
                    @job:=CASE
                        WHEN job <> @prev THEN 1
                        ELSE @job + 1
                    END AS jobRank,
                    @prev:=job
            FROM
                (SELECT 
                name, level, job, fame, @rank:=@rank + 1 AS rank
            FROM
                characters, (SELECT @rank:=0, @job := 0, @prev := 'string') AS r
            ORDER BY ${body.order} DESC , NAME DESC) AS player
            ORDER BY player.job DESC , ${body.order} DESC) AS player ${whereString}
        ORDER BY ${body.order} DESC , name DESC LIMIT ${body.max} OFFSET ?
        `;
        setTimeout(()=>
        {
            mysql.connection.query(sql,queryData,(err,result)=>
            {
                if(err) throw err;

                let jobs = constants.getConstant("jobs");
                for(let i = 0; i < result.length; i++)
                    result[i].job = (!jobs[result[i].job]) ? "?" : jobs[result[i].job];
                callback(result);
            })
        },0);
    }
}
module.exports = RankLoader;