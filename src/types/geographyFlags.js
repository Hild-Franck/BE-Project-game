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
	{ code: "uk", name: "Royaume-Unis" },
	{ code: "de", name: "Allemagne" },
	{ code: "pl", name: "Pologne" },
	{ code: "be", name: "Belge" },
]

const questions = [
	() => {
		const country = countries[Math.floor(Math.random() * countries.length)]
		const link = `https://www.countryflags.io/${country.code}/flat/64.png`
		return { proposition: link, answer: country.name }
	}
]

const geographyFlags = {
	category: "geography",
	subcategory: "flags",
	difficulties: [
		() => questions[0](),
	]
}

export default geographyFlags