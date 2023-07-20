import supertest from "supertest"
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js"
import { createTestUser, removeTestUser } from "./test-utils.js"

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser()
  })

  it("should can regustier new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe("test")
    expect(result.body.data.name).toBe("test")
    expect(result.body.data.password).toBeUndefined()
  })

  it("should reject if request invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    })

    expect(result.status).toBe(400)
    expect(result.body).toBeDefined()
  })

  it("should reject if username already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe("test")
    expect(result.body.data.name).toBe("test")
    expect(result.body.data.password).toBeUndefined()

    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})


describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it("should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password : "rahasia"
    })

    expect(result.status).toBe(200)
    expect(result.body.data.token).toBeDefined()
    expect(result.body.data.token).not.toBe("test")
  })

  it("should reject login if password is wrong or empty", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "asdasd",
      password : "asdasdasdasdasd"
    })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe("GET /api/users/current", function() {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it("should can get current user", async () => {
    const result = await supertest(web).get("/api/users/current").set("Authorization", "test")

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe("test")
    expect(result.body.data.name).toBe("test")
  })

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).get("/api/users/current").set("Authorization", "salah")

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})