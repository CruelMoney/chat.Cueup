
export const urlMatcher = /(?:(http|https)?:\/\/)?[w{2:4}]?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}/imu;
const urlMatchers = () => [
	urlMatcher
];

const numberMatchers = () => [
	/\b(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)(?:(\s|\W|)+|$)){1,}/ig,
	/(\+)?(?:[0-9-]\s*){8,}/gi,
];

const simpleEmailMatchers = [
	/@/im,
	/yahoo/im,
	/yaho/im,
	/gmail/im,
	/outlook/im,
	/icloud/im,
	/hotmail/im,
	/g mail/im,

];
const emailMatchers = () => [
	/[A-Z0-9\._%+-]+(\s*(at|@)\s*|\s*[\[|\{|\(]+\s*(at|@)\s*[\)|\}\]]+\s*)([A-Z0-9\.-]+\s*(\.|\s*[\[|\{|\(]*\s*(dot|\.)\s*[\)|\}|\]]*\s*))+\s*[a-z]{2,6}/im,
	...simpleEmailMatchers,
];


const stringContainsLetters = msg => {
	return /[A-Za-z]/im.test(msg);
}

const containsNumber = msg => {
	// strict match that requires letters in the message
	console.log("check letter")
	if(!stringContainsLetters(msg)){
		return true;
	}
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
		const [match] = msg.match(m) || [];

		if (match) {
			return [...new Set([...matches, match])];
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
	return replacer(urlMatchers, "{{URL hidden}}")(msg);
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
