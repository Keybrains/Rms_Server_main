var express = require("express");
var router = express.Router();
var Tenants = require("../modals/Tenants");
var Rentals = require("../modals/Rentals");
var {
  verifyToken,
  hashPassword,
  hashCompare,
  createToken,
} = require("../authentication");
var JWT = require("jsonwebtoken");
var JWTD = require("jwt-decode");
const nodemailer = require("nodemailer");

//add tenant
router.post("/tenant", async (req, res) => {
  try {
    var count = await Tenants.count();
    function pad(num) {
      num = num.toString();
      while (num.length < 2) num = "0" + num;
      return num;
    }
    req.body["tenant_id"] = pad(count + 1);

    const {
      tenant_id,
      tenant_firstName,
      tenant_lastName,
      tenant_unitNumber,
      tenant_mobileNumber,
      tenant_workNumber,
      tenant_homeNumber,
      tenant_faxPhoneNumber,
      tenant_email,
      tenant_password,
      alternate_email,
      tenant_residentStatus,
      birth_date,
      textpayer_id,
      comments,
      contact_name,
      relationship_tenants,
      email,
      emergency_PhoneNumber,
      entries,
    } = req.body;

    // Check if end_date matches the current date
    const currentDate = new Date();
    const endDate = new Date(req.body.end_date);

    if (endDate <= currentDate) {
      req.body["propertyOnRent"] = true;
    } else {  
      req.body["propertyOnRent"] = false;
    }

    const data = await Tenants.create({
      tenant_id,
      tenant_firstName,
      tenant_lastName,
      tenant_unitNumber,
      tenant_mobileNumber,
      tenant_workNumber,
      tenant_homeNumber,
      tenant_faxPhoneNumber,
      tenant_email,
      tenant_password,
      alternate_email,
      tenant_residentStatus,
      birth_date,
      textpayer_id,
      comments,
      contact_name,
      relationship_tenants,
      email,
      emergency_PhoneNumber,
      entries,
    });

    // Remove the _id fields from the entries
    const responseData = { ...data.toObject() };
    responseData. entries = responseData. entries.map((entryItem) => {
      delete entryItem._id;
      return entryItem;
    });

    // Get the tenant's rental address
    const tenantRentalAddress = req.body.rental_adress;

    // Find a rental with a matching rental address
    const matchingRental = await Rentals.findOne({
      rental_adress: tenantRentalAddress,
    });

    if (matchingRental) {
      // Update the matching rental's isrenton field to true
      await Rentals.findByIdAndUpdate(matchingRental._id, {
        isrenton: true,
      });
    }

    res.json({
      statusCode: 200,
      data: data,
      message: "Add Tenants Successfully",
    });
  } catch (error) {
    res.json({
      statusCode: false,
      message: error.message,
    });
  }
});

// router.post("/tenant", async (req, res) => {
//   try {
//     if (req.body.selectedTenantId) {
//       // Update existing tenant
//       const existingTenant = await Tenants.findOne({ _id: req.body.selectedTenantId });

//       console.log(existingTenant, "existingTenant")

//       if (existingTenant) {
//         // Merge the leasing form data with the existing tenant's data
//         const updatedTenantData = { ...existingTenant.toObject(), ...req.body };

//         // Update the tenant
//         const updatedTenant = await Tenants.findOneAndUpdate(
//           { tenant_id: req.body.selectedTenantId },
//           updatedTenantData,
//           { new: true }
//         );

