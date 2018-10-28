const containsNumber = async msg => {
	const match = /(?:[0-9]\s*){8,}/;
	return match.test(msg);
};

const containsEmail = async msg => {
	const match = /[A-Z0-9\._%+-]+(\s*@\s*|\s*[\[|\{|\(]+\s*(at|@)\s*[\)|\}\]]+\s*)([A-Z0-9\.-]+(\.|\s*[\[|\{|\(]+\s*(dot|\.)\s*[\)|\}|\]]+\s*))+[a-z]{2,6}/i;
	return match.test(msg);
};

export { containsNumber, containsEmail };
