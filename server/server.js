const fs = require("fs");
const connection = require("express");
const signupcontroller = require("./controller/signupcontroller");
const admincontroller = require("./controller/admincontroller");
const uploadcontroller = require("./controller/uploadcontroller");
const renamecontroller = require("./controller/renamecontroller");
const bodyparser = require("body-parser");
const multer = require("multer");
const app = connection();
const nodemail = require("nodemailer");
const winlogger = require("./logger/logger");
const Cloudant = require("@cloudant/cloudant");
let url =
    "https://2fbcb9ec-d57d-431a-8d72-186d88ddf478-bluemix.cloudantnosqldb.appdomain.cloud";
let username = "apikey-v2-kf8ex4frj52lu2wwin72qqktpi3occ9bfv4p80vbr99";
let password = "68fc5b9dc8c58071087abaecc44a5f29";
let cloudant = Cloudant({ url: url, username: username, password: password });
const path = require("path");
const downloadPackage = require("download");
const port = 8000;
const cors = require("cors");
const dbconnection = require("./db");

const e = require("express");

const logger = require("./logger/logger");
app.use(connection.static("public"));
const otpGenerator = require("otp-generator");

app.use(bodyparser.json());
app.use(
    cors({
        origin: "http://localhost:4200",
    })
);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-authname");
    next();
});
let urlParser = bodyparser.urlencoded({ extended: false });
app.post("/dashboard", (request, response) => {
    let object = {
        username: request.body.username,
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        email: request.body.email,
        password: request.body.password,
        confirm_password: request.body.confirm_password,
        type: "user",
    };
    signupcontroller
        .SignupForm(object)
        .then((res) => {
            logger.info("Signup form added");
            response.send(res);
        })
        .catch((err) => {
            logger.warn("error ");
            response.send(err, "Faild to upload");
        });
});
app.get("/getUser", (_request, response) => {
    let data = {
        selector: {
            type: "user",
        },
    };
    signupcontroller
        .getusers(data)
        .then((res) => {
            logger.info(" Login - user data successfully fetched");
            response.send(res);
        })
        .catch((err) => {
            logger.warn("error");
            response.send(err, " login Faild  to get");
        });
});
app.delete("/delete_items/:id/:id1", (request, response) => {
    admincontroller
        .deleteuser(request.params.id, request.params.id1)
        .then((res) => {
            logger.info(" Delete Admin users - user data successfully deleted");
            response.send(res);
        })
        .catch((err) => {
            logger.warn("error");
            response.send(err, " login Faild  to get");
        });
});
app.get("/getAdminId", (_request, response) => {
    logger.info("fetching Admin Details");
    let data = {
        selector: {
            type: "admin",
        },
    };
    admincontroller
        .getadmin(data)
        .then((res) => {
            logger.info(" AdminLogin - Admin data successfully fetched");
            response.send(res);
        })
        .catch((err) => {
            logger.warn("error");
            response.send(err, " adminlogin Failed  to get");
        });
});
app.post("/username", (request, response) => {
    let folderName = request.body.username;
    if (!fs.existsSync(path.join(__dirname, "public"))) {
        fs.mkdirSync(path.join(__dirname, "public"));
    }
    if (!fs.existsSync(path.join(__dirname, "public/Uploads"))) {
        fs.mkdirSync(path.join(__dirname, "public/Uploads"));
    }
    if (fs.existsSync(path.join(__dirname, "public/uploads", folderName))) {
        logger.info("Folder already exist");
    } else {
        fs.mkdirSync(path.join(__dirname, "public/Uploads", folderName));
        logger.info(`${folderName} folder created`);
    }
});
app.post("/single", (req, res) => {
    var originalName;
    var pathtype;
    let storefoldername = req.headers["x-authname"];
    let store = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(__dirname, "public/Uploads", storefoldername));
        },
        filename: function(req, file, cb) {
            originalName = file.originalname;
            pathtype = file.mimetype;
            cb(null, originalName);
            logger.info(originalName + " uploaded");
        },
    });
    let upload = multer({ storage: store }).single("image");
    upload(req, res, function(err) {
        if (err) {
            res.send({ status: 500, error: "Unable to process your request!" });
        } else {
            let fileDetails = {
                file_name: originalName,
                file_type: pathtype,
                user_id: storefoldername,
                filepath: path.join(
                    "Personal_document_management\\PersonalDocumentManagement\\server\\public\\Uploads",
                    `${storefoldername}`
                ),
                type: "files",
            };
            console.log(fileDetails);
            uploadcontroller
                .UploadForm(fileDetails)
                .then((data) => {
                    logger.info("Uploaded successfully");
                    response.send(data);
                })
                .catch((err) => {
                    logger.warn(err);
                });
            res.send({
                status: 200,
                error: "Success!",
                // originalname: originalname,
            });
        }
    });
});
app.post("/userfiles", (request, response) => {
    username = request.body.username;
    let data = {
        selector: {
            user_id: username,
        },
    };
    uploadcontroller
        .showDocuments(data)
        .then((res) => {
            logger.info(" Document show -  data successfully fetched");
            response.send(res);
        })
        .catch((err) => {
            logger.warn("error");
            response.send(err, " Document  Failed  to get");
        });
});
app.post("/download", (request, response) => {
    let downloadpath = request.body.filepath;
    let downloadFilename = request.body.filename;
    let filess = `D:\\${downloadpath}\\${downloadFilename}`;
    response.download(filess);
});
app.post("/localdelete", (request, response) => {
    let deletepath = request.body.filepath;
    let deleteFilename = request.body.filename;
    let filess = `D:\\${deletepath}\\${deleteFilename}`;
    fs.unlinkSync(filess);
    logger.info(`${deleteFilename} deleted`);
    response.send("file deleted sucesfully");
});
app.post("/localrename", (request, response) => {
    let oldpath = request.body.oldfilepath;
    let oldfilename = request.body.oldfilename;
    let extension = oldfilename.split(".");
    let ext = extension[1];
    let newpath = request.body.newpath;
    let oldname = "D:\\" + oldpath + "\\" + oldfilename;
    let newname = "D:\\" + oldpath + "\\" + newpath + "." + ext;
    fs.rename(oldname, newname, () => {
        logger.info("file renamed successfully");
    });
    let newfilename = newpath + "." + ext;
    let newobject = {
        _id: request.body.oldid,
        _rev: request.body.oldrev,
        file_name: newfilename,
        file_type: request.body.oldtype,
        user_id: request.body.olduserid,
        filepath: request.body.oldfilepath,
        fileDetails: "received",
        type: request.body.type,
    };
    renamecontroller
        .renameDocuments(newobject)
        .then((res) => {
            logger.info(" Document rename -  data successfully fetched");
            response.send(res);
        })
        .catch((err) => {
            logger.warn("error");
            response.send(err, " Document  Failed  to rename");
        });
});
app.post("/share", (request, response) => {
    let receiverFolder = request.body.receiverdetails;
    console.log(receiverFolder);
    let store = multer.diskStorage({
        destination: function(req, _file, cb) {
            cb(null, path.join(__dirname, "public/Uploads", receiverFolder));
        },
        filename: function(req, file, cb) {
            let originalname = file.originalname;
            let pathtype = file.mimetype;
            cb(null, originalname, pathtype);
            logger.info(originalname + " uploaded");
            let fileDetails = {
                file_name: originalname,
                file_type: pathtype,
                user_id: receiverFolder,
                filepath: path.join(
                    "Personal_document_management\\PersonalDocumentManagement\\server\\public\\Uploads",
                    `${receiverFolder}`
                ),
                type: "files",
            };
            uploadcontroller
                .UploadForm(fileDetails)
                .then((data) => {
                    logger.info("Uploaded successfully");
                    response.send(data);
                })
                .catch((err) => {
                    logger.warn(err);
                });
        },
    });
    let uploadfile = multer({ storage: store }).single("image");

    uploadfile((_req, res) => {
        if (err) {
            res.send({ status: 500, error: "Unable to process your request!" });
        } else {
            res.send({
                status: 200,
                error: "Success!",
            });
        }
    });
});
// upload(req, res, function (err) {
//   if (err) {
//     res.send({ status: 500, error: "Unable to process your request!" });
//   } else {
//     res.send({
//       status: 200,
//       error: "Success!",
//     });
//   }
// });
// });
app.post("/sendemail", (request, response) => {
    // let otp = otpGenerator.generate(6, {
    //   upperCaseAlphabets: false,
    //   specialChars: false,
    //   lowerCaseAlphabets: false,
    //   digits: true,
    // });
    // console.log(otp);
    // var sender = nodemail.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: "filetransify@gmail.com",
    //     pass: "mtpknobhzxfjrcck",
    //   },
    // });
    // var composemail = {
    //   from: "filetransify@gmail.com",
    //   to: request.body.emailId,
    //   subject: `Message`,
    //   text: `DON'T SHARE:\nYour OTP for File Transfer:${otp}`,
    // };
    // sender.sendMail(composemail, function (err, res) {
    //   if (err) {
    //     console.log("Mail not sent", err);
    //   } else {
    //     console.log("Mail  sent", res);
    //     response.send(otp);
    //   }
    // });
});

app.listen(port, (err) => {
    if (err) {
        return console.log("something bad happened", err);
    }
    winlogger.info("SUCCESS", "Server is running!!!");
    console.log(`server is listening on http://localhost:${port}`);
});