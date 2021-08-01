const randomInt = (max=30, min=1) => Math.floor(min + Math.random() * (max-min))
const symbols = [ "+", "-", "*", "/" ]
const symbolMapping = {
	"+": {
		leftMember: mod => mod ? randomInt(30*mod, -30*mod) : randomInt(),
		rightMember: mod => mod ? randomInt(30*mod, -30*mod) : randomInt()
	},
	"-": {
		leftMember: mod => mod ? randomInt(30*mod, -30*mod) : randomInt(30, 5),
		rightMember: (mod, previous) => mod ? randomInt(30*mod, -30*mod) : randomInt(previous)
	},
	"*": {
		leftMember: mod => mod ? randomInt(11, 3) : randomInt(10, 2),
		rightMember: mod => mod ? randomInt(11, 3) : randomInt(10, 2)
	},
	"/": {
		leftMember: mod => mod ? randomInt(30*mod, 6) : randomInt(30, 6),
		rightMember: (_, previous) => {
			const dividers = [1]
			for (let i=2; i < Math.sqrt(previous); i++) {
				if (previous % i === 0) {
					dividers.push(i)
					if (previous / i !== i) dividers.push(previous / i)
				}
			}
			return dividers[Math.floor(Math.random() * dividers.length)]
		}
	}
}

const questions = [mod => {
	const symbol = symbols[Math.floor(Math.random() * symbols.length)]
	const leftMember = symbolMapping[symbol].leftMember(mod)
	const rightMember = symbolMapping[symbol].rightMember(mod, leftMember)
	const proposition = `${leftMember} ${symbol} ${rightMember}`
	return { proposition, answer: eval(proposition) }
},
() => {
	const leftMember = randomInt(15, 2)
	const answer = randomInt(15, 2)
	const additionMember = randomInt(15, 2)
	const rightMember = eval(`${leftMember} * ${answer} + ${additionMember}`)
	const proposition = `${leftMember}𝒙 + ${additionMember} = ${rightMember}`

	return { proposition, answer }
},
() => {
	const a = randomInt(9, 2)
	const b = randomInt(9, 2)
	const proposition = `(${a} + ${b})²`
	const answer = (a ** 2) + (2*a*b) + (b**2)
	return { proposition, answer }
}]

const mathAlgebra = {
	category: "math",
	subcategory: "algebra",
	difficulties: [
		() => questions[0](),
		() => {
			const question = randomInt(3,0)
			return questions[question](5)
		}
	],
	check: (playerAnswer, answer) => playerAnswer == answer
}

export default mathAlgebra