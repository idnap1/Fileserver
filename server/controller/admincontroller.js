const my_db = require("../db");
const logger = require("../logger/logger");

const getadmin = async (obj) => {
  let getAdminDetails;
  try {
    getAdminDetails = await my_db
      .getalluser(obj, "document_management")
      .then((data) => {
        logger.info("Your get was fetched sucessfully!!!");
        return data;
      })
      .catch((err) => {
        logger.error("error", "Your response from database");
        return err;
      });
  } catch (error) {
    console.log("OOPS!!!Error  from getdmin");
  }
  return getAdminDetails;
};
const deleteuser = async (id, rev) => {
  let deleteUserDetails;
  try {
    deleteUserDetails = await my_db
      .deleteuser(id, rev, "document_management")
      .then((data) => {
        logger.info("Your get was fetched sucessfully!!!");
        return data;
      })
      .catch((err) => {
        logger.error("error", "Your response from database");
        return err;
      });
  } catch (error) {
    console.log("OOPS!!!Error  from deleteuser ");
  }
  return deleteUserDetails;
};
module.exports = { getadmin, deleteuser };
