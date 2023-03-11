const express = require("express");
const { schema } = require("../middlewares/contactMiddlewares");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

// Get all contacts
router.get("/", async (req, res, next) => {
  try {
    const data = await listContacts();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
});

// Get a specific contact by ID
router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  try {
    const data = await getContactById(contactId);

    if (data) {
      return res.status(200).json(data);
    }

    res.status(404).json({ message: "Not found" });
  } catch (error) {
   console.error(error);
    res.status(500).json({ message: "Failed to retrieve contact" });
  }
});

// Create a new contact
router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  const { error } = schema.validate(req.body, {
    context: { requestMethod: req.method },
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const data = await addContact({ name, email, phone });
    res.status(201).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to сreate contact" });
  }
});

// Delete a contact by ID
router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const data = await removeContact(contactId);
    if (data) {
      return res.status(200).json("contact deleted");
    }
    res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete contact" });
  }
  res.json({ message: "template message" });
});

// Update a contact by ID
router.put("/:contactId", async (req, res, next) => {
  const body = req.body;
  const { contactId } = req.params;
  const { error } = schema.validate(req.body, {
    context: { requestMethod: req.method },
  });

  if (error) {
    return res.status(400).json({ message: "missing fields" });
  }

  try {
    const data = await updateContact(contactId, body);
    if (data) {
      return res.status(200).json(data);
    }
    res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update contact" });
  }
});

module.exports = router;
