
var express = require("express");
var router = express.Router();
var Payment = require("../modals/Payment");

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


module.exports = router;