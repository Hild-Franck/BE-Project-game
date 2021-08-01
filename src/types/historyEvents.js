import parse from 'csv-parse/lib/sync'
import history from '../questions/history.json'

const parsed = parse(history.data, {
	delimiter: ",",
	columns: true,
  skip_empty_lines: true
})

const questions = [
	() => {
		const data = parsed[Math.floor(Math.random() * parsed.length)]
		return { proposition: `${data.desc}\n${data.region}`, answer: data.year }
	}
]

const historyEvents = {
	category: "histoire",
	subcategory: "evenements",
	difficulties: [
		() => questions[0](),
	],
	check: (playerAnswer, answer) => playerAnswer == answer
}

export default historyEvents