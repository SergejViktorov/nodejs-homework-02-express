const express = require('express')
const router = express.Router()
const {
  getContacts,
  getContact,
  saveContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contacts')

const {
  validateContact,
  validateContactId,
  validateStatusContact,
} = require('./validation')
const guard = require('../../helpers/guard')
const wrapError = require('../../helpers/errorHandler')

router.get('/', guard, wrapError(getContacts))

router.get('/:contactId', guard, validateContactId, wrapError(getContact))

router.post('/', guard, validateContact, wrapError(saveContact))

router.delete('/:contactId', guard, validateContactId, wrapError(removeContact))

router.put(
  '/:contactId',
  guard,
  validateContactId,
  validateContact,
  wrapError(updateContact)
)

router.patch(
  '/:contactId/vaccinated/',
  guard,
  validateContactId,
  validateStatusContact,
  updateStatusContact
)

module.exports = router
