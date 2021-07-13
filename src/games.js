import broker from "./broker"
import database from "./database"

const randomInt = (max=20, min=0) => Math.floor(min + Math.random() * max)
const startingTime = process.eventNames.STARTING_TINE || 3000
const games = {}
const symbols = [ "+", "-", "*" ]
const symbolMapping = {
	"+": {
		leftMember: () => randomInt(),
		rightMember: previous => randomInt()
	},
	"-": {
		leftMember: () => randomInt(null, 5),
		rightMember: previous => randomInt(previous)

	},
	"*": {
		leftMember: () => randomInt(10),
		rightMember: () => randomInt(10)
	}
}

const generateQuestion = () => {
	const symbol = symbols[Math.floor(Math.random() * symbols.length)]
	const leftMember = symbolMapping[symbol].leftMember()
	const rightMember = symbolMapping[symbol].rightMember(leftMember)
	const proposition = `${leftMember} ${symbol} ${rightMember}`
	return { proposition, answer: eval(proposition) }
}

export const startGame = async data => {
	const lobbyData = await database.hgetall(data.lobby)
	games[data.lobby] = {
		level: 1,
		answers: [],
		...generateQuestion()
	}
	const game = games[data.lobby]
	const time = (lobbyData.roundDuration || 10)*1000
	const numberOfRounds = lobbyData.numberOfRounds || 10

	game.answers[game.level] = {}

	setTimeout(() => {
		broker.broadcast(`lobby.game_start`, { type: 'GAME_STARTED', id: data.lobby, level: game.level, proposition: game.proposition, end: Date.now()+time })
		game.interval = setInterval(() => {
			game.level++
			const question = generateQuestion()
			game.answer = question.answer
			game.answers[game.level] = {}
			if (game.level >= numberOfRounds) {
				clearInterval(game.interval)
				delete games[data.lobby]
				return broker.broadcast(`lobby.game_end`, { type: 'GAME_ENDED', id: data.lobby, level: game.level })
			}
			broker.broadcast(`lobby.in_game`, { type: 'IN_PROGRESS', id: data.lobby, level: game.level, proposition: question.proposition, end: Date.now()+time })
		}, time)
	}, startingTime)
}

export default games