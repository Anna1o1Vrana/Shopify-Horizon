(function () {
  const AUTOPLAY_DELAY = 10000;

  function initWholeBodyBenefits(section) {
    if (!section) {
      return;
    }

    // Prevent duplicate initialization when Shopify reloads the section
    if (section._wholeBodyBenefitsCleanup) {
      section._wholeBodyBenefitsCleanup();
    }

    const desktopTriggers = Array.from(
      section.querySelectorAll(
        ".whole-body-benefits__nav-item[data-benefit-trigger]",
      ),
    );

    const imagePanels = Array.from(
      section.querySelectorAll("[data-benefit-panel]"),
    );

    const contentPanels = Array.from(
      section.querySelectorAll("[data-benefit-content]"),
    );

    const mobileTriggers = Array.from(
      section.querySelectorAll("[data-benefit-mobile-trigger]"),
    );

    const mobileContentPanels = Array.from(
      section.querySelectorAll("[data-benefit-mobile-content]"),
    );

    if (desktopTriggers.length === 0 && mobileTriggers.length === 0) {
      return;
    }

    let activeIndex = 0;
    let autoplayTimer = null;

    function clearAutoplayTimer() {
      if (autoplayTimer) {
        window.clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function scheduleAutoplay() {
      clearAutoplayTimer();

      if (desktopTriggers.length <= 1) {
        return;
      }

      autoplayTimer = window.setTimeout(() => {
        const nextIndex = (activeIndex + 1) % desktopTriggers.length;

        activateBenefit(nextIndex);
      }, AUTOPLAY_DELAY);
    }

    function activateBenefit(index, options = {}) {
      const { moveFocus = false, resetAutoplay = true } = options;

      if (desktopTriggers.length === 0) {
        return;
      }

      activeIndex = (index + desktopTriggers.length) % desktopTriggers.length;

      desktopTriggers.forEach((trigger, triggerIndex) => {
        const isActive = triggerIndex === activeIndex;

        trigger.classList.toggle("is-active", isActive);
        trigger.setAttribute("aria-selected", String(isActive));
        trigger.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      imagePanels.forEach((panel) => {
        const panelIndex = Number(panel.dataset.benefitPanel);

        panel.hidden = panelIndex !== activeIndex;
      });

      contentPanels.forEach((panel) => {
        const panelIndex = Number(panel.dataset.benefitContent);

        const isActive = panelIndex === activeIndex;

        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
      });

      mobileContentPanels.forEach((panel) => {
        const panelIndex = Number(panel.dataset.benefitMobileContent);

        panel.hidden = panelIndex !== activeIndex;
      });

      updateMobileTriggers();

      if (moveFocus) {
        const activeTrigger = desktopTriggers[activeIndex];

        activeTrigger?.focus();
      }

      if (resetAutoplay) {
        scheduleAutoplay();
      }
    }

    function updateMobileTriggers() {
      const mobileActive = section.querySelector(
        ".whole-body-benefits__mobile-active",
      );

      mobileTriggers.forEach((trigger) => {
        const triggerIndex = Number(trigger.dataset.benefitMobileTrigger);

        const isActive = triggerIndex === activeIndex;

        trigger.classList.toggle("is-active", isActive);

        trigger.classList.toggle(
          "is-hidden",
          isActive &&
            trigger.classList.contains("whole-body-benefits__mobile-nav-item"),
        );

        trigger.setAttribute("aria-selected", String(isActive));
      });

      if (mobileActive) {
        const sourceTrigger = mobileTriggers.find(
          (trigger) =>
            Number(trigger.dataset.benefitMobileTrigger) === activeIndex &&
            trigger.classList.contains("whole-body-benefits__mobile-nav-item"),
        );

        if (sourceTrigger) {
          const activeIcon = sourceTrigger.querySelector("img");

          const activeLabel = sourceTrigger.querySelector(
            ".whole-body-benefits__nav-label",
          );

          const iconMarkup = activeIcon ? activeIcon.outerHTML : "";

          const labelMarkup = activeLabel ? activeLabel.outerHTML : "";

          mobileActive.innerHTML = iconMarkup + labelMarkup;

          mobileActive.dataset.benefitMobileTrigger = String(activeIndex);

          mobileActive.classList.add("is-active");

          mobileActive.setAttribute("aria-selected", "true");
        }
      }
    }

    function handleDesktopClick(event) {
      const trigger = event.currentTarget;
      const index = Number(trigger.dataset.benefitTrigger);

      if (Number.isNaN(index)) {
        return;
      }

      activateBenefit(index);
    }

    function handleDesktopKeydown(event) {
      const trigger = event.currentTarget;

      const currentIndex = Number(trigger.dataset.benefitTrigger);

      if (Number.isNaN(currentIndex)) {
        return;
      }

      let nextIndex;

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          nextIndex = (currentIndex + 1) % desktopTriggers.length;
          break;

        case "ArrowUp":
        case "ArrowLeft":
          nextIndex =
            (currentIndex - 1 + desktopTriggers.length) %
            desktopTriggers.length;
          break;

        case "Home":
          nextIndex = 0;
          break;

        case "End":
          nextIndex = desktopTriggers.length - 1;
          break;

        default:
          return;
      }

      event.preventDefault();

      activateBenefit(nextIndex, {
        moveFocus: true,
      });
    }

    function handleMobileClick(event) {
      const trigger = event.currentTarget;

      const index = Number(trigger.dataset.benefitMobileTrigger);

      if (Number.isNaN(index)) {
        return;
      }

      activateBenefit(index);
    }

    desktopTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDesktopClick);

      trigger.addEventListener("keydown", handleDesktopKeydown);
    });

    mobileTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleMobileClick);
    });

    /*
     * Start with the first tab and start the
     * 10-second autoplay timer.
     */
    activateBenefit(0);

    section._wholeBodyBenefitsCleanup = function () {
      clearAutoplayTimer();

      desktopTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDesktopClick);

        trigger.removeEventListener("keydown", handleDesktopKeydown);
      });

      mobileTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleMobileClick);
      });

      section._wholeBodyBenefitsCleanup = null;
    };
  }

  function initAllSections() {
    document
      .querySelectorAll("[data-whole-body-benefits]")
      .forEach(initWholeBodyBenefits);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllSections);
  } else {
    initAllSections();
  }

  document.addEventListener("shopify:section:load", (event) => {
    const section = event.target.querySelector("[data-whole-body-benefits]");

    if (section) {
      initWholeBodyBenefits(section);
    }
  });

  document.addEventListener("shopify:section:unload", (event) => {
    const section = event.target.querySelector("[data-whole-body-benefits]");

    section?._wholeBodyBenefitsCleanup?.();
  });
})();
