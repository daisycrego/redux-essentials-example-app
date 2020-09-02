import React from 'react';

export const Title = ({ title }) => {
	return (
		<div className="title">
			<span><span className={'underline'}>title</span>
			:
			</span>
			<textarea 
				className={'title'}
				value={title}
			/>
		</div>
	);
}