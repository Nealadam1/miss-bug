const { NavLink, Link, useNavigate } = ReactRouterDOM
const { useState } = React

import { userService } from '../services/user.service.js'
import { LoginSignup } from './login-signup.jsx'
import { UserMsg } from './user-msg.jsx'

export function AppHeader() {
    const [user, setUser] = useState(userService.getLoggedinUser())
    const navigate=useNavigate()

    function onChangeLoginStatus(user) {
        setUser(user)
    }
    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
                navigate('/')
            })
    }

    return (
        <header>
            <UserMsg />
            <nav>
                <NavLink to="/">Home</NavLink> |
                <NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            {user ? (< section >
                <h2>Hello {user.fullname}</h2>
                <Link to={`/user/${user._id}`}>Profile</Link>
                <button onClick={onLogout}>Logout</button>
            </ section >) : (
                <section>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}

            <h1>Bugs are Forever</h1>
        </header>
    )
}
