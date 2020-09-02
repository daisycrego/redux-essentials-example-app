const { Poem } = require('./models/Poem')
const { Word } = require('./models/Word')

// Read all words present in db
const fetchWords = async (req, reply) => {
	try {
		const words = await Word.find()
		return words
	}
	catch(err) { console.log(err) }
}

// Add a word to the db
const addWord = async (req, reply) => {
	try {
		const newWord = new Word({...req.body})
		return newWord.save()
	}
	catch(err) { console.log(err) }
}

// Update word present in db
const updateWord = async (req, reply) => {
	try {
		const { word } = req.params
		const { wordObject } = req.body
		const updatedWord = await Word.findOneAndUpdate({word}, wordObject, { new: true })
		return updatedWord
	}
	catch (err) { console.log(err) }
}

// Delete word from db
const deleteWord = async (req, reply) => {
	try {
		const { word } = req.params
		const deletedWord = await Word.findOneAndDelete({ word })
		return deletedWord
	}
	catch (err) { console.log(err) }
}

module.exports = { fetchWords, addWord, updateWord, deleteWord }