import axios from "axios"
// const baseUrl = "http://localhost:3001/persons"
// const baseUrl = "http://localhost:3001/api/persons"
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const deletePerson = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

const updatePhonenumber = newObject => {
  const request = axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, deletePerson, updatePhonenumber }