const randomInt = (max=20, min=0) => Math.floor(min + Math.random() * max)
const symbols = [ "+", "-", "*" ]
const symbolMapping = {
	"+": {
		leftMember: () => randomInt(),
		rightMember: () => randomInt()
	},
	"-": {
		leftMember: () => randomInt(null, 5),
		rightMember: previous => randomInt(previous)

	},
	"*": {
		leftMember: () => randomInt(10),
		rightMember: () => randomInt(10)
	}
}

const generateQuestion = () => {
	const symbol = symbols[Math.floor(Math.random() * symbols.length)]
	const leftMember = symbolMapping[symbol].leftMember()
	const rightMember = symbolMapping[symbol].rightMember(leftMember)
	const proposition = `${leftMember} ${symbol} ${rightMember}`
	return { proposition, answer: eval(proposition) }
}

const mathAlgebra = {
	category: "math",
	subcategory: "algebra",
	generateQuestion
}

export default mathAlgebra