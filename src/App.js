import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { Navbar } from './app/Navbar'
import { AddPostForm } from './features/posts/AddPostForm'
import { EditPostForm } from './features/posts/EditPostForm'
import { PoemsList} from './features/poems/PoemsList'
import { PostsList } from './features/posts/PostsList'
import { SinglePoemPage } from './features/poems/SinglePoemPage'
import { SinglePostPage } from './features/posts/SinglePostPage'
import { PoemBuilder } from './app/PoemBuilder'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                <PostsList/>
                <AddPostForm/>
                <PoemsList/>
              </React.Fragment>
            )}
          />
          <Route
            exact
            path="/history"
            render={() => (
              <React.Fragment>
                <PoemsList/>
              </React.Fragment>
            )}
          />
          <Route exact path="/poems/:poemId" component={PoemBuilder}/>
          <Route exact path="/posts/:postId" component={SinglePostPage}/>
          <Route exact path="/editPost/:postId" component={EditPostForm}/>
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
