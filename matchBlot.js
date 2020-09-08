import Quill from "quill";
const Inline = Quill.import('blots/inline');

class MatchBlot extends Inline {
	static blotName = 'SearchMatch';
	static className = 'ql-search-string-match';
	static tagName = 'div';
}

export default MatchBlot;