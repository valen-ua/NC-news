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
               author: "rogersop",
               title: "Student SUES Mitch!",
               article_id: 4,
               body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
               topic: "mitch",
               article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
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

describe('GET /api/articles', () => {
    test('status 200: responds with an articles array of article objects with relevant properties and sorted in descending order by date of creation', () => {
       return request(app)
       .get('/api/articles')
       .expect(200)
       .then(({body}) => {
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
            expect(article).toMatchObject({
               author: expect.any(String),
               title: expect.any(String),
               article_id: expect.any(Number),
               topic: expect.any(String),
               created_at: expect.any(String),
               votes: expect.any(Number),
               article_img_url: expect.any(String),
               comment_count: expect.any(String)
            })
        })
        expect(body.articles).toBeSorted({descending: "created_at"})
       }) 
    })
    test('status 404: responds with an error message when route is not found', () => {
        return request(app)
        .get('/api/articless')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Route not found')
        })
    })
})
describe('GET /api/articles/:article_id/comments', () => {
    test('200: responds with an empty array if the article exists, but there are no comments for it', () => {
    return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then(({body}) => {
        const { comments } = body
        expect(comments).toEqual([])
    })
    })
    test('200: responds with an array of comments for the given article_id of which each comment should have the relevant properties', () => {
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body}) => {
           body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number)   
            })
           })
          expect(body.comments).toBeSorted({descending: 'created at'})
          expect(body.comments).toHaveLength(2)
        })   
    })
    
    test('400: invalid article_id, Bad Request', () => {
        return request(app)
        .get('/api/articles/nonsense/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('404: responds with an error message when article_id is not found', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found')
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('201: responds with posted comment', () => {
        const postObj = {
            author: "butter_bridge",
            body: "What an interesting article!"
        }
        return request(app)
        .post('/api/articles/4/comments')
        .send(postObj)
        .expect(201)
        .then(({body}) => {
            expect(body.comment).toEqual({author: "butter_bridge", body: "What an interesting article!"});
        })
        })
    test('404: responds with an error message when article_id is not found', () => {
        const postObj = 
        {
            author: "butter_bridge",
            body: "What an interesting article!"
        }
        return request(app)
        .post('/api/articles/9999/comments')
        .send(postObj)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found')
            })
        })
    test('400: responds with an error when required fields are missing', () => {
        const postObj =
         {
            author: "butter_bridge"
        }
        return request(app)
        .post('/api/articles/5/comments')
        .send(postObj)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })  
    })

    describe('PATCH /api/articles/:article_id', () => {
        test('200: responds with modified article', () => {
            const newVote = 1
            const patchObj = {inc_votes: newVote}
            return request(app)
            .patch('/api/articles/1')
            .send(patchObj)
            .expect(200)
            .then(({body}) => {
                expect(body).toMatchObject({title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                votes: 101,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
            })
        })
        test('400: invalid article id', () => {
            const newVote = 1
            const patchObj = {inc_votes: newVote}
            return request(app)
            .patch('/api/articles/nonsense')
            .send(patchObj)
            .expect(400).then(({ body }) => {
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('404: id not found', () => {
            const newVote = 1
            const patchObj = {inc_votes: newVote}
            return request(app)
            .patch('/api/articles/9999')
            .send(patchObj)
            .expect(404).then(({ body }) => {
                expect(body.msg).toBe('Not Found')
            })
        })
        test('400: incorrect body', () => {
            const newVote = '1'
            const patchObj = {inc_votes: newVote}
            return request(app)
            .patch('/api/articles/1')
            .send(patchObj).then(({body}) => {
                expect(body.msg).toBe('Bad Request')   
            })
        })
    })
describe('DELETE /api/comments/:comment_id', () => {
    test('status 204: responds with no content', () =>{
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        })
        test('status 404: id not found', () => {
            return request(app)
            .delete('/api/comments/9999')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Comment not found')
            })
        })
        test('400: responds with bad request message when comment id is in invalid format', () => {
            return request(app)
            .delete('/api/comments/gibberish')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad Request')
            })
        })
    })
    
  
   