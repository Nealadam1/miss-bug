
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'


// const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug
}


function query(filterBy = getDefaultFilter()) {
    const queryParams = `?title=${filterBy.title}&minSeverity=${filterBy.minSeverity}&labels=${filterBy.labels}&pageIdx=${filterBy.pageIdx}&ownerId=${filterBy.ownerId}`
    return axios.get(BASE_URL + queryParams).then(res => (res.data))
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}
function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}
function save(bug) {
    const url = (bug._id) ? BASE_URL + bug._id : BASE_URL
    const method = (bug._id) ? 'put' : 'post'
    return axios[method](url, bug).then(res => res.data)
}

function getEmptyBug(title = '', severity = '', labels = [], description = '') {
    return { title, severity, labels, description }
}
function getDefaultFilter() {
    return { title: '', minSeverity: '', labels: [], pageIdx: 0, ownerId:'' }
}
