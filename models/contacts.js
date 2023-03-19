const Contact = require("./contactModel");

const listContacts = async () => {
  return Contact.find();
};

const getContactById = async (contactId) => {
  return Contact.findOne(contactId) || null;
};

const removeContact = async (contactId) => {
  return Contact.findByIdAndRemove({ _id: contactId });
};

const addContact = async (body) => {
  return Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true }
  );
};

const updateStatusContact = async (contactId, body) => {
  const doc = await Contact.findById(contactId);
  doc.favorite = body.favorite;
  await doc.save();
  return doc;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
