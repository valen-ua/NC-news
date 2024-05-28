const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('status 200: responds with an array of objects each of which has slug and description property', () => {
return request(app)
.get('/api/topics')
.expect(200)
.then(({ body }) => {
   expect(body.topics).toHaveLength(3);
    body.topics.forEach((topic) => {
        expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String)
        })
    })

})
    })
    test('status 404: responds with an error message when route is not found', () => {
        return request(app)
        .get('/api/topicss')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Route not found')
        })
    })
})

describe.only('GET /api', () => {
    test('responds with an object describing all the available endpoints on api fetched from the JSON file', () => {
        console.log(endpoints)
       request(app)
       .get('/api')
       .expect(200)
       .then((response) => {
            expect(response.body).toEqual(endpoints)
       })
    })
})