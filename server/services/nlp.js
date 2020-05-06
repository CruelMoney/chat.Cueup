const urlMatchers = () => [
	/(?:(ftp|http|https)?:\/\/)?[w{2:4}](?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}/ig
];

const numberMatchers = () => [
	/\b(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)(?:(\s|\W|)+|$)){1,}/ig,
	/(\+)?(?:[0-9]\s*){8,}/ig,
];


const emailMatchers = () => [
	/[A-Z0-9\._%+-]+(\s*(at|@)\s*|\s*[\[|\{|\(]+\s*(at|@)\s*[\)|\}\]]+\s*)([A-Z0-9\.-]+\s*(\.|\s*[\[|\{|\(]*\s*(dot|\.)\s*[\)|\}|\]]*\s*))+\s*[a-z]{2,6}/ig
];

const containsNumber = msg => {
	return numberMatchers().some(m => m.test(msg));
};

const containsEmail = msg => {
	return emailMatchers().some(m => m.test(msg));
};

const containsURL = msg => {
	return urlMatchers().some(m => m.test(msg));
};

// runs recursively until the string is stipped of mathches
const replacer = (
	matchers,
	replacement = "{{personal information hidden}}"
) => msg => {
	const ss = matchers().reduce((matches, m) => {
		const newMatches = msg.match(m);
		if (newMatches) {
			return [...new Set([...matches, ...newMatches])];
		}
		return matches;
	}, []);
	if (ss.length === 0) {
		return msg;
	}
	const newMsg = ss.reduce((newMsg, s) => newMsg.replace(s, replacement), msg);
	return replacer(matchers, replacement)(newMsg);
};

const replaceNumbers = replacer(numberMatchers, "{{number hidden}}");
const replaceEmails = replacer(emailMatchers, "{{email hidden}}");
const replaceURLs = replacer(urlMatchers, "{{URL hidden}}");

const replaceAll = msg => {
	msg = replacer(numberMatchers, "{{number hidden}}")(msg);
	msg = replacer(emailMatchers, "{{email hidden}}")(msg);

	// show urls for now
	// return replacer(urlMatchers, "{{URL hidden}}")(msg);
	return msg;
};

export {
	containsNumber,
	containsEmail,
	containsURL,
	replaceNumbers,
	replaceURLs,
	replaceEmails,
	replaceAll
};
