const express = require("express");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");
const { tryCatchWrapper } = require("../../service/catchWrapper");
const { auth } = require("../middlewares/verify");

const router = express.Router();

// Get all contacts
router.get("/", auth, tryCatchWrapper(listContacts));

// Get a specific contact by ID
router.get("/:contactId", auth, tryCatchWrapper(getContactById));

// Create a new contact
router.post("/", auth, tryCatchWrapper(addContact));

// Delete a contact by ID
router.delete("/:contactId", auth, tryCatchWrapper(removeContact));

// Update a contact by ID
router.put("/:contactId", auth, tryCatchWrapper(updateContact));

// Update a favorite in contact by ID
router.patch(
  "/:contactId/favorite",
  auth,
  tryCatchWrapper(updateStatusContact)
);

module.exports = router;
