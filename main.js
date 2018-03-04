
var commentsData = {};

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  //List of files droped into the drop area
  var files = evt.dataTransfer.files;

  renderFilesLoaded(files);

  loadFiles(files);
}

/**
 * Load json and diff files
 * @param {*} files - List of files to be loaded
 */
function loadFiles(files) {
  for (var i = 0, f; f = files[i]; i++) {
    console.log(files[i].name);
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        var isDiff = _.endsWith(theFile.name, '.diff');
        var span = document.createElement('span');
        //span.innerHTML = ['<img class="thumb" src="', e.target.result,
        //																		'" title="', escape(theFile.name), '"/>'].join('');
        //span.innerHTML = [e.target.result, escape(theFile.name)].join('<br>');
        //document.getElementById('list').insertBefore(span, null);
        //check if .diff or .json
        if (isDiff) {
          performDiff(e.target.result);
        }
        else {
          loadComments(e.target.result);
        }
      };
    })(f);
    // Read the files dragged into the drop area
    reader.readAsText(f);
  }
}

function renderFilesLoaded(files) {
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ', f.size, ' bytes, last modified: ', f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a', '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

/*function mergeFiles(objValue, srcValue) {
    console.log('objValue, srcValue', objValue, srcValue)
  if (_.isObject(objValue)) {
    //return objValue.concat(srcValue);
      _.mergeWith(commentsData, comments, mergeFiles);///////////
  }
}*/

/**
 * Show the comments loaded from the json file
 */
function showComments() {
  var $fileDiflist = $('.d2h-file-wrapper');

  //TODO: This is what is missing to at least have something working
  //1. Find all the files names in the html
  //2. Search the json file for diff file names (or the other way around)
  //3. Initialize the comments plugin for the file:line usae the openComments method and maybe add a comments param
  //4. Load the comments
  console.log('fileDiflist', $fileDiflist);
  for(var fileWrapperIndex in $fileDiflist) {
    console.log('fileDiflist', $fileDiflist);
    /*
      var $row = $(obj.currentTarget)
      var $content = $row.find('td > .d2h-ins')
      var $contentColumn = $row.find('.d2h-code-linenumber');//line-num1
      var num1 = $contentColumn.find('.line-num1').html();
      var num2 = $contentColumn.find('.line-num2').html();
    */
    var parentFileName = $fileDiflist.get(fileWrapperIndex).find('.d2h-file-header .d2h-file-name').html().split(' ');
    //it child for numbers
  }
}

function getOrCreateKey(objectToTest, key, defaultValue = {}) {
  var keyValue;

  if(!(key in objectToTest)) {
    objectToTest[key] = defaultValue;
  }

  keyValue = objectToTest[key];

  return keyValue;
}

function loadComments(commentsJson) {
  var comments = JSON.parse(commentsJson);

  for(var fileKey in comments) {
    mergeFileComments(getOrCreateKey(commentsData, fileKey), comments[fileKey]);
  }

  showComments();
}

function mergeFileComments(targetFileComments, sourceFileComments) {
  for(var lineKey in sourceFileComments) {
    mergeLineComments(getOrCreateKey(targetFileComments, lineKey, []), sourceFileComments[lineKey]);
  }
}

function mergeLineComments(targetLineComments, sourceLineComments) {
  for(var commentIndex in sourceLineComments) {
    //mergeComments(getOrCreateKey(targetLineComments, lineKey), sourceLineComments[lineKey]);
    var comment = sourceLineComments[commentIndex];

    if(!existsCommentInSource(targetLineComments, comment)) {
      targetLineComments.push(comment);
    }
  }
}

function existsCommentInSource(targetLineComments, sourceComment) {
  var exists = false;

  for(var commentIndex in targetLineComments) {
    if(targetLineComments[commentIndex].id === sourceComment.id) {
      exists = true;
      break;
    }
  }

  return exists;
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

function performDiff(data) {
  var container = '#url-diff-container';
  var $container = $(container);
  var diff2htmlUi = new Diff2HtmlUI({diff: data});

  var outputFormat = 'line-by-line';
  var showFiles = true;
    var matching = "lines";
  /*<option value="words" selected>Words</option>
  <option value="none">None</option>*/
  var  wordThreshold = 0.25;
  /*matchWordsThreshold" value="0.25" step="0.05"
  min="0" max="1"/>*/
  var matchingMaxComparisons = 2500;
  /*name="matchingMaxComparisons" value="2500"
  step="100" min="0"/>*/

  if (outputFormat === 'side-by-side') {
    $container.css({'width': '100%'});
  } else {
    $container.css({'width': ''});
  }

  diff2htmlUi.draw(container, {
    outputFormat: outputFormat,
    showFiles: showFiles,
    matching: matching,
    matchWordsThreshold: wordThreshold,
    matchingMaxComparisons: matchingMaxComparisons,
    synchronisedScroll: true
  });
  diff2htmlUi.fileListCloseable(container, false);
  diff2htmlUi.highlightCode(container);
  console.log('finished!');
  makeRowsClickable();
}

function makeRowsClickable() {
  var $tr = $('.d2h-diff-tbody tr');

  $tr.click(function(obj){
    console.log(obj);
    var $row = $(obj.currentTarget)
    var $content = $row.find('td > .d2h-ins')
    var $contentColumn = $row.find('.d2h-code-linenumber');//line-num1
    var num1 = $contentColumn.find('.line-num1').html();
    var num2 = $contentColumn.find('.line-num2').html();
    var parentFileName = $row.parentsUntil(".d2h-file-wrapper" ).parent().find('.d2h-file-header .d2h-file-name').html().split(' ')[0];

    openComments($content, parentFileName, num1, num2);
    $row.off('click');
  })
}
function openComments($element, parentFileName, leftLineNumber, rightLineNumber) {
  var div = $("<div></div>");
  if(commentsData[parentFileName] === undefined) {
      commentsData[parentFileName] = {};
  }
  var rowName = leftLineNumber + '_' +rightLineNumber;
  if(commentsData[parentFileName][rowName] === undefined) {
      commentsData[parentFileName][rowName] = [];
  }
  console.log($element)
  div.comments({
      profilePictureURL: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
      /*getComments: function(success, error) {
          var commentsArray = [{
              id: 1,
              created: '2015-10-01',
              content: 'Lorem ipsum dolort sit amet',
              fullname: 'Simon Powell',
              upvote_count: 2,
              user_has_upvoted: false
          }];
          success(commentsArray);
      },*/
      postComment: function(commentJSON, success, error) {
          console.log('commentJSON');
          console.log(commentJSON);
          commentsData[parentFileName][rowName].push(commentJSON);
          console.log('commentsData');
          console.log(commentsData);
          commentJSON.id += '-' + Math.random();
          success(commentJSON);
      }
  });
  $element.after(div);
}

/*

*/
function saveComments() {
  var text = JSON.stringify(commentsData);
  var filename = 'comments'
  var blob = new Blob([text], {type: "application/json;charset=utf-8"});
  saveAs(blob, filename+".json");
}
