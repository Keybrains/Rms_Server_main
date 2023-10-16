var express = require("express");
var router = express.Router();
var Notification = require("../modals/Notification");
var workorder = require("../modals/Workorder");



 // Post
 router.post("/notification", async (req, res) => {
    try {
  
      const { workorder_id, vendor_name, staffmember_name, rental_adress } = req.body.workorder;
      
      // const VendorName = req.body.vendor_name;
      // const matchingTenant = await workorder.findOne({
      //   vendor_name: VendorName,
        
      // });

      // if (matchingTenant) {
      //   // Update the matching rental's isrenton field to true
      //   await workorder.findByIdAndUpdate(matchingTenant._id, {
      //     istenant: true,
      //   });
      // }

      const vendorNotification = {
        workorder_id: `${workorder_id}`,
        notification_title: 'Workorder Added',
        notification_details: `Admin created Work Order for ${req.body.workorder.rental_adress} to handle ${req.body.workorder.work_subject}`,
        isread: false,
        istenant: false,
        vendor_name: `${vendor_name}`,
        staffmember_name:`${staffmember_name}`,
        rental_adress: `${rental_adress}`,
        notification_time: new Date().toISOString(),
      };
  
      // Save the notification
      await Notification.create({
        ...vendorNotification,
        // index: newIndex,
      });
  
      res.json({
        statusCode: 200,
        data: vendorNotification,
        message: "Notification Added Successfully",
      });
    } catch (error) {
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  });

  router.post("/notification/tenant", async (req, res) => {
    try {
  
      const { workorder_id, vendor_name, staffmember_name, rental_adress } = req.body.workorder;

      const adminNotification = {
        workorder_id: `${workorder_id}`,
        notification_title: 'Tenant Added Workorder',
        notification_details: `Tenant created Work Order for ${req.body.workorder.rental_adress} to handle ${req.body.workorder.work_subject}`,
        isread: false,
        istenant: true,
        // vendor_name: `${vendor_name}`,
        // staffmember_name:`${staffmember_name}`,
        rental_adress: `${rental_adress}`,
        notification_time: new Date().toISOString(),
      };

      await Notification.create({
        ...adminNotification,
        // index: newIndex,
      });
  
      res.json({
        statusCode: 200,
        data: vendorNotification,
        message: "Notification Added Successfully",
      });
    } catch (error) {
      res.json({
        statusCode: 500,
        message: error.message,
      });
    }
  });

//get
router.get("/notification", async (req, res) => {
  try {
    var data = await Notification.find({istenant: true});
    data.reverse();
    res.json({
      data: data,
      statusCode: 200,
      message: "Read All Notification",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//get vendor
router.get("/vendornotification/:vendor_name", async (req, res) => {
  try {
    const vendor = req.params.vendor_name;
    const notifications = await Notification.find({ vendor_name: vendor });

    if (notifications.length > 0) {
      res.json({
        data: notifications,
        statusCode: 200,
        message: "Vendor Notification details retrieved successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "Vendor Notification details not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//get Staffmember
router.get("/staffnotification/:staffmember_name", async (req, res) => {
  try {
    const staff = req.params.staffmember_name;
    const notifications = await Notification.find({ staffmember_name: staff });

    if (notifications.length > 0) {
      res.json({
        data: notifications,
        statusCode: 200,
        message: "Staff Notification details retrieved successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "Staff Notification details not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//get vendor
router.get("/tenantnotification/:rental_adress", async (req, res) => {
  try {
    const tenant = req.params.rental_adress;
    const notifications = await Notification.find({ istenant: false, rental_adress: tenant });

    if (notifications.length > 0) {
      res.json({
        data: notifications,
        statusCode: 200,
        message: "Tenant Notification details retrieved successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "Tenant Notification details not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});


// Add a new route for deleting a notification by workorder_id
router.delete("/notification/:workorder_id", async (req, res) => {
  try {
    const workorder_id = req.params.workorder_id;

    // Find and delete the notification by workorder_id
    const deletedNotification = await Notification.findOneAndDelete({
      workorder_id: workorder_id,
    });

    if (deletedNotification) {
      res.status(200).json({
        statusCode: 200,
        message: `Notification with workorder_id ${workorder_id} deleted successfully`,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: `Notification with workorder_id ${workorder_id} not found`,
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