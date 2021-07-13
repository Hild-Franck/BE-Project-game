import database from '../database'
import games, { startGame } from '../games'

const answer = {
	params: {},
	handler: async ({ params }) => {
		const game = games[params.lobby]
		
		if (params.level != game.level)
			throw new Error("Not the right level")
		if (game.answers[game.level][params.username])
			throw new Error("Already answered")
		
		const answer = params.answer == game.answer

		// game.answers[game.level][params.username] = answer
		if (!game.answers[game.level][params.username])
			game.answers[game.level][params.username] = []
		
		game.answers[game.level][params.username][game.level] = answer

		return { username: params.username, answer, level: game.level, lobby: params.lobby }
	}
}

export { answer }