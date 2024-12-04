// Script runs after DOM is loaded, and references the comment form and comment list
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addCommentForm');
    const commentList = document.getElementById('commentList');
  
    // Handles a form submission to add a new comment
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      // Collects form input data
      const formData = new FormData(form);

      // Gets the entered comment text
      const comment = formData.get('comment');
  
      // Sends the comment to the server with a POST request
      try {
        const response = await fetch('/comments/add/student2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ comment }),
        });
  
        // Adds the new comment to the comment list if server response is successful and logs errors.
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