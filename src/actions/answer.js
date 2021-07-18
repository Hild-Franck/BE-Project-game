import database from '../database'
import games, { startGame } from '../games'

const answer = {
	params: {},
	handler: async ({ params }) => {
		const game = games[params.lobby]

		if (!game.answers[params.username]) game.answers[params.username] = []
		if (params.level != game.level)
			throw new Error("Not the right level")
		if (game.answers[params.username][game.level])
			throw new Error("Already answered")
		
		const answer = params.answer == game.answer

		if (game.mode === "br") {
			if (!game.players[params.username]) throw new Error("No life remaining")
			if (!answer) game.players[params.username]--
		}
		
		game.answers[params.username][game.level] = answer

		const response = { username: params.username, answer, level: game.level, lobby: params.lobby }

		if (game.mode === "br") response.lives = game.players[params.username]

		return response
	}
}

export { answer }