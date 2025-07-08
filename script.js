window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const chapterNum = params.get('num');

  if (!chapterNum) return;

  const chapterTitle = document.getElementById('chapter-title');
  const chapterContent = document.getElementById('chapter-content');

  fetch('chapters.json')
    .then(response => {
      if (!response.ok) throw new Error("Failed to load chapter names.");
      return response.json();
    })
    .then(chapterNames => {
      const name = chapterNames[chapterNum] || "Untitled";
      chapterTitle.textContent = `Chapter ${chapterNum}: ${name}`;
      document.title = `Chapter ${chapterNum}: ${name}`;

      return fetch(`chapters/chapter${chapterNum}.md`);
    })
    .then(response => {
      if (!response.ok) throw new Error("Chapter content not found.");
      return response.text();
    })
    .then(text => {
      // Use marked.js to convert Markdown to HTML
      chapterContent.innerHTML = marked.parse(text);
    })
    .catch(error => {
      chapterTitle.textContent = "Error";
      chapterContent.textContent = error.message;
    });
});
