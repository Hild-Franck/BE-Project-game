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

export const updateGame = (lobbyData, game, mode, time, gameType, numberOfRounds, data) => {
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
	game.time = newTime
	const question = gameType.difficulties[lobbyData.difficulty ?? 0]()
	game.answer = question.answer
	const playersAlive = filter(game.players, lives => lives > 0)
	if ((mode == "br" && playersAlive.length <= 1) || (mode != "br" && game.level > numberOfRounds)) {
		delete games[data.lobby]
		return broker.broadcast(`lobby.game_end`, { type: 'GAME_ENDED', id: data.lobby, level: game.level })
	}
	broker.broadcast(`lobby.in_game`, { type: 'IN_PROGRESS', id: data.lobby, level: game.level, proposition: question.proposition, end: Date.now()+(newTime*1000) })
	game.timeout = setTimeout(() => {
		broker.broadcast(`lobby.pause_game`, { type: 'GAME_PAUSE', id: data.lobby, level: game.level, answer: question.answer, end: Date.now()+5000 })
		setTimeout(updateGame, (5000), lobbyData, game, mode, newTime, gameType, numberOfRounds, data)
	}, (newTime*1000))
}

export const startGame = async data => {
	const lobbyData = await database.hgetall(data.lobby)
	const gameType = gameTypes[lobbyData.type]
	const mode = lobbyData.mode || "normal"
	const time = mode == "br" ? 30 :(lobbyData.roundDuration || 10)
	const numberOfRounds = lobbyData.numberOfRounds || 10

	const game = {
		forceUpdate: () => {
			logger.info("Forcing update...")
			clearTimeout(game.timeout)
			broker.broadcast(`lobby.pause_game`, { type: 'GAME_PAUSE', id: data.lobby, level: game.level, answer: game.answer, end: Date.now()+5000 })
			const newTime = mode == "br" ? setBrTime(time, game.level+1) : game.time
			game.time = newTime
			setTimeout(updateGame, (5000), lobbyData, game, mode, newTime, gameType, numberOfRounds, data)
		},
		level: 1,
		mode,
		time,
		timeout: null,
		check: gameType.check,
		answers: reduce(data.players, (acc, username) => ({
			...acc, [username]: []
		}), {}),
		players: reduce(data.players, (acc, username) => ({
			...acc, [username]: lobbyData.numberOfLives
		}), {}),
		...gameType.difficulties[lobbyData.difficulty ?? 0]()
	}
	games[data.lobby] = game

	logger.info(`New game started for lobby ${data.lobby}`)
	broker.broadcast(`lobby.game_starting`, { type: 'GAME_STARTING', id: data.lobby, end: Date.now()+startingTime })
	setTimeout(() => {
		broker.broadcast(`lobby.game_start`, { type: 'GAME_STARTED', id: data.lobby, level: game.level, proposition: game.proposition, end: Date.now()+(time*1000) })
		game.timeout = setTimeout(() => {
			broker.broadcast(`lobby.pause_game`, { type: 'GAME_PAUSE', id: data.lobby, level: game.level, answer: game.answer, end: Date.now()+5000 })
			setTimeout(updateGame, (5000), lobbyData, game, mode, time, gameType, numberOfRounds, data)
		}, (time*1000))
	}, startingTime)
}

export default games