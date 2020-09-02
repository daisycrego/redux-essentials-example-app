import React from 'react'; 
import { Line } from './Line';

export const Lines = ({ lines, placeholders, syllableCounts, syllableLimits, currentLine }) => { 
	if (!lines) { return null; }
	return (
		lines && lines.length ? 
			lines.map((line, i) => {
				return (<Line 
					className="line"
					lineValid={syllableCounts[i] === syllableLimits[i] ? true : false}
					key={i} 
					line={line} 
					placeholderLine={placeholders[i]}
					currentLine={currentLine}
					syllableLimit={syllableLimits[i]} 
					syllableCount={syllableCounts[i] ? syllableCounts[i]: 0}
					index={i}
				/>);
			})
		: null
	);
}