export interface SetupInterface {
    mysqlSetupComplete : boolean;
    prefix?: string;
    done : boolean;
};

export interface PartsInterface {
    face? : number;
    hair?: number;
    skincolor?: number;
    cap?: number;
    mask?: number;
    eyes?: number;
    ears?: number;
    coat?: number;
    pants?: number;
    shoes?: number;
    glove?: number;
    cape?: number;
    shield?: number;
    weapon?: number;
    stand?: number;
}

export interface EquipmentInterface {
    itemid: number,
    position: number
}
