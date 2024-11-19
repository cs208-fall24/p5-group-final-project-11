document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addCommentForm');
  const commentList = document.getElementById('commentList');
  const noCommentsMessage = document.querySelector('.no-comments-message');

  // Add Comment Form Submission
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const comment = formData.get('comment');
    console.log('Submitting comment:', comment);

    try {
      const response = await fetch('/comments/add', {
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
        newCommentElement.innerHTML = `
          <span>${result.content}</span>
          <button class="upvote-btn" data-id="${result.id}">👍 0</button>
        `;
        commentList.appendChild(newCommentElement);

        // Remove "No comments yet" message if it exists
        if (noCommentsMessage) {
          noCommentsMessage.remove();
        }

        form.reset();
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  // Countdown Timer
  const countdownElement = document.getElementById('countdown');
  const eventDate = new Date('2024-12-31T23:59:59').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      countdownElement.innerHTML = 'The Party is Happening Now!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  setInterval(updateCountdown, 1000);

  // Fun Facts Rotator
  const funFacts = [
    'Saturn’s rings are great for zero-gravity dances!',
    'Party Studies graduates have planned 500+ galactic events!',
    'Zero-gravity dancing burns twice the calories!',
  ];

  const funFactElement = document.getElementById('funFact');
  let funFactIndex = 0;

  function rotateFunFacts() {
    funFactElement.textContent = funFacts[funFactIndex];
    funFactIndex = (funFactIndex + 1) % funFacts.length;
  }

  setInterval(rotateFunFacts, 5000);

  // Upvote Comments
  commentList.addEventListener('click', (event) => {
    if (event.target.classList.contains('upvote-btn')) {
      const button = event.target;
      const count = parseInt(button.textContent.split(' ')[1], 10);
      button.textContent = `👍 ${count + 1}`;
    }
  });
});