document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("submit-token-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = {
      name: form.name.value.trim(),
      token: form.token.value.trim(),
    };

    fetch("/api/submittoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return res.json();
      })
      .then((data) => {
        const okResponseDiv = document.getElementById("okResponseDiv");
        okResponseDiv.classList.remove("hidden");
        const clientName = document.getElementById("client-name");
        clientName.innerText = data.clientName;
        form.reset();
        const animation = dismissLoading.animate(
          [{ width: "0%" }, { width: "100%" }],
          {
            duration: 5000,
            iterations: 1,
            easing: "ease-in-out",
          }
        );

        function checkAnimationState() {
          if (animation.playState === "finished") {
            okResponseDiv.classList.add("hidden");
            dismissLoading.style.width = "0%";
          } else {
            requestAnimationFrame(checkAnimationState);
          }
        }

        checkAnimationState();
      })
      .catch((err) => {
        const errorResponseDiv = document.getElementById("errorResponseDiv");
        const error = document.getElementById("error-message");
        errorResponseDiv.classList.remove("hidden");
        error.innerText = err.message;
        console.log(err.message);
        const animation = dismissLoading2.animate(
          [{ width: "0%" }, { width: "100%" }],
          {
            duration: 5000,
            iterations: 1,
            easing: "ease-in-out",
          }
        );

        function checkAnimationState() {
          if (animation.playState === "finished") {
            dismissLoading2.style.width = "0%";
            errorResponseDiv.classList.add("hidden");
          } else {
            requestAnimationFrame(checkAnimationState);
          }
        }

        checkAnimationState();
      });
  });
});
