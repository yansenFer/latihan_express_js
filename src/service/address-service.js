import { prismaClient } from "../application/database"
import { validate } from "../validation/validation.js"
import {
  createAddressValidation,
  getAddressValidation,
  updateAddressValidation,
} from "../validation/address-validation"
import { getContactValidation } from "../validation/conctact-validation"
import { ResponseError } from "../error/response-error"

const checkContactMustExist = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId)

  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  })

  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, "contact is not found")
  }

  return contactId
}

const create = async (user, contactId, request) => {
  contactId = await checkContactMustExist(user, contactId)

  const address = validate(createAddressValidation, request)
  address.contact_id = contactId

  return prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  })
}

const get = async (user, contactId, addressId) => {
  contactId = await checkContactMustExist(user, contactId)
  addressId = await validate(getAddressValidation, addressId)

  const address = await prismaClient.address.findFirst({
    where: {
      contact_id: contactId,
      id: addressId,
    },
    select: {
      id: true,
      city: true,
      contact: true,
      contact_id: true,
      country: true,
      postal_code: true,
      province: true,
      street: true,
    },
  })

  if (!address) {
    throw new ResponseError(404, "address is not found")
  }

  return address
}

const update = async (user, contactId, request) => {
  contactId = await checkContactMustExist(user, contactId)
  const address = validate(updateAddressValidation, request)

  const totalAddressInDatabase = await prismaClient.address.count({
    where: {
      contact_id: contactId,
      id: address.id,
    },
  })

  if (totalAddressInDatabase !== 1) {
    throw new ResponseError(404, "address is not found")
  }

  return prismaClient.address.update({
    where: {
      id: address.id,
    },
    data: {
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  })
}

// const remove = async (user, contactId) => {
//   contactId = validate(getContactValidation, contactId)

//   const totalInDatabase = await prismaClient.contact.count({
//     where: {
//       username: user.username,
//       id: contactId,
//     },
//   })

//   if (totalInDatabase !== 1) {
//     throw new ResponseError(404, "contact is not found")
//   }

//   return prismaClient.contact.delete({
//     where: {
//       id: contactId,
//     },
//   })
// }

export default {
  create,
  get,
  update,
  //   remove,
  //   search,
}
