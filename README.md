# portable-code-review-tool

This is a tool to use when for some reason you don't have access to a code review tool.  The idea is to have an extremely portable tool for reviewing code that can be shared easily and do not require a central repo to work, just a diff file and some json files for comments sharing.

## How to use it
1. Just download or share the complete directory
2. Open the index.html file in your browser
3. Drag and drop the .diff and json comments file into the big area at the top of the page
4. That's it

## Creating the diff file
### SVN
Using tortoise svn just click on generate patch, select the files and save the diff file

### Git

git diff > diff-file.diff

## Dependencies

* [JQuery plugin for managing comments by Viima](http://viima.github.io/jquery-comments/) (MIT License)
* [Diff parser and pretty html generator by Rodrigo Fernandes](https://diff2html.xyz/) (MIT License)
* Font awesome
* Highlight.js

## TODO

- [ ] Load the json file into the jquery.comments plugin on the appropriate line
- [ ] Add licenses for libs! and download missing libs in dist
- [ ] Change the current index.html to include everything from the dist folder
- [ ] Have an index-nodeps-online.html which includes every dependency using a cdn
- [ ] Have an index-nodeps-offline.html for easy distribution that has everything included in the index.html file
- [ ] Check https://github.com/eligrey/FileSaver.js and https://codepen.io/davidelrizzo/pen/cxsGb for file saving
- [ ] Remove console.log statements and dev comments
- [ ] Add support for google spreadsheets
