let dbAPI = require('./database_API');
let collection = "total_stats";
let query;

module.exports = {

    initialize : function () {
        MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
            if (err) throw err;

            let total_stats = {
                _id: "total_stats",
                POI: {
                    EntranceReubenHecht: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    SymbolsJewishMenorah: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    PersianCult: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    JerusalemPhoto: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    MaterialCultures: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    MuseumMotto: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    EntranceGallileeRebellion: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    DuckBoxIvories: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    CanaaniteStelae: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    IvoryWomanPhoenician: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    ClayAmphorae: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    AnimalModels: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    LeadCoffinMosaic: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    ChalcolitePeriod: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    JewishCoffins: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Anthropoids: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    DecoratedDoors: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    MenorahJewishEpigraphy: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    StairsToBathroom: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    ShipEntrance: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    ShipFront: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    ShipBack: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    MaritimeArcheology: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Pottery: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    CarpenterTools: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    BronzeTools: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    StoneVesselsBowl: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    MosaicfromSynagogue: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Phoenicians: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    GlassOvenVessels: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    WoodenTools: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    RomanDivinitiesStatuettes: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    ImportedPottery: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    CraftsAndArts: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    ReligionAndCult: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    EverydayPottery: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    PhoenicianWriting1: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    BurialTradition2: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    MaritimeCommerce: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    BuildingMethodsAndFacilities: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Coins: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    SevenSpecies: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Weights: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Gems: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Cyprus: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    GreeceEgypt: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Jerusalem: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    TempleMount: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    OilLamps: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    UpperFloorEntrance: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Elevator1: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                    Elevator2: {
                        total_attraction_power: 0,
                        total_holding_power: 0,
                        days_of_exposition: 0
                    },
                },
                number_of_groups: 0,
                number_of_visitors: 0,
                average_group_size: 0,
                average_group_time_in_museum: 0,
                average_visitor_time_in_museum: 0,
                average_watched_presentations: 0
            };

            dbo.collection("total_stats").insertOne(total_stats, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },

    getTotalStats : function (){
        return new Promise(async function(resolve, reject) {
            query = {_id: "total_stats"};
            await dbAPI.getDocument(query, collection).then((totalStats) => {
                resolve(totalStats[0]);
            });
        });
    },

    updateTotalStats: function (stats){
        query = {_id: "total_stats"};
        let newValues = { $set: stats };
        dbAPI.updateElseInsertDocument(query, newValues, collection);
    }
};