// Toggle modal visibility
function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
  const modals = document.getElementsByClassName("modal");
  Array.from(modals).forEach(modal => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
};