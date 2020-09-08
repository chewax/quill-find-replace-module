import Quill from "quill";
const Inline = Quill.import('blots/inline');

class HighlightBlot extends Inline {
	static blotName = 'SearchHighlight';
	static className = 'ql-search-string-highlight';
	static tagName = 'div';
}

export default HighlightBlot;