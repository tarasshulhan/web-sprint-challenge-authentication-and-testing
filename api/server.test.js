const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db("users").truncate()
})
afterAll(async () => {
  await db.destroy() 
})

it('is the correct env', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

describe("[POST] /api/auth/register - create new user", () =>{
  let res
  beforeEach(async () =>{
    res = await request(server)
      .post('/api/auth/register')
      .send({username: 'asdf', password: 'asdf'})
  })

  it('responds with a 201 created', async () => {
    expect(res.status).toBe(201)
  })

  it('responds with new user', async () => {
    expect(res.body.username).toMatch('asdf')
  })
})

describe("[POST] /api/auth/login - log in", () =>{
  let res
  beforeEach(async () =>{
    await request(server)
      .post('/api/auth/register')
      .send({username: 'asdf', password: 'asdf'})
    res = await request(server)
      .post('/api/auth/login')
      .send({username: 'asdf', password: 'asdf'})
  })
  
  it('responds with a 200 ok', async () => {
    expect(res.status).toBe(200)
  })

  it('responds with a token', async () => {
    expect(res.body.token).toBeTruthy()
  })
})


describe("[GET] /api/jokes - get the jokes", () =>{
  let res
  beforeEach(async () =>{
    await request(server)
      .post('/api/auth/register')
      .send({username: 'asdf', password: 'asdf'})
    res = await request(server)
      .post('/api/auth/login')
      .send({username: 'asdf', password: 'asdf'})
  })

  it('can not get jokes without auth token', async () => {
    const jokes = await request(server)
      .get('/api/jokes')
    expect(jokes.status).toBe(401)
  })

  it('can get jokes with auth token', async () => {
    const jokes = await request(server)
      .get('/api/jokes')
      .set('Authorization', res.body.token)
    expect(jokes.status).toBe(200)
    expect(jokes.body.length).toBe(3)
  })
})