const phoneExtractor = require("phone-number-extractor");

const containsNumber = async msg => {
	try {
		const numbers = await phoneExtractor.getCandidates(msg);
		return numbers.length > 0;
	} catch (error) {
		return false;
	}
};

const containsEmail = async msg => {
	const match = /\b[A-Z0-9\._%+-]+([\[|\{|\(|\s*]*(at|@)[\s|\)|\}\]]*\s*)+[A-Z0-9\.-]+([A-Z0-9\.-]+(\.|\s*[\[|\{|\(]*\s*(dot|\.)\s*[\)|\}|\]]*\s*))[a-z]{2,6}\b/;
	return match.test(msg);
};

export { containsNumber, containsEmail };
