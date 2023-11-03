
var express = require("express");
var router = express.Router();
var Payment = require("../../modals/Payment");

  //   Add  Payment
router.post("/add_payment", async (req, res) => {
    try {
  
      var data = await Payment.create(req.body);
      res.json({
        statusCode: 200,
        data: data,
        message: "Add payment Successfully",
      });
    } catch (error) {
      res.json({
        statusCode: 500,
        message: error.message,
      });
    } 
  });


    // get  Payment
    router.get("/payment", async (req, res) => {
        try {
          var data = await Payment.find();
          res.json({
            data: data,
            statusCode: 200,
            message: "Read All Payments",
          });
        } catch (error) {
          res.json({
            statusCode: 500,
            message: error.message,
          });
        }
      });
    
    // delete Payment
      router.delete("/Payment", async (req, res) => {
        try {
          let result = await Payment.deleteMany({
            _id: { $in: req.body },
          });
          res.json({
            statusCode: 200,
            data: result,
            message: "Payment Deleted Successfully",
          });
        } catch (err) {
          res.json({
            statusCode: 500,
            message: err.message,
          });
        }
      });
    
       //edit rentals 
     router.put("/Payment/:id", async (req, res) => {
      try {
        let result = await Payment.findByIdAndUpdate(req.params.id, req.body);
        res.json({
          statusCode: 200,
          data: result,
          message: "Payment Data Updated Successfully",
        });
      } catch (err) {
        res.json({
          statusCode: 500,
          message: err.message,
        });
      }
    });


    //get Payment table  summary data id wise 

router.get("/Payment_summary/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL parameter
    var data = await Payment.findById(userId);
    if (data) {
      res.json({
        data: data,
        statusCode: 200,
        message: "summaryGet Successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "summary not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

module.exports = router;