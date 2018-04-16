const constants = 
{
    prefix:""
};

function getConstant(constant)
{
    return constants[constant];
}
function setConstant(constant,value)
{
    constants[constant] = value;
}
module.exports=
{
    getConstant:getConstant,
    setConstant:setConstant
}