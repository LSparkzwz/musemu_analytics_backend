const fs = require('fs');
let Papa = require('papaparse');

function parseFile(filename) {

    const file = fs.createReadStream('visitors_log/visitor_278_203.csv');

    Papa.parse(file, {
        complete: function (results) {
            console.log(results);
        }
    });
}

