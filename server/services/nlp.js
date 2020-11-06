
export const urlMatcher = /(?:(http|https)?:\/\/)?[w{2:4}]?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}/imu;
const urlMatchers = () => [
	urlMatcher
];

const numberMatchers = (msg) => [
	 ...getSmartNumberMatchers(msg),
	 /\b(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)(?:(\s|\W|)+|$)){1,}/ig,
	// /(\+)?(?:[0-9]\s*){8,}/gi,
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

const getSmartNumberMatchers = (msg) => {

	let smartMatchers = [];
	// clean string
	const cleaned = msg.replace(/[^A-Za-z0-9]/gi, "");
	
	// number 7 chars or longer
	const matcher = /[0-9]{7,}/g;
	const matches = cleaned.matchAll(matcher);

	for (const match of matches) {
		const startIndex = match.index;
		const endIndex = match.index + match[0].length - 1;
		const firstNumber = cleaned[startIndex];
		const lastNumber = cleaned[endIndex];
		
		smartMatchers.push( new RegExp(`${firstNumber}(.*)${lastNumber}`, "gi"));		
	}

	return smartMatchers;
}

const containsNumber = msg => {
	// strict match that requires letters in the message
	if(!stringContainsLetters(msg)){
		return true;
	}
	return numberMatchers(msg).some(m => m.test(msg));
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
	replacement = "{{personal information hidden}}",
	maxRecursion = 10
) => msg => {
	
	const ss = matchers(msg).reduce((matches, m) => {
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
	if(maxRecursion === 0){
		return newMsg
	}
	return replacer(matchers, replacement, maxRecursion-1)(newMsg);
};

const replaceNumbers = replacer(numberMatchers, "{{number hidden}}");
const replaceEmails = replacer(emailMatchers, "{{email hidden}}");
const replaceURLs = replacer(urlMatchers, "{{URL hidden}}");

const replaceAll = msg => {
	msg = replaceNumbers(msg);
	msg = replaceEmails(msg);
	return replaceURLs(msg);
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
