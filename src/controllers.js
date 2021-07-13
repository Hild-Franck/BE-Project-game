import { v4 as uuidv4 } from 'uuid'

import database from './database'
import broker from './broker'
import logger from './logger'

const controllers = {
	CREATE_LOBBY: async (data, user) => {
		const id = uuidv4()
		await database.hmset(id,
			"id", id,
			"owner", user.username,
			"private", !!data.private,
			"type", data.type,
			"state", "PENDING"
		)
		if (!data.private)
			await database.sadd("lobbies", id)
		await database.sadd(`players:${id}`, user.username)
		logger.info(`Creating lobby ${id} !`)
		return { lobby: id }
	},
	JOIN_LOBBY: async (data, user) => {
		const lobby = await database.hgetall(data.lobby)
		await database.sadd(`players:${data.lobby}`, user.username)
		logger.info(`${user.username} joined lobby ${data.lobby} !`)
		broker.broadcast(`lobby.join`, { type: 'LOBBY_JOIN', username: user.username, id: data.lobby })
		return lobby
	}
}

export default controllers