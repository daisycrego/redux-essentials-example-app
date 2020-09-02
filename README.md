# Redux Essentials Tutorial Example + Bldr

# Redux
- [Basic Tutorial - Todo List](https://react-redux.js.org/)
- "A predictable state container for JS apps"
- Redux Toolkit (RTK): Recommended for writing Redux logic. Simplifies most Redux tasks, including **store setup**, **creating reducers and writing immutable update logic**, and even **creating entire "slices" of state at once**. 

```bash
# NPM
npm install @reduxjs/toolkit --save
```
- The recommendation is to start a new `create-react-app` with a special Redux+JS template. I'll probably just do it that way. It will be easier to slowly bring over the elements, anyway. 

## Basic Example
- The whole state of the app is stored in an object tree inside a single **store**. The only way to change the tree is to emit an **action**, an object describing what happened. To specify how the actions transfor the state tree, you write pure **reducers**.

```javascript
import { createStore } from 'redux'

/* 
This is a reducer, a pure function with (state, action) => state signature. It describes how an action transforms the state into the next state. 

The shape of the state is up to you: it can be a primitive, an array, an object, or even an Immutable.js data structure. The only important part is that you should not mutate the state object, but return a new object if the state changes. 

In this example, we use a `switch` statement and strings, but you can use a helper that follows a different convention (such as function maps).
*/

function counter(state = 0, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1
		case 'DECREMENT': 
			return state - 1
		default:
			return state
	}
}

// Create a Redux store holding the state of your app. 
// Its API is { subscribe, dispatch, getState }
let store = createStore(counter); 

// You can use subscribe() to update the UI in response to state changes. 
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly. 
// However it can also be handy to persist the current state in the localStorage. 
store.subscribe(() => console.log(store.getState())); 

// The only way to mutate the internal state is to dispatch an action. 
// The actions can be serialized, logged or stored and later replayed. 
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT '})
// 1

```
- Instead of mutating the state directly, you specify the mutations you want to happen with plain objects called **actions**. Then you write a special function called a **reducer** to decide how every action transforms the entire application's state. 
- In a typical Redux app, there is just a single store with a single root reducing function. As the app grows, you spl;it the reducer into smaller reducers independently operating on different parts of the state tree. This is exactly like how there is just 1 root component in a React app, but it is composed out of many small components. 

### Redux Essentials, Part 1: Redux Overview and Concepts
1. What is redux? Redux is a pattern and library for managing and updating application state, using events called "actions". It serves as a centralized store for state that needs to be used across your entire application, with rules ensuring that the state can only be updated in a predictable fashion. 
2. `Redux`, `React-Redux`, `RTK - Redux Toolkit`: `Redux` is a small standalone JS library. It is commonly used with other packages including `React-Redux` and `Redux Toolkit`. `React-Redux` lets components interact with a Redux store by reading pieces of state and dispatching actions to update the store. `RTK` is the Redux dev's recommended approach for writing Redux logic. It contains packages and functions and simplifies many common tasks. 
3. `Immutability`: **Redux expects that all state updates are done immutably**. In order to update values immutably, your code must make copies of existing objects/arrays, and then modify the copies. We can do this using JS's array / object spread operators, as well as array methods that return new copies of the array instead of mutating the original array: 

```javascript
const object = {
	a: {
		c: 3
	},
	b: 2
}

// To safely update object.a.c, we have to copy each piece
const object2 = {
	...obj, 

	a: {
		...obj.a,
		c: 42
	}
}

// Concatenating
const arr = ['a', 'b']

// A: use concat to create a new copy with 'c' appended
const arr2 = arr.concat('c')

// B: make a copy of the original array with `slice`, then mutate the copy
const arr3 = arr.slice()
arr3.push('c')
```

### Redux Concepts
#### Actions
- An `action` is a plain JS object that has a `type` field. 
- **You can think of an action as an event that describes something that happened in the app.**. 
- The `type` field should be a string that gives this action a descriptive name, like `"todos/todoAdded"`. Write that `type` string like `domain/eventName`, where the first part is the feature/category that this action belongs to (e.g. `todos`), and the second part is the specific thing that happened (e.g. `todoAdded`. 
- Additional information can be added to the `payload` field. 
- A typical action object might look like this:

```javascript
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}
```

#### Action Creators
- An **action creator** is a function that creates and returns and action object. We typically use these so we don't have to write the action object by hand every time: 
```javascript
const addTodo = text => {
	return {
		type: 'todos/todoAdded',
		payload: text
	}
}
```

#### Reducers
- A **reducer** is a function that receives the current **state** and an **action** object, decides how to update the state if necessary, and returns the new state: `(state, action) => newState`. 
- **Note**: reducers get their name because they're similar to the kind of callback function you pass to the `Array.reduce()` method. 
- Reducers must always follow some specific rules: 
	- They should only calculate the new state value based on the `state` and `action` arguments. 
	- They are not allowed to modify the existing `state`. Instead, they must make **immutable updates**, by copying the existing `state` and making changes to the copied values. 
	- They must not do any asynchronous logic, calculate random values, or cause other "side effects". 
- The logic inside reducer functions typically follows the same series of steps: 
	- Check to see if the reducer cares about this action. 
		- If so, make a copy of the state, update the copy with new values, and return it. 
		- Otherwise, return the existing state unchanged. 
- Reducers can use any kind of logic inside to decide what the new state should be (`if/else`, `switch`, loops, etc.). 
- Here's a small example of a reducer, showing the steps that each reducer should follow: 

```javascript
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
	// check to see if the reducer cares about this action 
	if (action.type === 'counter/increment') {
		return {
			...state, 
			value: state.value + 1
		}
	}
	// otherwise return existing state unchanged
	return state
}
```

#### Store
- The current Redux application state lives in an object called the **store**. 
- The store is created by passing in a reducer, and has a method called `getState` that returns the current state value. 

```javascript
import { configureStore } from '@reduxjs/toolkit'

const store = configure({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
```

#### Dispatch
- The Redux store has a method called `dispatch`. The only way to update the state is to call `store.dispatch` and pass an **action** object. The store will run its reducer function and save the new state value inside, and we can call `getState()` to retrieve the updated value: 

```javascript
store.dispatch({ type: 'counter/increment' })

console.log(store.getState())
// {value: 1}
```
- You can think of dispatching actions as triggering an event in the application. Something happened, and we want the store to know about it. Reducers act like event listeners, and when they hear an action they are interested in, they update the state in response. 
- We typically call action creators to dispatch the right action: 

```javascript
// action creator
const increment = () => {
  return {
    type: 'counter/increment'
  }
}

store.dispatch(increment())

console.log(store.getState())
// {value: 2}
```

#### Selectors
- **Selectors** are functions that know how to extract specific pieces of information from a store state value:
```javascript
// selector
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
``` 

### Redux Application Data Flow
- Initial setup: 
	- A Redux store is created using a root reducer function. 
	- The store calls the root reducer once, and saves the return value as its initial `state`
	- When the UI is first rendered, UI components access the current state of the Redux store, and use that data to decide what to render. They also subscribe to any future store updates so they can know if the state has changed. 
- Updates: 
	- Something happens in the app, such a the user clicking a button. 
	- The app code dispatches an action to the Redux store, like `dispatch({type: 'counter/increment'})`
	- The store runs the reducer function again with the previous `state` and the current `action`, and saves the return value as the new `state`
	- The store notifies all parts of the UI that are subscribed that the store has been updated. 
	- Each UI component that needs data from the store checks to see if the parts of the state they need have changed. 
	- Each component that sees its data has changed forces a re-render with the new data.

### App Structure
- https://redux.js.org/tutorials/essentials/part-2-app-structure

#### Initial Store
- The Redux store is in `src/app/store.js`. It is created using `configureStore` from the RTK, which requires a `reducer` argument. 
- An application made up of many features can have many reducer functions, which can all be passed to `configureStore`. 
- Redux allows store setup to be customized with different kinds of plugins ("middleware" and "enhancers"). `configureStore` automatically adds several middleware to the store setup by default to provide a good developer experience, and also sets up the store so that the Redux DevTools Extension can inspect its contents.

#### Redux Slices
- A "slice" is a collection of Redux reducer logic and actions for a single feature in your app, typically defined together in a single file. The name comes from splitting up the root Redux state object into multiple "slices" of state.
- `counterSlice.js` exports a reducer function for the counter logic. We can import that `counterReducer` function and include it when creating the store.
- For example, in a blogging app, our store setup might look like:

```javascript
import { configureStore } from '@reduxjs/toolkit'
import usersReducer from '../features/users/usersSlice'
import postsReducer from '../features/posts/postsSlice'
import commentsReducer from '../features/comments/commentsSlice'

export default configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer
  }
})
```
- In that example, `state.users`, `state.posts`, and `state.comments` are each a separate "slice" of the Redux state. Since `usersReducer` is responsible for updating the `state.users` slice, we refer to it as a "slice reducer" function.

#### Creating Slice Reducers and Actions

```javascript
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})
```
- RTK's `createSlice` takes care of the work of generating action type strings, action creator functions, and action objects. All you have to do is define a name for the slice, write an object that has some reducer functions in it, and it generates the corresponding action code automatically. 
- The string from the `name` option is used as the first part of the action type, and the key name of each reducer function is used as the second part. So, the "counter" name + the "increment" reducer function generated an action type of `{type: "counter/increment"}`.
- In addition to the name field, createSlice needs us to pass in the initial state value for the reducers, so that there is a state the first time it gets called. In this case, we're providing an object with a value field that starts off at 0.
- `createSlice` automatically generates **action creators** with the same names as the reducer functions: 
```javascript
console.log(counterSlice.actions.increment())
// {type: "counter/increment"}
```
- `createSlice` also generates the **slice reducer** that knows how to respond to all the action types: 
```javascript
const newState = counterSlice.reducer(
  { value: 10 },
  counterSlice.actions.increment()
)
console.log(newState)
// {value: 11}
```

### Reducers
Reducers must always follow certain rules: 
- They should calculate the new state value based on the `state` and `action` arguments
- They are not allowed to modify the existing `state`. Instead, they must make _immutable updates_, by copying the existing `state` and making changes to the copied values. 
- They must not do any asynchronous logic or other "side effects"

#### Reducers and Immutable Updates
- Method A: Write immutable updates by hand, by using the JS array / object spread operators and other functions (e.g. `slice` that return copies of the original values):
```javascript
function handwrittenReducer(state, action) {
  return {
    ...state,
    first: {
      ...state.first,
      second: {
        ...state.first.second,
        [action.someId]: {
          ...state.first.second[action.someId],
          fourth: action.someValue
        }
      }
    }
  }
}
```

- Method B: RTK's `createSlice` and `createReducer` use a library called `Immer` which has a JS tool called `Proxy` to wrap the data you provide, and lets you write code that mutates the wrapped date. Immer tracks all the changes you've tried to make, and then uses that list of changes to return a safely immutably updated value, as if you'd written all the immutable logic by hand:
```javascript
function reducerWithImmer(state, action) {
  state.first.second[action.someId].fourth = action.someValue
}
```
	- **Note**: Don't use any mutating logic in reducers without Immer, it will mutate the state and cause bugs. 

### Writing Async Logic with Thunks
- A **thunk** is a specific kind of Redux function that can contain asynchronous logic. 
- Thunks are written using 2 functions: 
1. An inside thunk function, which gets `dispatch` and `getState` as arguments. 
2. The outside creator function, which creates and returns the thunk function. 
- This is a **thunk action creator**: 
```javascript
// The function below is called a thunk and allows us to perform async logic.
// It can be dispatched like a regular action: `dispatch(incrementAsync(10))`.
// This will call the thunk with the `dispatch` function as the first argument.
// Async code can then be executed and other actions can be dispatched
export const incrementAsync = amount => dispatch => {
	setTimeout(() => {
		dispatch(incrementByAmount(amount))
	}, 1000)
}
```

- A thunk action creator can be used in the same way as any other action creator: 

```javascript
store.dispatch(incrementAsync(5))
```

- Using thunks requires the `redux-thunk` middleware that can be added to the Redux store when it's created (RTK's `configureStore` method does this setup automatically).

- When you need to make AJAX calls to fetch data from the server, you can put that call in a thunk: 
```javascript
// counterSlice.js

// the outside "thunk creator" function
const fetchUserById = userId => {

	// the inside "thunk function"
	return async (dispatch, getState) => {
		try {
			
			// make an async call in the thunk
			const user = await userAPI.fetchById(userId)
			
			// dispatch an action when we get the response back
			dispatch(userLoaded(user))
		
		} catch (err) {
			// handle errors
		}
	}
}
```

## The React Counter Component
- Here's the code: 
```javascript
features/counter/Counter.js

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount
} from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()
  const [incrementAmount, setIncrementAmount] = useState('2')

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      {/* omit additional rendering output here */}
    </div>
  )
}
```
- While React includes built-in hooks like `useState` and `useEffect`, other libraries can create their own custom hooks to build custom logic. The `React-Redux` library has a set of custom hooks (e.g. `useSelector` and `useDispatch`) that allow your React component to interact with a Redux store.

### Reading Data with `useSelector`
- The `useSelector` hooks lets a component extract whatever pieces of data it needs from the Redux store state. 
- `useSelector` requires a `selector` as its argument, which is a function that takes `state` as an argument and returns some part of the state value (the part you're trying to select):
```javascript
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCount = state => state.counter.value
``` 

- Rather than accessing state in the store directly, you pass a selector to `useSelector` and save the copy of state that's returned in a local variable to use:
```javascript
const count = useSelector(selectCount)

// we could also pass the selector inline
const countPlusTwo = useSelector(state => state.counter.value + 2)
``` 

- **Any time an action is dispatched and the Redux store has been updated, `useSelector` will re-run the selector function. If the selector function returns a different value than the last time, `useSelector` will make sure our component re-renders with the new value.**

### Dispatching Actions with `useDispatch`
- The `useDispatch` hook gives us access to the Redux store by giving us the actual `dispatch` method: 
```javascript
const dispatch = useDispatch()
```
- Use the `dispatch` method to dispatch actions when the user does something, like clicking a button: 
```javascript
//features/counter/Counter.js

<button
	className={styles.button}
	aria-label="Increment value"
	onClick={() => dispatch(increment())}
>
	+
</button>
```

### Don't Put Everything in the Redux Store
- Global state that is needed across the app should go in the Redux store. 
- State that's only needed in one place should be kept in component state. 
- In this example, there's an input textbox where the user can type the next number to be added to the counter: 
```
//features/counter/Counter.js

const [incrementAmount, setIncrementAmount] = useState('2')

// later
return (
  <div className={styles.row}>
    <input
      className={styles.textbox}
      aria-label="Set increment amount"
      value={incrementAmount}
      onChange={e => setIncrementAmount(e.target.value)}
    />
    <button
      className={styles.button}
      onClick={() => dispatch(incrementByAmount(Number(incrementAmount) || 0))}
    >
      Add Amount
    </button>
    <button
      className={styles.asyncButton}
      onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
    >
      Add Async
    </button>
  </div>
)
```
	- Even though there is a Redux store for storing the counter value, the `incrementAmount`, which is a string used to store the user's current input in the textbox, is stored locally to the `Counter` component using the `useState` hook, not in the Redux store. 
	- **Note**: the **`increment Async` thunk** from `counterSlice.js` is dispatched just  other synchronous action creators. 

### Providing the Store
- The `Provider` component is used at the top-level of the app to pass down the Redux store behind the scenes so the redux hooks (e.g. `useSelector`) can access it:

```
// src/index.js

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## Basic Redux Data Flow - Redux Essentials example app
- From https://redux.js.org/tutorials/essentials/part-3-data-flow
- Forked the github: https://github.com/daisycrego/redux-essentials-example-app
- Using a clone of that fork as the basis for `Documents/builderVersions/bldr_v2`

### Main Posts Feed
- The main feature for the example app is a list of posts. 

#### Creating the Posts Slice
- The posts data will be stored in a Redux slice:
```javascript
// features/posts/postsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'

import { postAdded } from './postsSlice'


const initialState = [
	{ id: '1', title: 'First Post!', content: 'Hello!' },
	{ id: '2', title: 'Second Post', content: 'More text'} 
]

const postsSlice = createSlice({
	name: 'posts', 
	initialState, 
	reducers: {
		postAdded(state, action) {
			state.push(action.payload)
		}
	}
})

// export the action creator automatically created by createSlice based on the reducer
export const { postAdded } = postsSlice.actions

export default postsSlice.reducer
```
- Our posts slice is responsible for handling all updates to the posts data. 
- Inside of the `createSlice` call, there's an object called `reducers`. We've added a reducer function, `postAdded`, to handle the case of a post being added.
- The`postAdded` reducer receives 2 arguments: the current state value, and the action object that was dispatched. Since the posts slice only knows about the data it's responsible for, the state argument will be the array of posts by itself, and not the entire Redux state object.
- The `action` object will have the new post entry as the `action.payload` field, and the new post object is pushed into the `state` array. 
- **Note**: `createSlice` uses immer, so `push` can be used safely to update `state`. 
- Once the `postAdded` reducer function is written, `createSlice` automatically generates an "action creator" function with the same name. The action creator can be exported and used in the UI components to dispatch the action with the post payload when the user clicks "Save Post".

- The slice will be imported to the store:
```
// src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postsSlice'

export default configureStore({
  reducer: {
  	posts: postsReducer
  }
})
```

- Posts are read from the Redux store and displayed using the `PostsList` component: 
```javascript
// features/posts/PostsList.js

import React from 'react'
import { useSelector } from 'react-redux'

export const PostsList = () => {
	// selector
	const posts = useSelector(state => state.posts)

	const renderedPosts = posts.map(post => (
		<article className="post-excerpt" key={post.id}>
			<h3>{post.title}</h3>
			<p>{post.content.substring(0,100)}</p>
		</article>
	))

	return (
		<section>
			<h2>Posts</h2>
			{ renderedPosts }
		</section>
	)
}
```

- The `AddPostForm` component is used to handle updates to the Redux store:
```javascript
// features/posts/AddPostForm.js

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'

import { postAdded } from './postsSlice'

export const AddPostForm = () => {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')

	const dispatch = useDispatch()

	const onTitleChanged = e => setTitle(e.target.value)
	const onContentChanged = e => setContent(e.target.value)

	const onSavePostClicked = () => {
	    if (title && content) {
	      dispatch(
	        postAdded({
	          id: nanoid(),
	          title,
	          content
	        })
	      )

	      setTitle('')
	      setContent('')
	    }
 	}

	return (
		<section>
			<h2>Add a New Post</h2>
			<form>
				<label htmlFor="postTitle">Post Title:</label>
				<input
					type="text"
					id="postTitle"
					name="postTitle"
					value={title}
					onChange={onTitleChanged}
				/>

				<label htmlFor="postContent">Content:</label>
				<textarea
					id="postContent"
					name="postContent"
					value={content}
					onChange={onContentChanged}
				/>
				<button type="button" onClick={onSavePostClicked}>Save Post</button>
			</form>
		</section>
	)
}
```
- Redux Toolkit has a nanoid function we can use for generating a random unique ID for each post object which is sent when we dispatch the `postAdded` action creator.
- The store's `dispatch` function is accessed via the `useDispatch` hook from React-Redux. 
- The `dispatch` function can be used to call `dispatch(postAdded())` in a click handler. The title and content values are then taken from the React component's (`AddPostForm`'s) `useState` hooks. A new ID is generated using nanoid, and then this data is put together into a new post object that is passed to `postAdded()`. 

## Redux Data Flow Cycle
This app demonstrates the Redux data flow cycle: 
- Posts read the initial set of posts from the store with `useSelector` and render the initial UI. 
- The `postAdded` action is dispatched with an object containing the data for the new post entry. 
- The posts reducer sees the `postAdded` action and updated the posts array with the new entry. 
- The Redux store tells the UI that some data has changed.
- The posts list reads the updated posts array and re-renders itself to show the new post. 

## Using Redux Data
- From: https://redux.js.org/tutorials/essentials/part-4-using-data


### Showing Single Posts
- Add a `SinglePostPage` to display a single post's full contents: 
```javascript
import React from 'react'
import { useSelector } from 'react-redux'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  const post = useSelector(state =>
    state.posts.find(post => post.id === postId)
  )

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
      </article>
    </section>
  )
}
```
- `useSelector` is used to select the post by id. 
- React Router will pass a `match` object as a prop that contains the URL information, `match.params`, which in this case is stored in `postId`. 
- `postId` is used in a selector function to find the right post object from the Redux store. 

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
