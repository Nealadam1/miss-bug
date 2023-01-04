import { BugList } from "../cmps/bug-list.jsx"
import { bugService } from "../services/bug.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"

const { useState, useEffect } = React
const { useParams, Link } = ReactRouterDOM

export function UserDetails() {
    const [user, setUser] = useState(userService.getLoggedinUser())
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [bugs, setBugs] = useState([])
    const { userId } = useParams()

    useEffect(() => {
        setFilterBy(userFilterBy => userFilterBy.ownerId = user._id)
    }, [])
    useEffect(() => {
        console.log(filterBy)
        bugService.query(filterBy)
            .then(bugs => {
                setBugs(bugs)
            })
            .catch(err => showErrorMsg('cannot load bugs'))
    }, [])

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }
    console.log(user)
    console.log(bugs)
    return <div>
        <h2>My Details:</h2>
        <h3>Full name: {user.fullname}</h3>
        <h3>User name: {user.username}</h3>
        <h3>User Password: {user.password}</h3>
        
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
        {!bugs.length && <div>No reported bugs at the moment</div>}
    </div>





}