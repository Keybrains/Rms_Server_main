var express = require("express");
var router = express.Router();
var Rentals = require("../modals/Rentals");
var Tenants = require("../modals/Tenants");
// var {verifyToken} = require("../authentication");

// Post
router.post("/rentals", async (req, res) => {
  try {
    
    var data = await Rentals.create(req.body);
    res.json({
      statusCode: 200,
      data: data,
      message: "Add Rentals Successfully",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/rentals", async (req, res) => {
  try {
    var data = await Rentals.find();
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All Rentals",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.delete("/rentals", async (req, res) => {
  try {
    const propIdsToDelete = req.body;

      console.log("propIdsToDelete from body", propIdsToDelete);
  
      // Get the names of the staff members to be deleted
      const propertyToDelete = await Rentals.find({
        _id: { $in: propIdsToDelete },
      }).select("rental_adress");
      console.log("propertyToDelete after variable",propertyToDelete)
  
      const propNamesToDelete = propertyToDelete.map(
        (staff) => staff.rental_adress
      );
  
      const assignedProperty = await Tenants.find({
        rental_adress: { $in: propNamesToDelete },
      }); 
  
      if (assignedProperty.length > 0) {
        return res.status(201).json({
          statusCode: 201,
          message:
            "Property is already assigned. Deletion not allowed.",
        });
      }

      const result = await Rentals.deleteMany({
        _id: { $in: propIdsToDelete },
      });
      
    res.json({
      statusCode: 200,
      data: result,
      message: "Rentals Deleted Successfully",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});

 //edit rentals 
 router.put("/rentals/:id", async (req, res) => {
  try {
    let result = await Rentals.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      statusCode: 200,
      data: result,
      message: "Rentals Data Updated Successfully",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});

//get listings
router.get("/listings", async (req, res) => {
  try {
    var data = await Rentals.find();
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All listings",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});


//get rentalproperty and rental owners

router.get('/rentalproperty', async (req, res) => {
  try {
    // Use the .find() method to retrieve data and select specific fields
    const propertyData = await Rentals.find({}, 'rental_adress');
    const ownerData = await Rentals.find({}, 'rentalOwner_firstName rentalOwner_lastName');

    res.json({
      statusCode: 200,
      data: {
        "Rental property": propertyData,
        "Rental owners": ownerData,
      },
      message: 'Read Rental Address and Rental Owner Names',
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//get rentals table  summary data id wise 

router.get("/rentals_summary/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL parameter
    var data = await Rentals.findById(userId);
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


router.get("/Rentals_summary/tenant/:rental_address", async (req, res) => {
  try {
    const address = req.params.rental_address;
    const data = await Rentals.find({ rental_adress: address });

    if (data && data.length > 0) {
      res.json({
        data: data,
        statusCode: 200,
        message: "Summary data retrieved successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "Summary data not found for the provided address",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});


//fillter api property_type wise
router.post("/filterproperty_type", async (req, res) => {
  try {
    let pipeline = [];
    if (req.body.property_type) { // Corrected from req.body.rentals
      pipeline.push({
        $match: { property_type: req.body.property_type },
      });
    }
    pipeline.push({
      $facet: {
        data: [{ $skip: 0 }, { $limit: 10 }], // Adjust skip and limit as needed
        totalCount: [{ $count: "count" }],
      },
    });
    let result = await Rentals.aggregate(pipeline);
    const responseData = {
      data: result[0].data,
      totalCount:
        result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0,
    };
    res.json({
      statusCode: 200,
      data: responseData.data,
      totalCount: responseData.totalCount,
      message: "Filtered data retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});


//fillter api  rentalproperty and rental owners

router.post("/filterproperty/owners", async (req, res) => {
  try {
    let pipeline = [];
    if (req.body.rental_adress) { // Corrected from req.body.rentals
      pipeline.push({
        $match: { rental_adress: req.body.rental_adress },
      });
    }
    pipeline.push({
      $facet: {
        data: [{ $skip: 0 }, { $limit: 10 }], // Adjust skip and limit as needed
        totalCount: [{ $count: "count" }],
      },
    });
    let result = await Rentals.aggregate(pipeline);
    const responseData = {
      data: result[0].data,
      totalCount:
        result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0,
    };
    res.json({
      statusCode: 200,
      data: responseData.data,
      totalCount: responseData.totalCount,
      message: "Filtered data retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//find rental_address(proparty in lease form) 
router.get("/property", async (req, res) => {
  try {
    var data = await Rentals.find({isrenton:false}).select("rental_adress")
    data.reverse();
    res.json({
      statusCode: 200,
      data: data,
      message: "read all property",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
}); 

//find rental_address(proparty in lease form) 
router.get("/property_onrent", async (req, res) => {
  try {
    var data = await Rentals.find({isrenton:true}).select("rental_adress")
    res.json({
      statusCode: 200,
      data: data,
      message: "read all property",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
}); 

//find all rental_address
router.get("/allproperty", async (req, res) => {
  try {
    var data = await Rentals.find().select("rental_adress")
    res.json({
      statusCode: 200,
      data: data,
      message: "read all property",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
}); 


//fillter api rentel_address wise in outstanding balance in lease 
router.post("/filter_lease", async (req, res) => {
  try {
    let pipeline = [];
    if (req.body.rental_adress) { // Corrected from req.body.rentals
      pipeline.push({
        $match: { rental_adress: req.body.rental_adress },
      });
    }
    pipeline.push({
      $facet: {
        data: [{ $skip: 0 }, { $limit: 10 }], // Adjust skip and limit as needed
        totalCount: [{ $count: "count" }],
      },
    });
    let result = await Rentals.aggregate(pipeline);
    const responseData = {
      data: result[0].data,
      totalCount:
        result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0,
    };
    res.json({
      statusCode: 200,
      data: responseData.data,
      totalCount: responseData.totalCount,
      message: "Filtered data retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});


//search properties table data like rental_address etc

router.post("/search_Properties", async (req, res) => {
  try {
    let newArray = [];
    newArray.push(
      {
        rental_adress: !isNaN(req.body.search)
          ? req.body.search
          : { $regex: req.body.search, $options: "i" },
      },
      {
        rentalOwner_firstName: !isNaN(req.body.search)
          ? req.body.search
          : { $regex: req.body.search, $options: "i" },
      },
      {
        rentalOwner_lastName: !isNaN(req.body.search)
          ? req.body.search
          : { $regex: req.body.search, $options: "i" },
      },
      {
        rentalOwner_companyName: !isNaN(req.body.search)
          ? req.body.search
          : { $regex: req.body.search, $options: "i" },
      },
      {
        property_type: !isNaN(req.body.search)
          ? req.body.search
          : { $regex: req.body.search, $options: "i" },
      },
    );
    var data = await Rentals.find({
      $or: newArray,
    });

    // Calculate the count of the searched data
    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,  // Include the count in the response
      message: "Read All Rentals",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});


module.exports = router;
