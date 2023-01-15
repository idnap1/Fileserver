const nano = require("nano");

let nano_url =
  "https://apikey-v2-kf8ex4frj52lu2wwin72qqktpi3occ9bfv4p80vbr99:68fc5b9dc8c58071087abaecc44a5f29@2fbcb9ec-d57d-431a-8d72-186d88ddf478-bluemix.cloudantnosqldb.appdomain.cloud";

let nanodb = nano(nano_url);
let add = function (value, dbname) {
  return new Promise((resolve, reject) => {
    if (value == undefined) {
      return reject(value);
    } else {
      let db = nanodb.use(dbname).insert(value);
      return resolve(db);
    }
  });
};

let getalluser = function (value, dbname) {
  return new Promise((resolve, reject) => {
    if (value == undefined) {
      return reject(value);
    } else {
      let db = nanodb.use(dbname).find(value);
      return resolve(db);
    }
  });
};
let deleteuser = function (id, id1, dbname) {
  return new Promise((resolve, reject) => {
    if (id == undefined || id1 == undefined) {
      return reject(id, id1);
    } else {
      let db = nanodb.use(dbname).destroy(id, id1);
      return resolve(db);
    }
  });
};
module.exports = { add, getalluser, deleteuser };
