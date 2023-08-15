import supertest from "supertest"
import {
  createTestUser,
  removeAllTestContacts,
  removeTestUser,
} from "./test-utils"
import { web } from "../src/application/web"

describe("POST /api/contacts", function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it("should can create contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@pzn.com",
        phone: "081384004840",
      })

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.first_name).toBe("test"),
      expect(result.body.data.last_name).toBe("test"),
      expect(result.body.data.email).toBe("test@pzn.com"),
      expect(result.body.data.phone).toBe("081384004840")
  })
})
