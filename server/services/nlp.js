const urlMatchers = () => [
	/(?:(ftp|http|https)?:\/\/)?[w{2:4}](?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}/ig
];

const numberMatchers = () => [
	/(\+)?(?:[0-9]\s*){8,}/ig
];

const emailMatchers = () => [
	/[A-Z0-9\._%+-]+(\s*@\s*|\s*[\[|\{|\(]+\s*(at|@)\s*[\)|\}\]]+\s*)([A-Z0-9\.-]+(\.|\s*[\[|\{|\(]+\s*(dot|\.)\s*[\)|\}|\]]+\s*))+[a-z]{2,6}/ig
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
	replacement = "{{personal information removed}}"
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

const replaceNumbers = replacer(numberMatchers, "{{number removed}}");
const replaceEmails = replacer(emailMatchers, "{{email removed}}");
const replaceURLs = replacer(urlMatchers, "{{URL removed}}");

const replaceAll = msg => {
	msg = replacer(numberMatchers, "{{number removed}}")(msg);
	msg = replacer(emailMatchers, "{{email removed}}")(msg);
	return replacer(urlMatchers, "{{URL removed}}")(msg);
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
