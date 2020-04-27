const fs = require('fs');
let Papa = require('papaparse');
const streamifier = require('streamifier');

module.exports = {

    //read https://www.papaparse.com/docs#config for info about config
    parse : (file, filename, config) => {
        file = streamifier.createReadStream(file.buffer);
        return new Promise((resolve, reject) =>{
            config.complete = function (results) {
                if (results.errors === undefined || (results.errors).length === 0) {
                    resolve(results.data);
                }else {
                    reject(filename + " couldn't be parsed, please check if there's something wrong with it.");
                }},

            Papa.parse(file , config);
        })
    },

    readFile : (path, options) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, options, (err, file) => {
                if (err) return reject(err)
                resolve(file)
            })
        })
    }
}
