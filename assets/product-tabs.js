document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("[data-product-tabs]");

  tabs.forEach((tabsContainer) => {
    const buttons = tabsContainer.querySelectorAll(
      "[data-product-tab-summary]",
    );

    const panels = tabsContainer.querySelectorAll("[data-product-tab-content]");

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        const isActive = button.getAttribute("aria-expanded") === "true";

        buttons.forEach((item) => {
          item.setAttribute("aria-expanded", "false");
          item.classList.remove("is-active");
        });

        panels.forEach((panel) => {
          panel.hidden = true;
          panel.classList.remove("is-active");
        });

        if (!isActive) {
          button.setAttribute("aria-expanded", "true");
          button.classList.add("is-active");

          const panel = panels[index];

          if (panel) {
            panel.hidden = false;
            panel.classList.add("is-active");
          }
        }
      });
    });
  });
});
