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
    test("status:200, returns the request article with comment count included", () => {
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
                comment_count: 2,
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
    test("status: 400 when passed an invalid id", () => {
        return request(app)
        .patch("/api/articles/bannana")
        .send({inc_votes: 150})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("Invalid article_id")
        })
    })
    test("status: 400 when passed an invalid inc_votes value", () => {
        return request(app)
        .patch("/api/articles/4")
        .send({inc_votes: "bannana"})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("Invalid inc_votes value")
        })
    })
    test("status: 400 when passed no inc_votes value", () => {
        return request(app)
        .patch("/api/articles/4")
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("Invalid inc_votes value")
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

describe("GET /api/articles", ()=> {
    test("status: 200, responds with an array of article objects ordered by date in descending order", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body}) => {
          const articles = body
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
              expect(article).toEqual(
                  expect.objectContaining({
                      author: expect.any(String),
                      title: expect.any(String),
                      article_id: expect.any(Number),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number),
                      comment_count: expect.any(Number)
                  })
              )
          })
      })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("status:200, returns an array of comment objects relating to the requested article", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
                const comments = body
                expect(comments).toBeInstanceOf(Array)
                expect(comments).toHaveLength(11)
                comments.forEach((comment)=> {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String)                        
                        })
                    )
                })
            })
        })
    test("status: 400 when passed an invalid id", () => {
        return request(app)
        .get("/api/articles/bannana/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("Invalid article_id")
        })
    })
    test("status: 404 when passed an id with no related comments", () => {
        return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual("There are no comments for the requested article")
        })
    })
}) 

describe.only("POST /api/articles/:article_id/comments", () => {
    test("status: 201, returns newly posted comment", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({
                username: "rogersop",
                body: "orem ipsum dolor sit amet, consectetur adipiscing elit."
            })
        .expect(201)
        .then(({body}) => {
            expect(body.newComment).toEqual({
                article_id: 1,
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: "rogersop",
                body: "orem ipsum dolor sit amet, consectetur adipiscing elit."   
            }) 
        })    
    })
    test("status: 400 when passed an invalid id", () => {
        return request(app)
        .post("/api/articles/bannana/comments")
        .send({
            username: "rogersop",
            body: "orem ipsum dolor sit amet, consectetur adipiscing elit."
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("Invalid article_id")
        })
    })
    test("status: 404 when passed an article_id that could not be found", () => {
        return request(app)
        .post("/api/articles/1000/comments")
        .send({
            username: "rogersop",
            body: "orem ipsum dolor sit amet, consectetur adipiscing elit."
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual("Article not found")
        })
    })
    test("status: 404 when passed a username that could not be found", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({
                username: "david",
                body: "orem ipsum dolor sit amet, consectetur adipiscing elit."
            })
        .expect(404) 
        .then(({body}) => {
            expect(body.msg).toEqual("User does not exist")   
        })
    })
    test("status: 400 when passed an invalid body", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("Passed invalid body")
        })
    })
})
