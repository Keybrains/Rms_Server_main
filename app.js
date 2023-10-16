var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var dbCollation = require("./db");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var RegisterRouter = require("./routes/Register");
var RentalsRouter = require("./routes/Rentals");
var NewPropartyRouter = require("./routes/NewPropaty");
var TenantsRouter = require("./routes/Tenants");
var AddStaffMember = require ("./routes/AddStaffMember");
var RentalOwners = require ("./routes/RentalOwners");
var ApplicantRouter = require ("./routes/Applicants");
var AgentRouter = require ("./routes/Addagent")
var VendorRouter = require ("./routes/Vendor");
var WorkorderRouter = require ("./routes/Workorder");
var AccountRouter = require ("./routes/AddAccount");
var LedgerRouter = require ("./routes/Ledger");
var NotificationRouter = require ("./routes/Notification");
var UploadFile = require ("./routes/UploadFile");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter); 
app.use("/register", RegisterRouter);
app.use("/rentals", RentalsRouter);
app.use("/newproparty", NewPropartyRouter);
app.use("/tenant", TenantsRouter);
app.use("/addstaffmember",AddStaffMember);
app.use("/rentalowner",RentalOwners);
app.use("/applicant",ApplicantRouter);
app.use("/addagent",AgentRouter);
app.use("/addaccount",AccountRouter);
app.use("/vendor",VendorRouter);
app.use("/workorder",WorkorderRouter);
app.use("/ledger",LedgerRouter);
app.use("/notification",NotificationRouter);
app.use("/uploadfile",UploadFile);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
