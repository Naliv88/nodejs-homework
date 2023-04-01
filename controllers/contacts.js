const Contact = require("../models/contactModel");
const { schema } = require("../routes/middlewares/contactJoi");

const listContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 5, favorite } = req.query;
  const skip = (page - 1) * limit;

  const condition = favorite ? { owner, favorite } : { owner };
  const pagination = { skip, limit };

  try {
    const data = await Contact.find(condition, "", pagination);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  try {
    const data = await Contact.findOne({ _id: contactId, owner });

    if (data) {
      return res.status(200).json(data);
    }

    res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contact" });
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  try {
    const data = await Contact.findByIdAndRemove({ _id: contactId, owner });
    if (data) {
      return res.status(200).json("contact deleted");
    }
    res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete contact" });
  }
};

const addContact = async (req, res, next) => {
  const { id } = req.user;
  const { name, email, phone } = req.body;

  const { error } = schema.validate(req.body, {
    context: { requestMethod: req.method },
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const data = await Contact.create({ name, email, phone, owner: id });
    res.status(201).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to сreate contact" });
  }
};

const updateContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const body = req.body;
  const { contactId } = req.params;
  const { error } = schema.validate(req.body, {
    context: { requestMethod: req.method },
  });

  if (error) {
    console.log(error);
    return res.status(400).json({ message: "missing fields" });
  }
  try {
    const data = await Contact.findByIdAndUpdate(
      { _id: contactId, owner },
      { ...body },
      { new: true }
    );
    if (data) {
      return res.status(200).json(data);
    }
    res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update contact" });
  }
};

const updateStatusContact = async (req, res, next) => {
  const { body } = req;
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  if (!body) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const doc = await Contact.findById(contactId, owner);
    doc.favorite = body.favorite;
    await doc.save();

    if (doc) {
      return res.status(200).json(doc);
    }

    res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update contact" });
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
