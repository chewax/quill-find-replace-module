
class Searcher {
  constructor(quill, options) {
    this.quill = quill;

    this.options = {
      searchInput: options.searchInput || "search-input",
      replaceInput: options.replaceInput || "replace-input",
      searchButton: options.searchButton || "search-button",
      replaceButton: options.replaceButton || "replace-button",
      replaceAllButton: options.replaceAllButton || "replace-all-button",
      onNext: typeof options.onNext == 'function' ? options.onNExt : () => { }
    }

    this.searchInput = document.querySelector(`#${this.options.searchInput}`);
    this.replaceInput = document.querySelector(`#${this.options.replaceInput}`);
    this.searchButton = document.querySelector(`#${this.options.searchButton}`);
    this.replaceButton = document.querySelector(`#${this.options.replaceButton}`);
    this.replaceAllButton = document.querySelector(`#${this.options.replaceAllButton}`);

    this.searchButton.addEventListener("click", this.search.bind(this, false));
    this.searchInput.addEventListener("keyup", this.keyPressedHandler.bind(this));
    if (this.replaceButton) this.replaceButton.addEventListener("click", this.replace.bind(this));
    if (this.replaceAllButton) this.replaceAllButton.addEventListener("click", this.replaceAll.bind(this));

    this.searchStr = this.searchInput.value;
    this.iterator = this.makeSearchIterator("");
  }

  highlight(index, length, on = true) {
    if (index < 0 || length <= 0) return;

    if (on) {
      this.removeStyle(['SearchMatch'], index, length);
      this.applyStyle(['SearchHighlight'], index, length);
    }
    else {
      this.removeStyle(['SearchHighlight'], index, length);
      this.applyStyle(['SearchMatch'], index, length);
    }
  }

  search(forceNew) {
    this.searchStr = this.searchInput.value;

    if (this.searchStr) {

      if (this.iterator.currentSearch() == this.searchStr && this.iterator.hasNext() && !forceNew) {
        let patternLength = this.iterator.currentSearch().length;

        this.highlight(this.iterator.current(), patternLength, false);
        this.iterator.next();
        this.highlight(this.iterator.current(), patternLength, true);

        return;
      }

      this.removeStyle(['SearchMatch', 'SearchHighlight']);
      this.iterator = this.makeSearchIterator(this.searchStr);
      this.iterator.next();

      let patternLength = this.iterator.currentSearch().length;
      this.highlight(this.iterator.current(), patternLength, true);

    }

    else {
      this.removeStyle(['SearchMatch', 'SearchHighlight']);
      this.makeSearchIterator("");
    }

  }

  makeSearchIterator(pattern) {

    let totalText = this.quill.getText();
    let re = new RegExp(pattern, "gi");
    let match = re.test(totalText);
    let indices = match ? this.getIndicesOf(pattern, totalText) : [];
    indices.forEach(index => this.quill.formatText(index, pattern.length, "SearchMatch", true));

    let currentIndex = 0;
    const rangeIterator = {

      next: () => {
        if (indices.length == 0) return -1;
        let next = currentIndex < indices.length ? indices[currentIndex++] : -1;
        this.options.onNext(next);
        return next;
      },

      prev: () => {
        if (indices.length == 0) return -1;
        let prev = currentIndex > 1 ? indices[currentIndex - 2] : -1;
        return prev;
      },

      current: () => {
        let curr = currentIndex > 0 ? indices[currentIndex - 1] : -1;
        return curr;
      },

      hasNext: () => {
        return currentIndex < indices.length;
      },

      match: () => {
        return indices.length;
      },

      currentSearch: () => {
        return pattern;
      },

      updateIndices: delta => {
        indices = indices.map(i => i + delta);
      },

      done: () => {
        return currentIndex >= indices.length || !indices.length;
      }

    };

    return rangeIterator;
  }


  replace() {
    if (this.iterator.done()) this.search(/*forceNew=*/true);
    if (!this.iterator.match()) return;

    let patternLength = this.iterator.currentSearch().length;
    let replaceLength = this.replaceInput.value.length;

    this.quill.deleteText(this.iterator.current(), patternLength);
    this.quill.insertText(this.iterator.current(), this.replaceInput.value);

    this.highlight(this.iterator.current(), replaceLength, true);
    this.highlight(this.iterator.prev(), replaceLength, false);

    //Update indices due to letter shift (replace shifts the indices)
    this.iterator.updateIndices(replaceLength - patternLength);
    this.iterator.next();
  }

  replaceAll() {
    this.replace();
    while (!this.iterator.done()) {
      this.replace();
    }
    this.replace();
  }

  keyPressedHandler(e) {
    if (e.key === "Enter") {
      this.search();
    }
  }

  getIndicesOf(searchStr, str, caseSensitive = false) {
    let searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
      return [];
    }

    let startIndex = 0, index, indices = [];

    if (!caseSensitive) {
      str = str.toLowerCase();
      searchStr = searchStr.toLowerCase();
    }

    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }

    return indices;
  }

  removeStyle(blots, from = 0, len = this.quill.getText().length) {
    blots.forEach(b => this.quill.formatText(from, len, b, false));
  }

  applyStyle(blots, from = 0, len = this.quill.getText().length) {
    blots.forEach(b => this.quill.formatText(from, len, b, true));
  }

}


export default Searcher;