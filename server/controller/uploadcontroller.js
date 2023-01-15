const { async } = require("rxjs");
const my_db = require("../db");
const logger = require("../logger/logger");
const UploadForm = async (object) => {
  let uploadFormDetails;
  try {
    uploadFormDetails = await my_db
      .add(object, "document_management")
      .then((data) => {
        logger.info(`${object.file_name} uploaded successfully;`);
        return data;
      })
      .catch((err) => {
        logger.error("error", "Your response from database");
        return err;
      });
  } catch (error) {
    console.log("OOPS!!!Error");
  }
  return uploadFormDetails;
};
const showDocuments = async (object) => {
  let showDocumentsDetails;
  try {
    showDocumentsDetails = await my_db
      .getalluser(object, "document_management")
      .then((data) => {
        logger.info("Your Data was posted sucessfully!!!");
        return data;
      })
      .catch((err) => {
        logger.error("error", "Your response from database");
        return err;
      });
  } catch (error) {
    console.log("OOPS!!!Error");
  }
  return showDocumentsDetails;
};
module.exports = { UploadForm, showDocuments };
