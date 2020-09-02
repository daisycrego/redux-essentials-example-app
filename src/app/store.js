import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postsSlice'
import poemsReducer from '../features/poems/poemsSlice'

export default configureStore({
  reducer: {
  	posts: postsReducer,
  	poems: poemsReducer
  }
})
