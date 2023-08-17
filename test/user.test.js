import supertest from "supertest"
import { web } from "../src/application/web.js"
import { createTestUser, getTestUser, removeTestUser } from "./test-utils.js"
import bcrypt from "bcrypt"

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser()
  })

  it("should can registier new user", async () => {
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
      password: "rahasia",
    })

    expect(result.status).toBe(200)
    expect(result.body.data.token).toBeDefined()
    expect(result.body.data.token).not.toBe("test")
  })

  it("should reject login if password is wrong or empty", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "asdasd",
      password: "asdasdasdasdasd",
    })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it("should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test")

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe("test")
    expect(result.body.data.name).toBe("test")
  })

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "salah")

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe("PATCH /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it("should can update user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "yanson",
        password: "rahasia aja",
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe("test")
    expect(result.body.data.name).toBe("yanson")

    const user = await getTestUser()
    expect(await bcrypt.compare("rahasia aja", user.password)).toBe(true)
  })
  it("should can update user name", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "yanson",
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe("test")
    expect(result.body.data.name).toBe("yanson")
  })

  it("should reject update if request is not valid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "salah")
      .send({})

    expect(result.status).toBe(401)
  })
})

describe("DELETE /api/users/logout", function () {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it("should can logout", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "test")

    expect(result.status).toBe(200)
    expect(result.body.data).toBe("OK")

    const user = await getTestUser()
    expect(user.token).toBeNull()
  })

  it("should reject logout if token invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "salah")

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})
