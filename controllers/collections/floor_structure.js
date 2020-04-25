let POIRoomLocation =  {
    EntranceReubenHecht: {
        room: 1
    },
    SymbolsJewishMenorah: {
        room: 1
    },
    PersianCult: {
        room: 1
    },
    JerusalemPhoto: {
        room: 1
    },
    MaterialCultures: {
        room: 7
    },
    MuseumMotto: {
        room: 2
    },
    EntranceGallileeRebellion: {
        room: 2
    },
    DuckBoxIvories: {
        room: 2
    },
    CanaaniteStelae: {
        room: 2
    },
    IvoryWomanPhoenician: {
        room: 2
    },
    ClayAmphorae: {
        room: 2
    },
    AnimalModels: {
        room: 2
    },
    LeadCoffinMosaic: {
        room: 7
    },
    ChalcolitePeriod: {
        room: 7
    },
    JewishCoffins: {
        room: 7
    },
    Anthropoids: {
        room: 7
    },
    DecoratedDoors: {
        room: 7
    },
    MenorahJewishEpigraphy: {
        room: 7
    },
    StairsToBathroom: {
        room: 3
    },
    ShipEntrance: {
        room: 5
    },
    ShipFront: {
        room: 5
    },
    ShipBack: {
        room: 5
    },
    MaritimeArcheology: {
        room: 5
    },
    Pottery: {
        room: 5
    },
    CarpenterTools: {
        room: 5
    },
    BronzeTools: {
        room: 3
    },
    StoneVesselsBowl: {
        room: 3
    },
    MosaicfromSynagogue: {
        room: 3
    },
    Phoenicians: {
        room: 4
    },
    GlassOvenVessels: {
        room: 3
    },
    WoodenTools: {
        room: 3
    },
    RomanDivinitiesStatuettes: {
        room: 7
    },
    ImportedPottery: {
        room: 4
    },
    CraftsAndArts: {
        room: 4
    },
    ReligionAndCult: {
        room: 4
    },
    EverydayPottery: {
        room: 4
    },
    PhoenicianWriting1: {
        room: 4
    },
    BurialTradition2: {
        room: 4
    },
    MaritimeCommerce: {
        room: 4
    },
    BuildingMethodsAndFacilities: {
        room: 4
    },
    Coins: {
        room: 6
    },
    SevenSpecies: {
        room: 6
    },
    Weights: {
        room: 6
    },
    Gems: {
        room: 6
    },
    Cyprus: {
        room: 6
    },
    GreeceEgypt: {
        room: 6
    },
    Jerusalem: {
        room: 6
    },
    TempleMount: {
        room: 6
    },
    OilLamps: {
        room: 6
    },
    UpperFloorEntrance: {
        room: 6
    },
    Elevator1: {
        room: 2
    },
    Elevator2: {
        room: 6
    },
    ShipBigScreen:{
        room: 5
    }
};


module.exports ={
    getRoom: function(POI){
        return POIRoomLocation[POI].room;
    }
}