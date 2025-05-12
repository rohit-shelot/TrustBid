// Remove Infura IPFS client initialization

document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const imageFile = document.getElementById("image").files[0];
    if (!imageFile) {
      alert("Please select an image for the auction");
      return;
    }

    try {
      // Show loading message
      const loadingToast = Toastify({
        text: "Uploading image to IPFS...",
        duration: -1,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();

      // Upload to IPFS using the uploadToIPFS function from create_auction.html
      const ipfsHash = await uploadToIPFS(imageFile);
      const ipfsUrl = `ipfs://${ipfsHash}`;

      // Close loading toast
      loadingToast.hideToast();

      // Create auction object
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
        image: ipfsUrl
      };
    
      const auctions = JSON.parse(localStorage.getItem("auctions")) || [];
      auctions.push(auction);
      localStorage.setItem("auctions", JSON.stringify(auctions));
    
      // Show success message
      Toastify({
        text: "Auction created successfully!",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();

      // Redirect to auction list
      window.location.href = "../List Of Auctions/list_of_auctions.html";
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      Toastify({
        text: "Failed to upload image. Please try again.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff0000, #ff4444)",
        }
      }).showToast();
    }
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
