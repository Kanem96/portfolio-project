const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")

beforeEach(() => {
    return seed(data);
})

afterAll(()=>{
    if (db.end) return db.end();
})

describe("GET", ()=>{
    describe("/api/categories", ()=>{
        it("should return status: 200, and an array of category objects with the properties 'slug' and 'description'", ()=>{
            const output = {categories: [
                { slug: 'euro game', description: 'Abstact games that involve little luck' },
                {
                  slug: 'social deduction',
                  description: "Players attempt to uncover each other's hidden role"
                },
                { slug: 'dexterity', description: 'Games involving physical skill' },
                { slug: "children's games", description: 'Games suitable for children' }
              ]}
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({body} )=>{
                    expect(body).toEqual(output);
                    body.categories.forEach((category)=>{
                        expect(category).toEqual(
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String)
                            })
                        )
                    })
                })
        })
    })
    describe("/api/reviews/:review_id", ()=>{
        it("should return status 200, and a review object containing specific properties", ()=>{
            return request(app)
                .get('/api/reviews/1')
                .expect(200)
                .then(({body} )=>{
                    const review = body.review[0]
                    expect(review).toEqual(
                        expect.objectContaining({
                            title: expect.any(String),
                            designer: expect.any(String),
                            owner: expect.any(String),
                            review_img_url: expect.any(String),
                            review_body: expect.any(String),
                            category: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number)
                        })
                    )
                })
        })
    })
    describe("/api/users", ()=>{
        it("should return status: 200, and an array of objects containing specific properties",()=>{
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body})=>{
                    if (body.length !== 0) {
                        body.users.forEach((user)=>{
                            expect(user).toEqual(
                                expect.objectContaining({
                                    username: expect.any(String),
                                    name: expect.any(String),
                                    avatar_url: expect.any(String),
                                })
                            )
                        })
                    }
            })
        })
    })
    describe("Error Handling", ()=>{
        it("should return status 404: Not found when given a path that does not exist", ()=>{
            return request(app)
                .get('/api/not-a-path')
                .expect(404)
                .then(({body})=>{
                    expect(body).toEqual({status: 404, msg: "Not Found"})
                })
        })
        it("should return status 404: No Review Found when given an id that does not exist", ()=>{
            return request(app)
                .get('/api/reviews/9999')
                .expect(404)
                .then(({body})=>{
                    expect(body).toEqual({status: 404, msg: 'No review found for review_id: 9999'})
                })
        })
        it("should return status 400: Bad Request when given an invalid path", ()=>{
            return request(app)
                .get('/api/reviews/not-a-review-id')
                .expect(400)
                .then(({body})=>{
                    expect(body).toEqual({status: 400, msg: 'bad request'})
                })
        })
    })
})