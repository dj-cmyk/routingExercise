process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");


let cake = { name: "cake", price: 3.99 };

beforeEach(function () {
  items.push(cake);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [cake] })
  })
})

describe("GET /items/:name", () => {
  test("Get single item by name", async () => {
    const res = await request(app).get(`/items/${cake.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ foundItem: cake })
  })
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/icecube`);
    expect(res.statusCode).toBe(404)
  })
})

describe("POST /items", () => {
  test("Create a new item", async () => {
    const res = await request(app).post("/items").send({ name: "tea", price: 2.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { newItem: { name: "tea", price: 2.99 } } });
  })
  test("Responds with 400 if no data sent", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  })
  test("Responds with 400 if no name sent", async () => {
      const res = await request(app).post("/items").send({price: 3.50});
      expect(res.statusCode).toBe(400);
  })
  test("Responds with 400 if no price sent", async () => {
    const res = await request(app).post("/items").send({name: "cherry pie"});
    expect(res.statusCode).toBe(400);
  })
})

describe("/PATCH /items/:name", () => {
  test("Updating an item name", async () => {
    const res = await request(app).patch(`/items/${cake.name}`).send({ name: "teaCake", price: 3.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: {name: "teaCake", price: 3.99}});
  })
  test("Updating an item price", async () => {
      const res = await request(app).patch(`/items/${cake.name}`).send({name: "cake", price: 10.29});
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({"updated": {"name": "cake", "price": 10.29 }})
  })
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/watermelon`).send({ name: "watermelon" });
    expect(res.statusCode).toBe(404);
  })
})

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/cake`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/custardTart`);
    expect(res.statusCode).toBe(404);
  })
})

