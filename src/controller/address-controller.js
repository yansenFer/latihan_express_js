import addressService from "../service/address-service.js"

const create = async (req, res, next) => {
  try {
    const user = req.user
    const request = req.body
    const contactId = req.params.contactId

    const result = await addressService.create(user, contactId, request)

    res.status(200).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const get = async (req, res, next) => {
  try {
    const user = req.user
    const contactId = req.params.contactId
    const addressId = req.params.addressId

    const result = await addressService.get(user, contactId, addressId)

    res.status(200).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const user = req.user
    const contactId = req.params.contactId
    const addressId = req.params.addressId
    const request = req.body
    request.id = addressId
    // karna saat di body tidak perlu kirim data id, jadi di backend idnya = contactid yang dikirim dari param

    const result = await addressService.update(user, contactId, request)
    res.status(200).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

// const remove = async (req, res, next) => {
//   try {
//     const user = req.user
//     const contactId = req.params.contactId

//     await contactService.remove(user, contactId)
//     res.status(200).json({ data: "ok" })
//   } catch (error) {
//     next(error)
//   }
// }

export default {
  create,
  get,
  update,
  //   remove,
  //   search,
}
