document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addCommentForm');
    const commentList = document.getElementById('commentList');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const formData = new FormData(form);
      const comment = formData.get('comment');
  
      try {
        const response = await fetch('/comments/add/student2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ comment }),
        });
  
        if (response.ok) {
          const result = await response.json();
          const newCommentElement = document.createElement('li');
          newCommentElement.classList.add('comment');
          newCommentElement.textContent = result.content;
          commentList.appendChild(newCommentElement);
          form.reset();
        } else {
          console.error('Failed to add comment');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });