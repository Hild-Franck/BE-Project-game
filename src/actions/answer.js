import games from '../games'

const answer = {
	params: {},
	handler: async ({ params }) => {
		const game = games[params.lobby]

		if (params.level != game.level)
			throw new Error("Not the right level")
		if (game.answers[params.username][game.level])
			throw new Error("Already answered")
		
		const answer = game.check(game.answer, params.answer)

		if (game.mode === "br") {
			if (!game.players[params.username]) throw new Error("No life remaining")
			if (!answer) game.players[params.username]--
		}
		
		game.answers[params.username][game.level] = true

		const response = { username: params.username, answer, level: game.level, lobby: params.lobby }

		if (game.mode === "br") response.lives = game.players[params.username]
		
		const allAnswered = Object.keys(game.answers).every(key => game.answers[key][game.level] != undefined)

		if (allAnswered) game.forceUpdate()

		return response
	}
}

export { answer }