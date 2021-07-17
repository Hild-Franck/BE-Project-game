import forEach from 'lodash/forEach'

import broker from "./broker"
import database from "./database"
import gameTypes from './types'

const startingTime = process.eventNames.STARTING_TINE || 3000
const games = {}

export const startGame = async data => {
	const lobbyData = await database.hgetall(data.lobby)
	const gameType = gameTypes[lobbyData.type]
	const mode = lobbyData.mode ?? "normal"
	games[data.lobby] = {
		level: 1,
		mode,
		answers: [],
		...gameType.difficulties[lobbyData.difficulty ?? 0]()
	}
	const game = games[data.lobby]
	const time = (lobbyData.roundDuration || 10)*1000
	const numberOfRounds = lobbyData.numberOfRounds || 10

	game.answers[game.level] = {}

	setTimeout(() => {
		broker.broadcast(`lobby.game_start`, { type: 'GAME_STARTED', id: data.lobby, level: game.level, proposition: game.proposition, end: Date.now()+time })
		game.interval = setInterval(() => {
			if (mode == "br")
				forEach(games.answers, (user, username) => {
					if (user[game.level] == null) {
						game.players[username]--
						broker.broadcast(`lobby.br`, { type: 'LIFE_LOST', id: data.lobby, username })
					}
				})
			game.level++
			const question = gameType.difficulties[lobbyData.difficulty ?? 0]()
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