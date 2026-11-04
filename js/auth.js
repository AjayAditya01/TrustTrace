(function () {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-password-toggle]").forEach((button) =>
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.passwordToggle);
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.innerHTML = `<i class="bi ${show ? "bi-eye-slash" : "bi-eye"}"></i>`;
        button.setAttribute(
          "aria-label",
          show ? "Hide password" : "Show password",
        );
      }),
    );
    const form = document.querySelector("[data-auth-form]");
    if (!form) return;
    const msg = (text) => window.TrustTrace?.toast(text, "error");
    function setInvalid(input, invalid) {
      const field = input.closest(".form-field");
      field?.classList.toggle("invalid", invalid);
      input.setAttribute("aria-invalid", String(invalid));
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((input) => {
        const okay =
          input.type === "checkbox" ? input.checked : input.checkValidity();
        setInvalid(input, !okay);
        valid = valid && okay;
      });
      const password = form.querySelector('[name="password"]'),
        confirm = form.querySelector('[name="confirmPassword"]');
      if (password && password.value.length < 8) {
        setInvalid(password, true);
        valid = false;
      }
      if (confirm && password && confirm.value !== password.value) {
        setInvalid(confirm, true);
        valid = false;
      }
      if (!valid) {
        msg("Please check the highlighted fields and try again.");
        return;
      }
      const name =
        form.querySelector('[name="name"]')?.value.trim() || "Admin User";
      const email =
        form.querySelector('[name="email"]')?.value.trim() ||
        "admin@trusttrace.demo";
      try {
        localStorage.setItem("tt_demo_session", "active");
        localStorage.setItem(
          "tt_demo_profile",
          JSON.stringify({ name, email }),
        );
      } catch (_) {}
      window.TrustTrace?.toast(
        "Demo sign-in complete. This session is simulated.",
      );
      setTimeout(() => (location.href = "dashboard.html"), 450);
    });
    form.querySelectorAll("input").forEach((input) =>
      input.addEventListener("input", () => {
        if (input.closest(".form-field")?.classList.contains("invalid")) {
          const password = form.querySelector('[name="password"]'),
            confirm = form.querySelector('[name="confirmPassword"]');
          setInvalid(
            input,
            input.name === "confirmPassword"
              ? !input.value || input.value !== password?.value
              : !input.checkValidity(),
          );
          if (
            input.name === "password" &&
            confirm?.value &&
            confirm.value !== input.value
          )
            setInvalid(confirm, true);
          if (
            input.name === "password" &&
            confirm?.value === input.value &&
            confirm.closest(".form-field")?.classList.contains("invalid")
          )
            setInvalid(confirm, false);
        }
      }),
    );
  });
})();