//         res.json({
//           statusCode: 200,
//           data: updatedTenant,
//           message: "Update Tenant Data Successfully",
//         });
//       } else {
//         // Handle the case where the selected tenant does not exist
//         res.json({
//           statusCode: 400,
//           message: "Selected tenant not found.",
//         });
//       }
//     } else {
//       // Create a new tenant
//       var count = await Tenants.count();
//       // ... (rest of your existing code to create a new tenant)
//     }
//   } catch (error) {
//     res.json({
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// });

 
//get tenant
  router.get("/tenant", async (req, res) => {
  try {
    var data = await Tenants.find();
    data.reverse();
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All Tenants",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});


router.delete("/tenant", async (req, res) => {
    try {
      let result = await Tenants.deleteMany({
        _id: { $in: req.body },
      });
      res.json({
        statusCode: 200,
        data: result,
        message: "Tenants Deleted Successfully",
      });
    } catch (err) {
      res.json({
        statusCode: 500,
        message: err.message,
      });
    }
  });

  
 //edit tenant
// PUT request to update tenant data
router.put("/tenant/:id", async (req, res) => {
  try {
    // Update the tenant data
    let result = await Tenants.findByIdAndUpdate(req.params.id, req.body);

    // Check if end_date matches the current date and update propertyOnRent
    const currentDate = new Date();
    const endDate = new Date(req.body.end_date);

    if (endDate <= currentDate) {
      await Tenants.findByIdAndUpdate(req.params.id, {
        propertyOnRent: true,
      });
    } else {
      await Tenants.findByIdAndUpdate(req.params.id, {
        propertyOnRent: false,
      });
    }

    res.json({
      statusCode: 200,
      data: result,
      message: "Tenant Data Updated Successfully",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});



//get  rentroll table data 
router.get("/rentroll", async (req, res) => {
  try {
    var data = await Tenants.find();
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All rentroll",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//get tenant table  summary data id wise 

router.get("/tenant_summary/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL parameter
    var data = await Tenants.findById(userId);
    if (data) {
      res.json({
        data: data,
        statusCode: 200,
        message: " tenant summaryGet Successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "tenant summary not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

router.get("/tenant_summary/tenant/:tenant_email", async (req, res) => {
  try {
    const email = req.params.tenant_email;

    // Use await to fetch data and handle the result as an array
    const data = await Tenants.find({ tenant_email: email });
    if (data) {
      res.json({
        data: data,
        statusCode: 200,
        message: " tenant summaryGet Successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "tenant summary not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

 // Define a route to get a tenant's rental addresses by email
 router.get("/tenant_rental_addresses/:tenant_email", async (req, res) => {
  try {
    const email = req.params.tenant_email;

    // Use await to fetch data and handle the result as an array
    const data = await Tenants.find({ tenant_email: email });
   
    if (data && data.length > 0) {
      // Extract rental addresses from the data using "rental_adress"
      const rental_adress = data.map(tenant => tenant.rental_adress);

      res.json({
        rental_adress: rental_adress, // Use "rental_adress" here
        statusCode: 200,
        message: "Rental addresses retrieved successfully for the tenant",
      });
    } else {
      // If data is an empty array, it means no results were found for the email
      res.status(404).json({
        statusCode: 404,
        message: "Tenant not found or has no rental addresses",
      });
    }
  } catch (error) {
    // Handle errors properly
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

//fillter api lease type wise
router.post("/filterlease_type", async (req, res) => {
  try {
    let pipeline = [];
    if (req.body.lease_type) { // Corrected from req.body.rentals
      pipeline.push({
        $match: { lease_type: req.body.lease_type },
      });
    }
    pipeline.push({
      $facet: {
        data: [{ $skip: 0 }, { $limit: 10 }], // Adjust skip and limit as needed
        totalCount: [{ $count: "count" }],
      },
    });
    let result = await Tenants.aggregate(pipeline);
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



//search tenant table data like firstname , lastname

router.post("/search_tenant", async (req, res) => {
  try {
    let newArray = [];
    newArray.push(
      {
        tenant_firstName: !isNaN(req.body.search)
          ? req.body.search
          : { $regex: req.body.search, $options: "i" },
      },
      {
        tenant_lastName: !isNaN(req.body.search)
          ? req.body.search
          : { $regex: req.body.search, $options: "i" },
      },
    );
    var data = await Tenants.find({
      $or: newArray,
    });

    // Calculate the count of the searched data
    const dataCount = data.length;

    res.json({
      statusCode: 200,
      data: data,
      count: dataCount,  // Include the count in the response
      message: "Read All Tenants",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});



//search RentRoll  table data like lease (rentale_address) , leasetype (type)
router.post("/search-rentroll", async (req, res) => {
  try {
    let newArray = [];
    if (Number(req.body.search)) {
     
      newArray.push(
        {
          amount: !isNaN(req.body.search)
            ? req.body.search
            : { $regex: req.body.search, $options: "i" },
        },
       
      );
    } else {
      newArray.push(
        {
          property_type: { $regex: req.body.search, $options: "i" },
        },
        {
          lease_type: { $regex: req.body.search, $options: "i" },
        },
      );
    }

    var data = await Tenants.find({
      $or: newArray,
    });
    res.json({
      statusCode: 200,
      data: data,
      message: "Read All Rentroll",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});



// Login tenant
router.post("/login", async (req, res) => {
  try {
    const user = await Tenants.findOne({ tenant_email: req.body.tenant_email });
    if (!user) {
      return res.json({ statusCode: 403, message: "User doesn't exist" });
    }
    const isMatch = await Tenants.findOne({tenant_password: req.body.tenant_password} );
    if (!isMatch) {
      return res.json({ statusCode: 402, message: "Enter Valid Password" });
    }

    const tokens = await createToken({
      _id: user._id,
      // userName: user.userName,
      tenant_email: user.tenant_email,
      // mobileNumber: user.mobileNumber,
    });
    if (isMatch) {
      res.json({
        statusCode: 200,
        message: "User Authenticated",
        token: tokens,
        data: user,
      });
    }
  } catch (error) {
    res.json({ statusCode: 500, message: error });
  }
});

//get tenant table in  rental_adress $ id   wise  data 

router.get("/tenant_summary/:rental_adress/:id", async (req, res) => {
  try {
    const rentalAdress = req.params.rental_adress;
    const userId = req.params.id;

    var data = await Tenants.findOne({ rental_adress: rentalAdress, _id: userId });

    if (data) {
      res.json({
        data: data,
        statusCode: 200,
        message: "property summary retrieved successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "property summary not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});


//find account_name(accountname in lease form in account dropdoun) 
router.get("/account_name", async (req, res) => {
  try {
    var data = await Tenants.find().select("account_name")
    res.json({
      statusCode: 200,
      data: data,
      message: "read all account detail",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//find rental_address(proparty in lease form) 
router.get("/property", async (req, res) => {
  try {
    var data = await Tenants.find().select("rental_adress")
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

// rental address wise get all data 
router.get("/renton_property/:rental_adress", async (req, res) => {
  try {
    const rentalAdress = req.params.rental_adress;
    console.log("Rental Address:", rentalAdress);
    const data = await Tenants.find({ "entries.rental_adress": rentalAdress });
    console.log("Rental data:", data);
    if (data) {
      res.json({
        data: data,
        statusCode: 200,
        message: "Property summary retrieved successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "Property summary not found for the specified rental address.",
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