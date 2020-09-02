import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const PoemsList = () => {
	// selector
	const poems = useSelector(state => state.poems)

	const renderedPoems = poems.map(poem => (
		<article className="poem-excerpt" key={poem.id}>
			<h3>{poem.title}</h3>
			{poem.lines.map((line, index) => <p key={`${poem.id}_${index}`}>{line}</p>)}
			<Link to={`/poems/${poem.id}`} className="button muted-button">
				View Poem 
			</Link>
		</article>
	))

	return (
		<section>
			<h2>My Poems</h2>
			{ renderedPoems }
		</section>
	)
}