import spells from '../questions/hpSpells.json'

const getDistance = (longer, shorter) => {
	const s1 = longer.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
	const s2 = shorter.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
	const costs = new Array()
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0)
				costs[j] = j
			else {
				if (j > 0) {
					var newValue = costs[j - 1]
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
					costs[j - 1] = lastValue
					lastValue = newValue
				}
			}
		}
		if (i > 0) costs[s2.length] = lastValue
	}
	return costs[s2.length]
}

const questions = [
	() => {
		const data = spells[Math.floor(Math.random() * spells.length)]
		return { proposition: `${data.desc}`, answer: data.spell }
	}
]

const historyEvents = {
	category: "harry-potter",
	subcategory: "spells",
	difficulties: [
		() => questions[0](),
	],
	check: (playerAnswer, answer) => {
		const longer = playerAnswer.length > answer.length
			? playerAnswer
			: answer
		const shorter = playerAnswer.length <= answer.length
			? playerAnswer
			: answer
		
		const similarity = ((longer.length - getDistance(longer, shorter)) / longer.length) * 100

		return similarity >= 80
	}
}

export default historyEvents