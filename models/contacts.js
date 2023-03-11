const fs = require("fs").promises;
const uuid = require("uuid");
const path = require("path");

const contactsFilePath = path.join(__dirname, "../models/contacts.json");

const readContacts = async (filePath) => {
  try {
    const data = await fs.readFile(filePath);
    return JSON.parse(data);
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

const writeContacts = async (contacts, filePath) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(contacts));
  } catch (error) {
    console.log(error.message);
  }
};

const listContacts = async () => {
  const data = await readContacts(contactsFilePath);
  return data;
};

const getContactById = async (contactId) => {
  const data = await readContacts(contactsFilePath);
  const contact = data.find(({ id }) => id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const data = await readContacts(contactsFilePath);
  const index = data.findIndex(({ id }) => id === contactId);
  if (index < 0) {
    return null;
  }
  data.splice(index, 1);
  await writeContacts(data, contactsFilePath);
  return contactId;
};

const addContact = async (body) => {
  const data = await readContacts(contactsFilePath);
  const newContact = { ...body, id: uuid.v4() };
  const newContacts = [...data, newContact];
  await writeContacts(newContacts, contactsFilePath);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const data = await readContacts(contactsFilePath);
  const index = data.findIndex(({ id }) => id === contactId);
  if (index < 0) {
    return null;
  }
  const contact = data[index];
  const updatedContact = {
    ...contact,
    ...body,
  };
  data.splice(index, 1, updatedContact);
  await writeContacts(data, contactsFilePath);
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
