class Iterator {

	constructor(quill, term) {
		this.quill = quill;
		this.term = term;
		this.head = -1;
		this.indices = this.eval();
		if (this.match()) this.next();
	}

	eval() {
		let text = this.quill.getText();
		let re = new RegExp(this.term, "gi");
		let match = re.test(text);

		return match ? this.mapIndices(this.term, text) : [];
	}

	mapIndices(term, text, caseSensitive = false) {

		let result = [];

		if (term === "" || term === null || typeof term === 'undefined') return result;

		let flags = caseSensitive ? "g" : "gi";
		let re = new RegExp(term, flags);

		//change to use exec to allow regexp search.
		let match = re.exec(text);

		while (match) {

			result.push({
				term: term,
				index: match.index
			});

			match = re.exec(text);
		}

		return result;
	}

	next() {
		if (this.indices.length == 0) return -1;
		this.head = this.head < this.indices.length - 1 ? ++this.head : 0;
		return this.current();
	}

	prev() {
		if (this.indices.length == 0) return -1;
		this.head = this.head > 0 ? --this.head : this.indices.length - 1;
		return this.current();
	}

	getElementAtPosition(idx) {
		if (idx == null || typeof idx == 'undefined' || idx < 0 || idx >= this.indices.length) return null;
		return this.indices[idx];
	}

	current() {
		return this.getElementAtPosition(this.head);
	}

	remove(start = this.head) {
		this.indices.splice(start, 1);
	}

	head() {
		return this.head;
	}

	term() {
		return this.term;
	}

	match() {
		return this.indices.length;
	}

	updateIndicesFrom(from, delta) {
		for (let idx = from; idx < this.indices.length; idx++) {
			this.indices[idx].index += delta;
		}
	}
}


export default Iterator;