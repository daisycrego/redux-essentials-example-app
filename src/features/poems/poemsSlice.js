import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = [
	{ id: '1', title: 'First Poem', lines: ["", "", ""], syllableCounts: [5,7,5], syllableLimits: [5, 7, 5], valid: false, placeholders: ["haikus are easy", "but sometimes they don't make sense", "refrigerator"] },
	{ id: '2', title: 'Second Poem', lines: ["", "", ""], syllableCounts: [0, 0, 0], syllableLimits: [5, 7, 5], valid: false, placeholders: ["haikus are easy", "but sometimes they don't make sense", "refrigerator"] } 
]

const poemsSlice = createSlice({
	name: 'poems', 
	initialState, 
	reducers: {
		poemAdded: {
			reducer(state, action) {
				state.push(action.payload)
			},
			prepare(lines=null, title=null) {
				const syllableLimits = [5,7,5]
				const syllableCounts = [0,0,0]
				const placeholders = ["haikus are easy", "but sometimes they don't make sense", "refrigerator"]
				const valid = false
				const id = nanoid()
				if (!lines) { lines = ["", "", ""]}
				if (!title) { title = `Poem ${id}`}
				return {
					payload: {
						id: id,
						title,
						lines, 
						valid,
						syllableLimits, 
						syllableCounts, 
						placeholders
					}
				}
			}
		},
		poemUpdated(state, action) {
			const { id, title, lines } = action.payload
			const existingPoem = state.find(poem => poem.id === id)
			if (existingPoem) {
				existingPoem.title = title
				existingPoem.lines = lines
			}
		},
		poemReset(state, action) {
			const id = action.payload
			console.log(`poemReset, id: ${JSON.stringify(id)}`) 
			const existingPoem = state.find(poem => poem.id === id) 
			if (existingPoem) {
				existingPoem.syllableCounts = [0,0,0]
				existingPoem.lines = ["","",""]
				existingPoem.valid = false
			}
		}
	}
})

export const { poemAdded, poemUpdated, poemReset } = poemsSlice.actions

export default poemsSlice.reducer

