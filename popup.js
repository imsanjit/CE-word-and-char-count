chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: detectAndCount
      },
      (results) => {
        displayResult(results[0].result);
      }
    );
  });
  
  function displayResult(result) {
    const formattedWordCount = result.wordCount.toLocaleString();
    const formattedCharCount = result.charCount.toLocaleString();
  
    document.getElementById('result').innerHTML =
      `Word Count: <span class="result-number">${formattedWordCount}</span><br>Character Count: <span class="result-number">${formattedCharCount}</span>`;
  }
  
  function detectAndCount() {
    // Function to count words and characters
    function countText(text) {
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      const charCount = text.replace(/\s+/g, '').length;
      return { wordCount, charCount };
    }
  
    // Check if there is a text selection
    let selectedText = window.getSelection().toString();
  
    if (selectedText.trim()) {
      // If text is selected, count the selected text
      return countText(selectedText);
    } else {
      // Otherwise, count the whole page
      const pageText = document.body.innerText;
      return countText(pageText);
    }
  }
  
  // Listen for selection change event to dynamically update counts
  document.addEventListener('selectionchange', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: detectAndCount
        },
        (results) => {
          displayResult(results[0].result);
        }
      );
    });
  });
  