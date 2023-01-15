const my_db = require("../db");
const logger = require("../logger/logger");
const renameDocuments = async (object) => {
  let renameDocumentsDetails;
  try {
    renameDocumentsDetails = await my_db
      .add(object, "document_management")
      .then((data) => {
        logger.info(` updated successfully;`);
        return data;
      })
      .catch((err) => {
        logger.error("error", "Your response from database");
        return err;
      });
  } catch (error) {
    console.log("OOPS!!!Error");
  }
  return renameDocumentsDetails;
};
module.exports = {
  renameDocuments,
};
