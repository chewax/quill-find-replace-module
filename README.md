<!-- PROJECT LOGO -->
<!-- <p align="center">
  <a href="https://github.com/chewax/quill-find-replace-module">
    <img src="media/logo.svg" alt="Logo" width="660" height="260">
  </a>
</p>

<br> -->

[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![Last Commit][last-commit-shield]][last-commit-url]
[![MIT License][license-shield]][license-url]



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project
 
A module for Quill rich text editor to allow searching/finding words and replacing them.  
Based on the work of [@KMLX28](https://github.com/KMLX28)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.


### Installation

1. Clone the Ginseng into repo  

```sh
git clone https://github.com/chewax/quill-find-replace-module.git
```

<!-- USAGE EXAMPLES -->
## Understanding the basics

The module uses two different blots to format the search. If you are unfamiliar with blot concept or usage check the quill [parchment](https://github.com/quilljs/parchment) documentation.

Blots use different CSS classes to style the blots: ```ql-search-string-match``` and ```ql-search-string-highlight```
This two classes should be created/modified accordingly to give appropiate styling to the blots.

**Examle:**

```css
.ql-search-string-highlight {
  background-color: #f8ff00;
  display: inline-block;
}

.ql-search-string-match {
  background-color: #feffe1;
  display: inline-block;
}
```

This classes will give a behaviour like this.

![SearchModule](media/sshot.1.png)


## Usage

### Import files.

```js
import searcher from "./plugins/findReplace/searcher";
import highlightBlot from "./plugins/findReplace/highlightBlot";
import matchBlot from "./plugins/findReplace/matchBlot";

Quill.register('modules/searcher', searcher);
Quill.register(highlightBlot);
Quill.register(matchBlot);
```

### Setting up the UI
There should be an input and button for every needed functionality but some of them are optional.

| Element             | Type               | Required |
|---------------------|--------------------|----------|
| Search Input        | ```<input>```  | * |          |
| Replace Input       | ```<input>```  |   |          |
| Search Button       | ```<button>``` | * |          |
| Replace Button      | ```<button>``` |   |          |
| Replace All Button  | ```<button>``` |   |          |
| Previous Button     | ```<button>``` |   |          |
| Next Button         | ```<button>``` |   |          |
| Clear Search Button | ```<button>``` |   |          |


* Ids can be customized using the options object (see example).
* Button styling is your prerogative


```css
.ql-search-string-highlight {
  background-color: #f8ff00;
  display: inline-block;
}

.ql-search-string-match {
  background-color: #feffe1;
  display: inline-block;
}
```

```html
<div id="search-container">
      <input id="search-input" class="input" type="text" placeholder="search" />
      <input id="replace-input" class="input" type="text" placeholder="replace" />
      <button id="search-button">search</button>
      <button id="replace-button">replace</button>
      <button id="replace-all-button">replace all</button>
      <button id="prev-match-button">&lt; prev</button>
      <button id="next-match-button">next &gt;</button>
      <button id="clear-search-button">x</button>
    </div>
  </div>
```

### Example (Vue.Js)

Starting from a blank vue.js CLI generated project
Using ```vue-quill-editor``` [plugin](https://github.com/surmon-china/vue-quill-editor).

**main.js**

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueQuillEditor from 'vue-quill-editor'

import Quill from "quill";

import searcher from "./plugins/findReplace/searcher";
import highlightBlot from "./plugins/findReplace/highlightBlot";
import matchBlot from "./plugins/findReplace/matchBlot";

Quill.register('modules/searcher', searcher);
Quill.register(highlightBlot);
Quill.register(matchBlot);

Vue.use(VueQuillEditor, /* { default global options } */ )
Vue.config.productionTip = false;

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");
```

**Home.vue**

```js
<template>
  <div>

    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
    />

    <div id="search-container">
      <input id="search-input" class="input" type="text" placeholder="search" />
      <input id="replace-input" class="input" type="text" placeholder="replace" />
      <button id="search-button">search</button>
      <button id="replace-button">replace</button>
      <button id="replace-all-button">replace all</button>
      <button id="prev-match-button">&lt; prev</button>
      <button id="next-match-button">next &gt;</button>
      <button id="clear-search-button">x</button>
    </div>
  </div>
</template>


<style lang="scss">
.ql-search-string-highlight {
  background-color: #f8ff00;
  display: inline-block;
}

.ql-search-string-match {
  background-color: #feffe1;
  display: inline-block;
}
</style>

<script>
export default {
  data() {
    return {
      content: "<h2>I am Example amamelis ambulancia amar azul</h2>",
      editorOption: {
        modules: {
          counter: {
            container: "word_count_placeholder",
            unit: "word"
          },
          searcher: {
          	
          }
        }
      }
    };
  },
  methods: {},
  computed: {},
  mounted() {}
};
</script>
```

### Options
You can customize plugin by passing different options.
1. If you dont need non mandatory elements you can safely delete from markup.
2. If you want to change the ids of the elements you can pass them along in the options object

**Example:**

```js  
searcher: {
	searchInput: "my-custom-search-id"
}
```

```html
<div id="search-container">
	<input id="my-custom-search-id" class="input" type="text" placeholder="search" />
	(...)
</div>
```

## Known Issues
The module now only support text-only editor, if your editor will include images, then the searcher with not work properly,
see [here](https://github.com/quilljs/quill/issues/2698)

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/chewax/quill-find-replace-module/issues) for a list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Currently there is need of refactoring to allow find and replace for files containing other than text (PWIZ HELP)**

<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

[![LinkedIn][linkedin-shield]][linkedin-url]
![Twitter Follow](https://img.shields.io/twitter/follow/dwaksman?label=Follow&style=social)  
Project Link: [https://github.com/chewax/quill-find-replace-module](https://github.com/chewax/quill-find-replace-module)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/chewax/quill-find-replace-module.svg
[contributors-url]: https://github.com/chewax/quill-find-replace-module/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/chewax/quill-find-replace-module.svg
[forks-url]: https://github.com/chewax/quill-find-replace-module/network/members
[stars-shield]: https://img.shields.io/github/stars/chewax/quill-find-replace-module.svg
[stars-url]: https://github.com/chewax/quill-find-replace-module/stargazers
[issues-shield]: https://img.shields.io/github/issues/chewax/quill-find-replace-module.svg
[issues-url]: https://github.com/chewax/quill-find-replace-module/issues
[license-shield]: https://img.shields.io/github/license/chewax/quill-find-replace-module.svg
[license-url]: https://github.com/chewax/quill-find-replace-module/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/dwaksman
[last-commit-shield]: https://img.shields.io/github/last-commit/chewax/quill-find-replace-module
[last-commit-url]: https://github.com/last-commit/chewax/quill-find-replace-module
