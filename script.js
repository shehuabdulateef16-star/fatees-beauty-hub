(() => {
  "use strict";

  // Mobile navigation
  const initMobileNav = () => {
    const nav = document.querySelector(".site-nav");
    const toggle = document.querySelector(".site-nav__toggle");

    if (!nav || !toggle) return;

    const desktopQuery = window.matchMedia("(min-width: 901px)");

    const closeMenu = () => {
      toggle.checked = false;
    };

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (toggle.checked && !nav.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.checked) {
        closeMenu();
        toggle.focus();
      }
    });

    desktopQuery.addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });
  };

  // Appointment form
  const initAppointmentForm = () => {
    const form = document.querySelector("#appointment-form");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }

      const formData = new FormData(form);

      const appointment = {
        full_name: formData.get("full_name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        service: formData.get("service"),
        location: formData.get("location"),
        date: formData.get("date"),
        time: formData.get("time"),
        message: formData.get("message")
      };

      if (
        !appointment.full_name ||
        !appointment.phone ||
        !appointment.service ||
        !appointment.location ||
        !appointment.date ||
        !appointment.time
      ) {
        alert("Please fill in all required fields.");

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Request Appointment";
        }

        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:3000/book",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(appointment)
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to submit appointment."
          );
        }

        alert(
          "Thank you! Your appointment request has been submitted successfully. We will contact you to confirm your appointment."
        );

        form.reset();

      } catch (error) {
        console.error("Appointment error:", error);

        alert(
          "We couldn't submit your appointment right now. Please make sure the backend server is running and try again."
        );

      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Request Appointment";
        }
      }
    });
  };

  const init = () => {
    initMobileNav();
    initAppointmentForm();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();