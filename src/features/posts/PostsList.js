import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectAllPosts, fetchPosts } from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'


export const PostsList = () => {
	// selector
	const dispatch = useDispatch()
	const posts = useSelector(selectAllPosts)

	const postStatus = useSelector(state => state.posts.status)
	const error = useSelector(state => state.posts.error)

	useEffect(() => {
		if (postStatus === 'idle') {
			dispatch(fetchPosts())
		}
	}, [postStatus, dispatch])

	let content

	if (postStatus === 'loading') {
		content = <div className="loader">Loading</div>
	} else if (postStatus === 'succeeded') {
		// Sort posts in reverse chronological order by datetime string
		const orderedPosts = posts
			.slice()
			.sort((a,b) => b.date.localeCompare(a.date))

		content = orderedPosts.map(post => (
			<article className="post-excerpt" key={post.id}>
				<h3>{post.title}</h3>
				<PostAuthor userId={post.user} />
				<TimeAgo timestamp={post.date} />
				<p>{post.content.substring(0,100)}</p>
				<Link to={`/posts/${post.id}`} className="button muted-button">
					View Post 
				</Link>
			</article>
		))
	} else if (postStatus === 'failed') {
		content = <div>{error}</div>
	}

	return (
		<section>
			<h2>Posts</h2>
			{ content }
		</section>
	)
}