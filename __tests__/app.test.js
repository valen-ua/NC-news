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

describe('GET /api', () => {
    test('responds with an object describing all the available endpoints on api fetched from the JSON file', () => {
       request(app)
       .get('/api')
       .expect(200)
       .then((response) => {
            expect(response.body).toEqual(endpoints)
       })
    })
})
describe('GET /api/articles/:article_id', () => {
    test('status 200: responds with an article object with relevant properties', () => {
        return request(app)
        .get('/api/articles/4')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
               author: expect.any(String),
               title: expect.any(String),
               article_id: expect.any(Number),
               body: expect.any(String),
               topic: expect.any(String),
               created_at: expect.any(String),
               votes: expect.any(Number),
               article_img_url: expect.any(String)
            })
        })
    })
    
    test('status 404: valid ID, but non-existent in the database', () => {
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found')
        })
    })
    test('status 400: invalid ID, Bad Request', () => {
        return request(app)
        .get('/api/articles/gibberish')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})