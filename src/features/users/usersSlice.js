import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	users: [
		{ id: '0', name: 'Tianna Jenkins' },
		{ id: '1', name: 'Kevin Grant' },
		{ id: '2', name: 'Madison Price' }
	],
	activeUserId: '0'
}

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {}
})

export default usersSlice.reducer


