const db = require('../../data/dbConfig')

function findByUsername(username) {
      return db('users')
      .select('id', 'username', 'password')
      .where('users.username', username).first()
}

function findById(id) {
    return db('users')
    .select('id', 'username', 'password')
    .where('users.id', id).first()
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    findByUsername,
    findById,
    add
  }