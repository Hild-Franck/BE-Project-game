import broker from "./broker"
import database from "./database"
import gameTypes from './types'

const startingTime = process.eventNames.STARTING_TINE || 3000
const games = {}

export const startGame = async data => {
	const lobbyData = await database.hgetall(data.lobby)
	const gameType = gameTypes[lobbyData.type]
	games[data.lobby] = {
		level: 1,
		answers: [],
		...gameType.generateQuestion()
	}
	const game = games[data.lobby]
	const time = (lobbyData.roundDuration || 10)*1000
	const numberOfRounds = lobbyData.numberOfRounds || 10

	game.answers[game.level] = {}

	setTimeout(() => {
		broker.broadcast(`lobby.game_start`, { type: 'GAME_STARTED', id: data.lobby, level: game.level, proposition: game.proposition, end: Date.now()+time })
		game.interval = setInterval(() => {
			game.level++
			const question = gameType.generateQuestion()
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