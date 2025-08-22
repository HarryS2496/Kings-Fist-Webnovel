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

      const prevChapter = document.getElementById("prev-chapter");
      const nextChapter = document.getElementById("next-chapter");
      const chapterNumbers = Object.keys(chapterNames).map(Number).sort((a, b) => a - b);
      const currentIndex = chapterNumbers.indexOf(Number(chapterNum));
      
      if (currentIndex > 0) {
        const prevNum = chapterNumbers[currentIndex - 1];
        prevChapter.href = `chapter.html?num=${prevNum}`;
        prevChapter.textContent = `← Chapter ${prevNum}`;
      }
      else {
        prevChapter.style.visibility = "hidden";
      }
      
      if (currentIndex < chapterNumbers.length - 1) {
        const nextNum = chapterNumbers[currentIndex + 1];
        nextChapter.href = `chapter.html?num=${nextNum}`;
        nextChapter.textContent = `Chapter ${nextNum} →`;
      }
      else {
        nextChapter.style.visibility = "hidden";
      }

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
