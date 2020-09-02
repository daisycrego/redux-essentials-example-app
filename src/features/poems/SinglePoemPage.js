import React from 'react'
import { useSelector } from 'react-redux'
import { PoemBuilder } from '../../app/PoemBuilder'

export const SinglePoemPage = ({ match }) => {
  const { poemId } = match.params

  const poem = useSelector(state =>
    state.poems.find(poem => poem.id === poemId)
  )

  if (!poem) {
    return (
      <section>
        <h2>Poem not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <PoemBuilder poem={poem}/>
    </section>
  )
}