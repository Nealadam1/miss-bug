import { bugService } from "../services/bug.service.js"

const { useState, useEffect, useRef } = React
export function BugFilter({ onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter)
    const elInputRef = useRef(null)

    useEffect(() => {
        elInputRef.current.focus()
    }, [])

    useEffect(() => {
        onSetFilter(filterByToEdit)

    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = (type === 'number' || type === 'range') ? +value : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function handleSelectPage(diff) {
        let { pageIdx } = filterByToEdit
        console.log(filterByToEdit)
        pageIdx = (diff === 'next') ? +pageIdx+1 : +pageIdx-1
        if (pageIdx <= 0) pageIdx = 0
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, "pageIdx": pageIdx }))
        console.log(filterByToEdit)

    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    return <section className="bug-filter">
        <form onSubmit={onSubmitFilter}>
            <label htmlFor="title">Title:</label>
            <input type="text"
                name="title"
                id="title"
                placeholder="Filter by title"
                value={filterByToEdit.title}
                onChange={handleChange}
                ref={elInputRef}
            />
            <label htmlFor="labels">labels:</label>
            <input type="text"
                name="labels"
                id="labels"
                placeholder="Filter By Label"
                value={filterByToEdit.labels}
                onChange={handleChange}
            />
            <label htmlFor="minSeverity">Severity:</label>
            <input type="range"
                min='0'
                max='10'
                name="minSeverity"
                id="minSeverity"
                placeholder="Filter by minimum severity"
                value={filterByToEdit.minSeverity}
                onChange={handleChange}
            />
            <button onClick={() => handleSelectPage('prev')}>Prev Page</button>
            <button onClick={() => handleSelectPage('next')}>Next Page</button>
            <button>Filter Bugs!</button>
        </form>


    </section>

}