#  Quill Find/Replace Module
A module for Quill rich text editor to allow searching/finding words and replacing them.

## Demo

[Demo](https://codepen.io/muhammedalkhudiry/pen/VoMxeK)

## Usage

```
import Searcher from "path/to/Searcher.js";
import SearchedStringBlot from "path/to/SearchBlot.js";

Quill.register('modules/Searcher', Searcher);
Quill.register(SearchedStringBlot);


const quill = new Quill('#editor', {
    // options
    theme: 'snow',
    modules: {
        Searcher: true,
    },
});
```