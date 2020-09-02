import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  
  const user = "?"

  return (
    <nav>
      <section>
        <h1>bldr</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/"><button type="button">BEWARE</button></Link>
            <Link to="/history"><button type="button">History</button></Link>
            <Link to="/words"><button type="button">Words</button></Link>
            <Link to="/relax"><button type="button">DON'T CLICK ME</button></Link>
            <Link to="/me"><button type="button">by {user}</button></Link>
          </div>
        </div>
      </section>
    </nav>
  )
}
