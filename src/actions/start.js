import database from '../database'
import { startGame } from '../games'

const start = {
	params: {},
	handler: async ({ params, nodeID }) => {
		const lobby = await database.hgetall(params.lobby)

		if (lobby.owner !== params.username)
			throw new Error("Only the lobby owner can start the game")

		// if (lobby.state !== "PENDING")
		// 	throw new Error("Game already started")

		await database.hmset(params.lobby, "state", "STARTING")
		
		startGame(params)
		return { nodeID }
	}
}

export { start }