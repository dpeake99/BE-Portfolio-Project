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
  })