import Iterator from './iterator';

class Searcher {
	constructor(quill, options) {
		this.quill = quill;

		this.options = {
			searchInput: options.searchInput || "search-input",
			replaceInput: options.replaceInput || "replace-input",
			searchButton: options.searchButton || "search-button",
			replaceButton: options.replaceButton || "replace-button",
			replaceAllButton: options.replaceAllButton || "replace-all-button",
			prevButton: options.prevButton || "prev-match-button",
			nextButton: options.nextButton || "next-match-button",
			clearButton: options.clearButton || "clear-search-button",
		}

		this.searchInput = document.querySelector(`#${this.options.searchInput}`);
		this.replaceInput = document.querySelector(`#${this.options.replaceInput}`);
		this.searchButton = document.querySelector(`#${this.options.searchButton}`);
		this.replaceButton = document.querySelector(`#${this.options.replaceButton}`);
		this.replaceAllButton = document.querySelector(`#${this.options.replaceAllButton}`);
		this.prevButton = document.querySelector(`#${this.options.prevButton}`);
		this.nextButton = document.querySelector(`#${this.options.nextButton}`);
		this.clearButton = document.querySelector(`#${this.options.clearButton}`);

		this.searchButton.addEventListener("click", this.search.bind(this, false));
		this.searchInput.addEventListener("keyup", this.keyPressedHandler.bind(this));
		if (this.replaceButton) this.replaceButton.addEventListener("click", this.replace.bind(this));
		if (this.replaceAllButton) this.replaceAllButton.addEventListener("click", this.replaceAll.bind(this));
		if (this.prevButton) this.prevButton.addEventListener("click", this.prev.bind(this));
		if (this.nextButton) this.nextButton.addEventListener("click", this.next.bind(this));
		if (this.clearButton) this.clearButton.addEventListener("click", this.newSearch.bind(this, ""));

		this.newSearch("");
	}

	newSearch(term) {
		this.removeStyle(['SearchMatch', 'SearchHighlight']);
		this.iterator = new Iterator(this.quill, term);
		this.iterator.indices.forEach(el => this.quill.formatText(el.index, term.length, "SearchMatch", true));
		this.highlight(this.iterator.current(), true);
	}

	next() {
		this.search(false, this.iterator.next.bind(this.iterator));
	}

	prev() {
		this.search(false, this.iterator.prev.bind(this.iterator));
	}

	search(forceNew, shift) {
		//by default if no iterator shift function is passed, then iterator.next is picked as normal operation
		if (shift == null || typeof shift != 'function') shift = this.iterator.next.bind(this.iterator);

		let inputTerm = this.searchInput.value;

		if (inputTerm) {
			//Do stuff with next term
			if (this.iterator.term == inputTerm && !forceNew) {
				this.highlight(this.iterator.current(), false);
				this.highlight(shift(), true);
				return;
			};

			this.newSearch(inputTerm);

		} else {
			//Remove styling
			this.removeStyle(['SearchMatch', 'SearchHighlight']);
			this.newSearch("");
		}
	}

	replace() {

		if (!this.iterator.match()) this.search( /**forceNew=*/ true); //ther isnt an active search with results;
		if (!this.iterator.match()) return;

		let termLength = this.iterator.current().term.length;
		let replaceLength = this.replaceInput.value.length;

		this.quill.deleteText(this.iterator.current().index, termLength);
		this.quill.insertText(this.iterator.current().index, this.replaceInput.value);

		//Update indices due to letter shift (replace shifts the indices)
		this.iterator.updateIndicesFrom(this.iterator.head, replaceLength - termLength);

		this.highlight(this.iterator.getElementAtPosition(this.iterator.head), false);
		this.iterator.remove(this.iterator.head); //splice from head, count=1
		this.highlight(this.iterator.getElementAtPosition(this.iterator.head), true);
	}

	replaceAll() {
		this.replace();
		while (this.iterator.match()) {
			this.replace();
		}
		this.removeStyle(['SearchMatch', 'SearchHighlight']);
	}

	keyPressedHandler(e) {
		if (e.key === "Enter") {
			this.search();
		}
	}

	highlight(el, on = true) {
		if (el == null || typeof el == 'undefined') return;
		if (el.index < 0 || el.term.length <= 0) return;

		if (on) {
			this.removeStyle(['SearchMatch'], el.index, el.term.length);
			this.applyStyle(['SearchHighlight'], el.index, el.term.length);
		} else {
			this.removeStyle(['SearchHighlight'], el.index, el.term.length);
			this.applyStyle(['SearchMatch'], el.index, el.term.length);
		}
	}

	removeStyle(blots, from = 0, len = this.quill.getText().length) {
		blots.forEach(b => this.quill.formatText(from, len, b, false));
	}

	applyStyle(blots, from = 0, len = this.quill.getText().length) {
		blots.forEach(b => this.quill.formatText(from, len, b, true));
	}

}


export default Searcher;