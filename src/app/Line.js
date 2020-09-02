import React, { useRef, useEffect } from 'react'; 

export const Line = ({ index, line, currentLine, placeholder, lineValid, syllableCount, syllableLimit }) => {
	const lineRef = useRef(null);
	useEffect(() => {
		if (index === currentLine) {
			lineRef.current.focus();
		}
	}, [index, currentLine]);
		
	return (
		<span className={`line ${lineValid ? 'valid' : 'invalid'}`}>
			<textarea 
			ref={lineRef}
			key={index} 
			contentEditable="true" 
			suppressContentEditableWarning={true} //https://stackoverflow.com/questions/49639144/why-does-react-warn-against-an-contenteditable-component-having-children-managed
			placeholder={placeholder}
			value={line}
			/>
			<h4 className="counter"> {syllableCount} / {syllableLimit}</h4>
		</span>
	);
}; 