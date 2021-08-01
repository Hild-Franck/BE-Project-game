const countries = [
	{ code: "fr", name: "France" },
	{ code: "ca", name: "Canada" },
	{ code: "au", name: "Australie" },
	{ code: "es", name: "Espagne" },
	{ code: "br", name: "Bresil" },
	{ code: "us", name: "Etats-Unis" },
	{ code: "ar", name: "Argentine" },
	{ code: "it", name: "Italie" },
	{ code: "pt", name: "Portugal" },
	{ code: "tr", name: "Turquie" },
	{ code: "ru", name: "Russie" },
	{ code: "gr", name: "Grece" },
	{ code: "se", name: "Suede" },
	{ code: "no", name: "Norvege" },
	{ code: "ie", name: "Irlande" },
	{ code: "gb", name: "Royaume-Uni" },
	{ code: "de", name: "Allemagne" },
	{ code: "pl", name: "Pologne" },
	{ code: "be", name: "Belgique" },
]

const questions = [
	() => {
		const country = countries[Math.floor(Math.random() * countries.length)]
		const link = `https://www.countryflags.io/${country.code}/flat/64.png`
		return { proposition: link, answer: country.name }
	}
]

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

const geographyFlags = {
	category: "geography",
	subcategory: "flags",
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

export default geographyFlags