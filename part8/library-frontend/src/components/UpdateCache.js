const UpdateCache = (cache, query, addedBook) => {
  const uniqByTitle = (t) => {
    let seen = new Set()
    return t.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook))
    }
  })
}

export default UpdateCache