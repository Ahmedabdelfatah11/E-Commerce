document.querySelectorAll("input[name='paymentMethod']").forEach((input) => {
    input.addEventListener("change", function() {
        document.querySelectorAll(".payment-description").forEach(desc => desc.style.display = "none");
        document.getElementById(this.id + "Desc").style.display = "block";
    });
});

// Trigger initial selection display
document.getElementById("bankTransferDesc").style.display = "block";