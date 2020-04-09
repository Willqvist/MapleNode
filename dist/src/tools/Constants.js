"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants = {
    prefix: ""
};
function getConstant(constant) {
    return constants[constant];
}
exports.getConstant = getConstant;
function setConstant(constant, value) {
    constants[constant] = value;
}
exports.setConstant = setConstant;
//instansiating constants
setConstant("jobs", {
    '-1': "Overall",
    '100': "Mage",
    '0': "Beginner",
    '200': "Warrior",
});
setConstant("jobMethod", (jobs, name) => {
    for (let key in jobs) {
        if (jobs[key] === name)
            return key;
    }
    return -1;
});
setConstant("type_mapper", {
    "Consume": "Item",
    "Etc": "Item",
    "Cash": "Item",
    "Pet": "Item",
    "Install": "Item",
    "Equip": "Eqp",
    "Eqp": "Eqp",
    "Mob": "Mob"
});
setConstant("icon_mapper", {
    "Item": "icon",
    "Eqp": "icon",
    "Mob": "stand_0"
});
setConstant("MCG", "Xml");
//# sourceMappingURL=Constants.js.map