const { fetchWords, addWord, updateWord, deleteWord } = require('./controller')

const routes = [
	{
		method: 'GET',
		url: '/api/words',
		handler: fetchWords
	},
	{
		method: 'POST',
		url: '/api/words/:word',
		handler: addWord
	},
	{
		method: 'PUT',
		url: '/api/words/:word',
		handler: updateWord
	},
	{
		method: 'DELETE',
		url: '/api/words/:word',
		handler: deleteWord
	}
]

module.exports = routes