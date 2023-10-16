var express = require("express");
var router = express.Router();
var Applicant = require("../modals/Applicants");

  //   Add  applicant
router.post("/applicant", async (req, res) => {
    try {
  
      var data = await Applicant.create(req.body);
      res.json({
        statusCode: 200,
        data: data,
        message: "Add Applicant Successfully",
      });
    } catch (error) {
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  });


  // get  applicant
  router.get("/applicant", async (req, res) => {
    try {
      var data = await Applicant.find();
      res.json({
        data: data,
        statusCode: 200,
        message: "Read All applicant",
      });
    } catch (error) {
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  });

// delete Applicant
  router.delete("/applicant", async (req, res) => {
    try {
      let result = await Applicant.deleteMany({
        _id: { $in: req.body },
      });
      res.json({
        statusCode: 200,
        data: result,
        message: "applicant Deleted Successfully",
      });
    } catch (err) {
      res.json({
        statusCode: 500,
        message: err.message,
      });
    }
  });

   //edit rentals 
 router.put("/applicant/:id", async (req, res) => {
  try {
    let result = await Applicant.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      statusCode: 200,
      data: result,
      message: "applicant Data Updated Successfully",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});




module.exports = router;