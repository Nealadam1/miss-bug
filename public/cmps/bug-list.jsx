const { Link } = ReactRouterDOM

import { BugPreview } from "./bug-preview.jsx"

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    return <ul className="bug-list">
        {bugs.map(bug =>
            <li className="bug-preview" key={bug._id}>
                <BugPreview bug={bug} />
                <div>
                    <button onClick={() => { onRemoveBug(bug._id) }}>x</button>
                    <Link to={`/bug/edit/${bug._id}`}>Edit</Link>
                </div>
                <Link to={`/bug/${bug._id}`}>Details</Link>
            </li>)}
    </ul>
}