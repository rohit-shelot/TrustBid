document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const auction = {
      brand: document.getElementById("brand").value,
      model: document.getElementById("model").value,
      condition: document.getElementById("condition").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      owner: document.getElementById("owner").value,
      location: document.getElementById("location").value,
      baseBid: document.getElementById("baseBid").value,
      endDate: document.getElementById("endDate").value,
      image: URL.createObjectURL(document.getElementById("image").files[0]),
    };
  
    const auctions = JSON.parse(localStorage.getItem("auctions")) || [];
    auctions.push(auction);
    localStorage.setItem("auctions", JSON.stringify(auctions));
  
    alert("Auction created successfully!");
    window.location.href = "../List Of Auctions/list_of_auctions.html";
  });
  document.getElementById("image").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const preview = document.getElementById("image-preview");
      preview.src = e.target.result;
      preview.style.display = "block";

      document.getElementById("image-label").style.display = "none";
    };

    reader.readAsDataURL(file);
  }
});
