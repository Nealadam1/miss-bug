const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')

//App configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//Routing express

// Bugs API:
//List
app.get('/api/bug', (req, res) => {
    const filterby = req.query
    bugService.query(filterby)
        .then(bugs => (res.send(bugs)))
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get cars')
        })
})

//Update
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not logged in, cannot delete')

    const bug = req.body
    bugService.save(bug, loggedinUser)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot update bug')
        })

})

//Create 
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not logged in, cannot delete')

    const bug = req.body
    bugService.save(bug, loggedinUser).then((savedBug) => {
        res.send(savedBug)
    })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot create bug')
        })
})

//Read - GetById
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.get(bugId).then(bug => {
        res.send(bug)
    })
        .catch(err => {
            res.status(418).send(err.message)
        })
})

//Remove
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not logged in, cannot delete')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser).then(bug => {
        res.send({ msg: "Bug Removed Successfully", bugId })
    })
        .catch(err => {
            res.status(400).send(err.message)
        })

})

//User API:
//list
app.get('/api/user', (req, res) => {
    const filterBy = req.query
    userService.query(filterBy)
        .then((users) => {
            res.send(users)
        })
        .catch(err => {
            console.log('Error', err)
            res.status(400).send('Cannot get users')
        })
})

//Read - getbyid
app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.get(userId)
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot get user')
        })
})

//Read - login
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})


app.listen(3030, () => console.log('Server ready at port 3030!'))
