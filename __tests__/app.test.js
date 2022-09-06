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
    describe("Error Handling", ()=>{
        it("should return status 404: Not found when given a path that does not exist", ()=>{
            return request(app)
                .get('/api/not-a-path')
                .expect(404)
                .then(({body})=>{
                    expect(body).toEqual({status: 404, msg: "Not Found"})
                })
        })
    })
})