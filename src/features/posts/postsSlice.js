import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
	posts: [], 
	status: 'idle',
	error: null
}

const postsSlice = createSlice({
	name: 'posts', 
	initialState, 
	reducers: {
		postAdded: {
			reducer(state, action) {
				state.posts.push(action.payload)
			},
			prepare(title, content) {
				return {
					payload: {
						id: nanoid(),
						title,
						content
					}
				}
			}
		},
		postUpdated(state, action) { 
			const { id, title, content } = action.payload
			const existingPost = state.posts.find(post => post.id === id)
			if (existingPost) { 
				existingPost.title = title
				existingPost.content = content
			}
		}
	}
})

// export the action creator automatically created by createSlice based on the postAdded reducer function
export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) => 
	state.posts.posts.find(post => post.id === postId)