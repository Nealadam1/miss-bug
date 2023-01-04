import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'
const { Link } = ReactRouterDOM

const { useState, useEffect } = React

export function BugIndex() {

    const [bugs, setBugs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
        console.log(filterBy)
    }


    function loadBugs() {
        setIsLoading(true)
        bugService.query(filterBy).then((bugs) => {
            console.log(bugs)
            setBugs(bugs)
            setIsLoading(false)
        })

    }

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

    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <Link to="/bug/edit">Add Bug ⛐</Link>
                <BugFilter onSetFilter={onSetFilter} />
                {!isLoading && <BugList bugs={bugs} onRemoveBug={onRemoveBug} />}
                {isLoading && <div>Loading...</div>}
                {!bugs.length && <div>No reported bugs at the moment</div>}
            </main>
        </main>
    )


}
