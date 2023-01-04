const fs = require('fs')
var bugs = require('../data/bugs.json')
const { makeId } = require('./util.service.js')
const PAGE_SIZE = 5

module.exports = {
    query,
    get,
    remove,
    save
}


function query(filterBy) {
    let filteredBugs = bugs
    console.log(filterBy)
    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        filteredBugs = filteredBugs.filter(bug => regex.test(bug.title))
    }
    if (filterBy.labels && filterBy.labels.length) {
        const regex = new RegExp(filterBy.labels, 'i')
        filteredBugs = filteredBugs.filter(bug => regex.test(bug.labels))
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => +bug.severity >= +filterBy.minSeverity)
    }

    if (filterBy.pageIdx !== undefined && !filterBy.ownerId) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        filteredBugs = filteredBugs.slice(startIdx, PAGE_SIZE + startIdx)
    }
    if(filterBy.ownerId){
        console.log(filterBy.ownerId)
        filteredBugs = filteredBugs.filter(bug=> bug.owner._id === filterBy.ownerId)
        console.log(filteredBugs)
    }
    return Promise.resolve(filteredBugs)

}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug not found')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No such Bug')
    const bug = bugs[idx]
    if(bug.owner._id !== loggedinUser._id) return Promise.reject('Not your bug')
    bugs.splice(idx,1)
    _writeBugsToFile()
    return Promise.resolve()
}

function _writeBugsToFile() {
    return new Promise((resolve, reject) => {

        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return reject(err)
            console.log("File Written sucesssfuly")
            resolve()
        })
    })
}

function save(bug, loggedinUser) {
    if (bug._id) {
        console.log(bug)
        const bugToUpdate = bugs.find(currBug => bug._id === currBug._id)
        if(!bugToUpdate) return Promise.reject('No such bug')
        if(bugToUpdate.owner._id !== loggedinUser._id) return Promise.reject('Not your bug')
        bugToUpdate.title = bug.title
        bugToUpdate.description = bug.description
        bugToUpdate.severity = +bug.severity

    } else {
        bug._id = makeId()
        bug.createdAt = Date.now()
        bug.owner =loggedinUser
        bugs.push(bug)
        
    }
    return _writeBugsToFile().then(() => bug)
}