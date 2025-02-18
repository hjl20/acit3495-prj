document.getElementById("gradeForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const grade = document.getElementById("grade").value.trim(); // Trim whitespace

    if (!grade) {
      alert("Please enter a valid grade.");
      return;
    }

    fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ grade: parseInt(grade, 10) }) // Ensure it's a number
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        window.location.href = "/submit"; // Reload the page
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    });
});