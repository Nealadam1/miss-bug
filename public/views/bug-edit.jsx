import { bugService } from "../services/bug.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useNavigate, useParams, Link } = ReactRouterDOM

export function BugEdit() {
    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const navigate = useNavigate()
    const { bugId } = useParams()

    useEffect(() => {
        if (!bugId) return
        loadBug()

    }, [])

    function loadBug() {
        bugService.getById(bugId)
            .then((bug) => setBugToEdit(bug))
            .catch((err) => {
                console.log('get bug by id failed', err)
                navigate('/bug')
            })
    }

    function onSaveBug(ev) {
        ev.preventDefault()
        bugService.save(bugToEdit).then((bug) => {
            console.log('Bug saved', bug)
            showSuccessMsg('Bug Saved!')
            navigate('/bug')
        })
            .catch((err) => (console.log('save failed', err)))
    }

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = (type === 'number' || type==='range') ? +value : value
        setBugToEdit((prevBug) => ({ ...prevBug, [field]: value }))
    }

    return <section className="bug-edit">
        <h2>{bugToEdit._id ? 'Edit this bug' : 'Add a new bug'}</h2>

        <form onSubmit={onSaveBug}>
            <label htmlFor="title">Title:</label>
            <input type="text"
                name="title"
                id="title"
                placeholder="Enter title"
                value={bugToEdit.title}
                onChange={handleChange}
            />
            <label htmlFor="description">description:</label>
            <input type="text"
                name="description"
                id="description"
                placeholder="Enter description"
                value={bugToEdit.description}
                onChange={handleChange}
            />
            <label htmlFor="labels">labels:</label>
            <input type="text"
                name="labels"
                id="labels"
                placeholder="Enter Labels with ,"
                value={bugToEdit.labels}
                onChange={handleChange}
            />
            <label htmlFor="severity">Severity:</label>
            <input type="range"
                min='0'
                max='10'
                name="severity"
                id="severity"
                placeholder="Enter severity"
                value={bugToEdit.severity}
                onChange={handleChange}
            />
            <div>
                <button>{bugToEdit._id ? 'Save' : 'Add'}</button>
                <Link to="/bug">Back</Link>
            </div>
        </form>


    </section>
}
