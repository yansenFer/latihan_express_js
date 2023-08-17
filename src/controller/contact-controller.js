import contactService from "../service/contact-service.js"

const create = async (req, res, next) => {
  try {
    const user = req.user
    const request = req.body
    const result = await contactService.create(user, request)

    res.status(200).json({
      data: result,
    })
  } catch (error) {
    next(e)
  }
}

const get = async (req, res, next) => {
  try {
    const user = req.user
    const contactId = req.params.contactId
    const result = await contactService.get(user, contactId)
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
    const request = req.body
    // karna saat di body tidak perlu kirim data id, jadi di backend idnya = contactid yang dikirim dari param
    request.id = contactId

    const result = await contactService.update(user, request)
    res.status(200).json({
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const user = req.user
    const contactId = req.params.contactId

    await contactService.remove(user, contactId)
    res.status(200).json({ data: "ok" })
  } catch (error) {
    next(error)
  }
}

export default {
  create,
  get,
  update,
  remove,
}
