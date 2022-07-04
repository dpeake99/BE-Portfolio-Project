const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => {
    if (db.end) db.end();
  });

    describe("GET /api/topics", ()=> {
      test("status: 200, responds with an array of topic objects ", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            const { topics } = body
            expect(topics).toBeInstanceOf(Array);
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String),
                    })
                )
            })
        })
    })
  })

  describe("GET /api/articles/:article_id", () => {
    test("status:200, returns the request article", () => {
        return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: "2020-11-03T09:12:00.000Z",
                votes: 0,
            })
        })
    })
    test("status: 400 when passed an invalid id", () => {
        return request(app)
        .get("/api/articles/bannana")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("Invalid article_id")
        })
    })
    test("status: 404 when passed an id that could not be found", () => {
        return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual("Article not found")
        })
    })
  })

  describe("PATCH /api/articles/:article_id" , () => {
    test("status: 201, returns requested article with updated votes" ,() => {
        return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 150 })
        .expect(201)
        .then(({body}) => {
            expect(body.article).toEqual({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: "2020-11-03T09:12:00.000Z",
                votes: 150,
            })
        })
    })
    test("status: 404 when passed an id that could not be found", () => {
        return request(app)
        .patch("/api/articles/1000")
        .send({ inc_votes: 150 })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual("Article not found")
        })
    })
})
describe("GET /api/users", ()=> {
    test("status: 200, responds with an array of user objects ", () => {
      return request(app)
      .get("/api/users")
      .expect(200)
      .then(({body}) => {
          const users = body
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveLength(4);
          users.forEach((user) => {
              expect(user).toEqual(
                  expect.objectContaining({
                      username: expect.any(String),
                      name: expect.any(String),
                      avatar_url: expect.any(String),
                  })
              )
          })
      })
  })
})


