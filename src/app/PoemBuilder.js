import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { poemAdded, poemUpdated, poemReset } from '../features/poems/poemsSlice'
import { wordAdded, wordUpdated, currentWordUpdated } from '../features/words/wordSlice'
import { CurrentWord } from './CurrentWord'

export const PoemBuilder = ({ match }) => {
	const { poemId } = match.params

	const poem = useSelector(state => 
		state.poems.find(poem => poem.id === poemId)
	)

	console.log(JSON.stringify(poem))

	const [title, setTitle] = useState(poem.title)
	const [lines, setLines] = useState(poem.lines)

	const dispatch = useDispatch()
	const history = useHistory()

	if (!poem) {
		return (
			<section>
				<h2> Poem not found! </h2>
			</section>
		)
	}

	const syllableCounts = poem.syllableCounts; 
	const syllableLimits = poem.syllableLimits; 
	const placeholders = poem.placeholders; 

	const onTitleChanged = e => setTitle(e.target.value)

	const onSavePoemClicked = () => {
		if (lines) {
			dispatch(poemUpdated({id: poemId, title, lines}))
		}
	}

	const onCreatePoemClicked = () => {
		onSavePoemClicked()
		dispatch(poemAdded())
	}

	const onResetPoemClicked = () => {
		dispatch(poemReset(poemId))
	}

	const onChangeCurrentWord = (newWord) => {
		dispatch(currentWordUpdated(newWord))
	}

	const handleLineChange = (e, lineNum) => {
		console.log(`handleLineChange`)
		const newLine = e.target.value;
		console.log(`newLine: ${newLine}`); 
		let newLines = [...lines]
		newLines[lineNum] = newLine; 
		console.log(`newLines: ${newLines}`)
		setLines(newLines)

		// save original cursor position
		var cursorStart = e.target.selectionStart,
			cursorEnd = e.target.selectionEnd;		
		
		let line = e.target.value;

		// line from start up to current cursor position
		var leftOfCursor = e.target.value.slice(0,e.target.selectionEnd);
		var words = leftOfCursor.split(" ");
		var currentWord = words[words.length-1];

		this.onChangeCurrentWord(currentWord); // this is completing execution AFTER history has already been calculated
		
		let lines;
		const currentPoem = this.getCurrentPoem(); 
		let syllableCounts; 
		const history = this.state.history.map((poem, index) => {
			if (!poem) { return poem; }
			if (poem.id === this.state.currentPoem) {
				let currentLines = [...poem.linesEdit];
				if (!currentLines) { currentLines = this.createLines()}
				currentLines[lineNumber] = line;
				lines = currentLines; 
				syllableCounts = lines.map(line => this.getSyllableCount(line));
				return {...poem, linesEdit: currentLines};
			}
		});
		console.log(`handlePoemLineChange: syllableCounts: ${syllableCounts}`); 		
		//this.setState({ history: history, syllableCounts: syllableCounts });

		//this.validatePoem(this.getCurrentPoem());		
				
		// restore cursor position
		e.target.setSelectionRange(cursorStart, cursorEnd); 
	}

	const handlePoemClick = (e, lineNumber) => {			
		console.log(`handlePoemClick`)
		// https://stackoverflow.com/questions/7563169/detect-which-word-has-been-clicked-on-within-a-text
		var word = '';
		let selection = window.getSelection().modify;
		if (selection && window.getSelection) {
						
			// save original cursor position
			// http://dimafeldman.com/js/maintain-cursor-position-after-changing-an-input-value-programatically/
			var cursorStart = e.target.selectionStart,
				cursorEnd = e.target.selectionEnd;
			
			var sel = window.getSelection();
			if (sel.isCollapsed) {
				sel.modify('move', 'forward', 'character');
				sel.modify('move', 'backward', 'word');
				sel.modify('extend', 'forward', 'word');
				word = sel.toString();
				sel.modify('move', 'forward', 'character'); // clear selection
			} else {
				word = sel.toString();
			}
			
			// restore cursor position
			e.target.setSelectionRange(cursorStart, cursorEnd);
		}
		
		this.onChangeCurrentWord(word)
		
		//this.setState({currentLine: lineNumber});
	};

	const linesRendered = lines.map((line, lineNum) => 
		<span key={`line_${lineNum}`} className="line">
		<textarea 
			key={lineNum} 
			value={line} 
			onChange={(e, lineNum) => this.handleLineChange(e, lineNum)}
			onClick={(e, lineNum) => this.handlePoemClick(e, lineNum)}
			placeholder={placeholders[lineNum]}
		/>
		<h4 key={`counter_${lineNum}`} className="counter"> {syllableCounts[lineNum]} / {syllableLimits[lineNum]}</h4>
		</span>
	)

	return (
		<React.Fragment>
		<div className="poemBuilder">
		<div className="poem"> 
			<div className="row">
			<div className="title">
				<span>
					<span className={'underline'}>title</span>
					:
				</span>
				<textarea 
					className="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}	
				/>
			</div>

			<h2 title={title} onChange={onTitleChanged}/>
			<button onClick={onSavePoemClicked}>Save</button>
			<button onClick={onCreatePoemClicked}>Save & Create New</button>
			<button onClick={onResetPoemClicked}>Reset</button>
			</div>
			<div className="lines">
				{linesRendered}
				<hr className="divider"/>
			</div>
		</div> 
		<CurrentWord/>
		</div>
		</React.Fragment>
	)
}
	/*
	if (!poem) { return null; }
	const syllableCounts = poem.syllableCounts; 
	const syllableLimits = poem.syllableLimits; 
	if (!syllableCounts || !syllableLimits) {
		console.log(`syllableCounts: ${syllableCounts}, syllableLimits: ${syllableLimits}`);
		return null; 
	}

	const lines = poem.lines; 

	if (!lines) { return null; }

	const poemIsEmpty = lines.reduce((poemIsEmpty, currentLine) => !currentLine && poemIsEmpty, true); 

	const title = poem.title; 

	
	return (
		<React.Fragment>
			<div className="poem">

				<div className="row">
					<Title
					title={title}
					/>
					
					{ !poemIsEmpty ?   					
							<React.Fragment>
								<button
									value="Save"
									/>
								
								</React.Fragment>
					: null }

				</div>
				<div className="lines">
					<Lines
						lines={lines} 
						syllableLimits={syllableLimits}
						syllableCounts={syllableCounts}
						placeholders={placeholders}
						currentLine={currentLine}
					/>
					<hr className="divider"/>
				</div>
			</div>

			<CurrentWord currentWord={currentWord}/>
		</React.Fragment>
	)
	*/



