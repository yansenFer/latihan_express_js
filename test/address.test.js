import {
  getTestContact,
  createTestContact,
  removeAllTestAddress,
  createTestAddress,
  getTestAddress,
} from "./test-utils"
import { removeAllTestContacts } from "./test-utils"
import { createTestUser } from "./test-utils"
import { removeTestUser } from "./test-utils"
import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging.js"

describe("POST /api/Address", function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
    await createTestAddress()
  })

  afterEach(async () => {
    await removeAllTestAddress()
    await removeAllTestContacts()
    await removeTestUser()
  })

  it("should can create new address", async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "Jalan apa",
        city: "Kota apa",
        province: "Provinsi apa",
        country: "indonesia",
        postal_code: "123123",
      })

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.street).toBe("Jalan apa"),
      expect(result.body.data.city).toBe("Kota apa"),
      expect(result.body.data.province).toBe("Provinsi apa"),
      expect(result.body.data.country).toBe("indonesia")
    expect(result.body.data.postal_code).toBe("123123")
  })

  it("should reject if request is invalid", async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "Jalan apa",
        city: "Kota apa",
        province: "Provinsi apa",
        country: "",
        postal_code: "",
      })

    expect(result.status).toBe(400)
  })

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .post("/api/contacts/" + (testContact.id + 1) + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "Jalan apa",
        city: "Kota apa",
        province: "Provinsi apa",
        country: "indonesia",
        postal_code: "123123",
      })

    expect(result.status).toBe(404)
  })
})

describe("GET /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
    await createTestAddress()
  })

  afterEach(async () => {
    await removeAllTestAddress()
    await removeAllTestContacts()
    await removeTestUser()
  })

  it("should can get address", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test")

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.street).toBe("Jalan apa"),
      expect(result.body.data.city).toBe("Kota apa"),
      expect(result.body.data.province).toBe("Provinsi apa"),
      expect(result.body.data.country).toBe("indonesia")
    expect(result.body.data.postal_code).toBe("123123")
  })

  it("should reject if contact id is not found", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .get(
        "/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id
      )
      .set("Authorization", "test")

    expect(result.status).toBe(404)
  })

  it("should reject if address id is not found", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .get(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "test")

    expect(result.status).toBe(404)
  })
})

describe("GET /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
    await createTestAddress()
  })

  afterEach(async () => {
    await removeAllTestAddress()
    await removeAllTestContacts()
    await removeTestUser()
  })

  it("should can update address", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "Jalan update",
        city: "Kota update",
        province: "Provinsi update",
        country: "indonesia",
        postal_code: "123123",
      })

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined
    expect(result.body.data.street).toBe(testAddress.street),
      expect(result.body.data.city).toBe(testAddress.city),
      expect(result.body.data.province).toBe(testAddress.province),
      expect(result.body.data.country).toBe(testAddress.country)
    expect(result.body.data.postal_code).toBe(testAddress.postal_code)
  })

  it("should reject if request is not valid", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "Jalan update",
        city: "Kota update",
        province: "Provinsi update",
        country: "",
        postal_code: "",
      })

    expect(result.status).toBe(400)
  })

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .put(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "test")
      .send({
        street: "Jalan update",
        city: "Kota update",
        province: "Provinsi update",
        country: "indonesia",
        postal_code: "123123",
      })

    expect(result.status).toBe(404)
  })

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .put(
        "/api/contacts/" +
          (testContact.id + 1) +
          "/addresses/" +
          testAddress.id +
          1
      )
      .set("Authorization", "test")
      .send({
        street: "Jalan update",
        city: "Kota update",
        province: "Provinsi update",
        country: "indonesia",
        postal_code: "123123",
      })

    expect(result.status).toBe(404)
  })
})

describe("DELETE /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
    await createTestAddress()
  })

  afterEach(async () => {
    await removeAllTestAddress()
    await removeAllTestContacts()
    await removeTestUser()
  })

  it("should can delete address", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .delete(
        "/api/contacts/" + testContact.id + "/addresses/" + testAddress.id
      )
      .set("Authorization", "test")

    expect(result.status).toBe(200)
    expect(result.body.data).toBe("ok")
  })

  it("should reject if address is not found", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .delete(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "test")

    expect(result.status).toBe(404)
  })

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .delete(
        "/api/contacts/" +
          (testContact.id + 1) +
          "/addresses/" +
          testAddress.id +
          1
      )
      .set("Authorization", "test")

    expect(result.status).toBe(404)
  })
})

describe("GET /api/contacts/:contactId/addresses", function () {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
    await createTestAddress()
  })

  afterEach(async () => {
    await removeAllTestAddress()
    await removeAllTestContacts()
    await removeTestUser()
  })

  it("should can get address", async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/")
      .set("Authorization", "test")

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(1)
  })

  it("should reject if contactid is not valid", async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 1) + "/addresses/")
      .set("Authorization", "test")

    expect(result.status).toBe(404)
  })
})
