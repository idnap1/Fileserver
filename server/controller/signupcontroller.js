const my_db = require("../db");
const logger = require("../logger/logger");

const SignupForm = async (object) => {
  let SignupFormDetails;
  try {
    SignupFormDetails = await my_db
      .add(object, "document_management")
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
  return SignupFormDetails;
};

const getusers = async (obj) => {
  let getUsersDetails;
  try {
    getUsersDetails = await my_db
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
    console.log("OOPS!!!Error  from login");
  }
  return getUsersDetails;
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
    console.log("OOPS!!!Error  from login");
  }
  return deleteUserDetails;
};

module.exports = {
  SignupForm,
  getusers,
  deleteuser,
};
