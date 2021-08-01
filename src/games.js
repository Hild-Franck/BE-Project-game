import forEach from 'lodash/forEach'
import reduce from 'lodash/reduce'
import filter from 'lodash/filter'

import broker from "./broker"
import database from "./database"
import gameTypes from './types'
import logger from './logger'

const startingTime = process.eventNames.STARTING_TINE || 3000
const games = {}

const setBrTime = (previousTime, level) => {
	if (level % 3 !== 0) return previousTime;
	if (previousTime > 10) return (previousTime-5)
	return previousTime-1
}

const updateGame = (lobbyData, game, mode, time, gameType, numberOfRounds, data) => {
	if (mode == "br") {
		forEach(game.answers, (a, b) => {
			if (a[game.level] == undefined) {
				game.players[b]--
				broker.broadcast(`lobby.br`, { type: 'LIFE_LOST', id: data.lobby, username: b })
			}
		})
	}
	game.level++
	const newTime = mode == "br" ? setBrTime(time, game.level) : time
	const question = gameType.difficulties[lobbyData.difficulty ?? 0]()
	game.answer = question.answer
	const playersAlive = filter(game.players, lives => lives > 0)
	if ((mode == "br" && playersAlive.length <= 1) || game.level > numberOfRounds) {
		delete games[data.lobby]
		return broker.broadcast(`lobby.game_end`, { type: 'GAME_ENDED', id: data.lobby, level: game.level })
	}
	broker.broadcast(`lobby.in_game`, { type: 'IN_PROGRESS', id: data.lobby, level: game.level, proposition: question.proposition, end: Date.now()+(newTime*1000) })
	setTimeout(updateGame, (newTime*1000), lobbyData, game, mode, newTime, gameType, numberOfRounds, data)
}

export const startGame = async data => {
	const lobbyData = await database.hgetall(data.lobby)
	const gameType = gameTypes[lobbyData.type]
	const mode = lobbyData.mode || "normal"
	games[data.lobby] = {
		level: 1,
		mode,
		answers: reduce(data.players, (acc, username) => ({
			...acc, [username]: []
		}), {}),
		players: reduce(data.players, (acc, username) => ({
			...acc, [username]: 3
		}), {}),
		...gameType.difficulties[lobbyData.difficulty ?? 0]()
	}
	const game = games[data.lobby]
	const time = mode == "br" ? 30 :(lobbyData.roundDuration || 10)
	const numberOfRounds = lobbyData.numberOfRounds || 10

	logger.info(`New game started for lobby ${data.lobby}`)

	setTimeout(() => {
		broker.broadcast(`lobby.game_start`, { type: 'GAME_STARTED', id: data.lobby, level: game.level, proposition: game.proposition, end: Date.now()+(time*1000) })
		setTimeout(updateGame, (time*1000), lobbyData, game, mode, time, gameType, numberOfRounds, data)
	}, startingTime)
}

export default games