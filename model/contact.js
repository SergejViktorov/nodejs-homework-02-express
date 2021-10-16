const { Schema, model } = require('mongoose')
const { ValidInContact } = require('../config/constants')

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    phone: {
      type: String,
      min: ValidInContact.MIN,
      max: ValidInContact.MAX,
      required: [true, 'Set phone for contact'],
    },
    email: {
      type: String,
      required: [true, 'Set email for contact'],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id
        return ret
      },
    },
    toObject: { virtuals: true },
  }
)

// contactSchema.path('name').validate(function (value) {
// const re = /[A-Z]\w+/
// return re.test(String(value))
// })
const Contact = model('contact', contactSchema)

module.exports = Contact
