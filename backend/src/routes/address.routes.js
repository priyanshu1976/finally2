const router = require("express").Router();
const { protect } = require("../middleware/auth");
const addressController = require("../controllers/address.controller");

// Add a new address
router.post("/", protect, addressController.addAddress);
// Get all addresses for the logged-in user
router.get("/", protect, addressController.getAddresses);
// Update an address
router.put("/:id", protect, addressController.updateAddress);
// Delete an address
router.delete("/:id", protect, addressController.deleteAddress);

module.exports = router;
