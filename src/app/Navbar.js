import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

import { selectAllPosts } from '../features/posts/postsSlice'

export const Navbar = () => {
  const totalPosts = useSelector((state) => selectAllPosts(state).length)
  const dispatch = useDispatch()


  return (
    <nav>
      <section>
        <h1>Redux Quick Start Example</h1>

        <div className={styles.navContent}>
          <div className={styles.navLinks}>
            <Link to="/">Posts</Link>            
          </div>
        </div>
      </section>
    </nav>
  )
}