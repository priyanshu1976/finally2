const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add a new address for a user
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      label,
      house,
      street,
      landmark,
      address1,
      city,

    } = req.body;

    if (!house || !street || !city || !label) {
      return res
        .status(400)
        .json({ message: "House, street, city, and label are required" });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        label,
        house,
        street,
        landmark,
        address1,
        city
    
      },
    });
    res.status(201).json({ message: "Address added", address });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all addresses for a user
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await prisma.address.findMany({
      where: { userId },
    });
    res.json({ addresses });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an address for a user
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      label,
      house,
      street,
      landmark,
      address1,
      city
    } = req.body;

    // Only allow update if address belongs to user
    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });
    if (!address || address.userId !== userId) {
      return res.status(404).json({ message: "Address not found" });
    }

    const updated = await prisma.address.update({
      where: { id: parseInt(id) },
      data: {
        label,
        house,
        street,
        landmark,
        address1,
        city
      },
    });
    res.json({ message: "Address updated", address: updated });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an address for a user
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Only allow delete if address belongs to user and not used in any order
    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });
    if (!address || address.userId !== userId) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Check if address is used in any order
    const orderUsingAddress = await prisma.order.findFirst({
      where: { addressId: parseInt(id) },
    });
    if (orderUsingAddress) {
      return res
        .status(400)
        .json({ message: "Cannot delete address used in an order" });
    }

    await prisma.address.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Address deleted" });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
