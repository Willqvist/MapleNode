export default class Time
{
    static getTime()
    {
        let date = new Date();
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
}