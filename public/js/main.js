// public/js/main.js - Enhanced Blog Interactivity

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initializeFormValidation();
  initializeInteractiveElements();
  initializeScrollEffects();
  initializeTooltips();

  // Form Validation & Enhancement
  function initializeFormValidation() {
    const forms = document.querySelectorAll(".post-form");

    forms.forEach((form) => {
      const titleInput = form.querySelector("#title");
      const contentTextarea = form.querySelector("#content");
      const submitButton = form.querySelector('button[type="submit"]');

      if (titleInput && contentTextarea && submitButton) {
        // Real-time character count for title
        addCharacterCount(titleInput, 100);

        // Real-time word count for content
        addWordCount(contentTextarea);

        // Enhanced form validation
        form.addEventListener("submit", function (e) {
          if (!validateForm(titleInput, contentTextarea)) {
            e.preventDefault();
            showNotification(
              "Please fill in all required fields correctly",
              "error"
            );
          } else {
            showLoadingState(submitButton);
            showNotification("Publishing your post...", "info");
          }
        });

        // Auto-save to localStorage (but we won't use localStorage due to restrictions)
        let autoSaveTimeout;
        [titleInput, contentTextarea].forEach((input) => {
          input.addEventListener("input", function () {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
              showAutoSaveIndicator();
            }, 2000);
          });
        });
      }
    });
  }

  // Add character count indicator
  function addCharacterCount(input, maxLength) {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const counter = document.createElement("div");
    counter.style.cssText = `
            position: absolute;
            right: 12px;
            top: 12px;
            font-size: 12px;
            color: var(--text-muted);
            background: var(--bg-primary);
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid var(--border);
        `;

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(counter);

    function updateCounter() {
      const length = input.value.length;
      counter.textContent = `${length}/${maxLength}`;

      if (length > maxLength * 0.9) {
        counter.style.color = "var(--warning)";
      } else if (length > maxLength) {
        counter.style.color = "var(--danger)";
      } else {
        counter.style.color = "var(--text-muted)";
      }
    }

    input.addEventListener("input", updateCounter);
    updateCounter();
  }

  // Add word count for content
  function addWordCount(textarea) {
    const counter = document.createElement("div");
    counter.style.cssText = `
            margin-top: 8px;
            font-size: 14px;
            color: var(--text-muted);
            text-align: right;
        `;

    textarea.parentNode.appendChild(counter);

    function updateWordCount() {
      const words = textarea.value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const wordCount = words.length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed

      counter.innerHTML = `
                <span>${wordCount} words</span>
                <span style="margin-left: 16px;">~${readingTime} min read</span>
            `;
    }

    textarea.addEventListener("input", updateWordCount);
    updateWordCount();
  }

  // Form validation
  function validateForm(titleInput, contentTextarea) {
    let isValid = true;

    // Remove existing error states
    [titleInput, contentTextarea].forEach((input) => {
      input.style.borderColor = "";
      const errorMsg = input.parentNode.querySelector(".error-message");
      if (errorMsg) errorMsg.remove();
    });

    // Validate title
    if (!titleInput.value.trim()) {
      showFieldError(titleInput, "Title is required");
      isValid = false;
    } else if (titleInput.value.trim().length < 5) {
      showFieldError(titleInput, "Title must be at least 5 characters");
      isValid = false;
    }

    // Validate content
    if (!contentTextarea.value.trim()) {
      showFieldError(contentTextarea, "Content is required");
      isValid = false;
    } else if (contentTextarea.value.trim().length < 20) {
      showFieldError(contentTextarea, "Content must be at least 20 characters");
      isValid = false;
    }

    return isValid;
  }

  // Show field error
  function showFieldError(input, message) {
    input.style.borderColor = "var(--danger)";

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText = `
            color: var(--danger);
            font-size: 14px;
            margin-top: 4px;
        `;
    errorDiv.textContent = message;

    input.parentNode.appendChild(errorDiv);
  }

  // Interactive Elements
  function initializeInteractiveElements() {
    // Enhanced delete confirmations
    const deleteButtons = document.querySelectorAll(
      '.btn-danger[onclick*="confirm"]'
    );
    deleteButtons.forEach((button) => {
      button.removeAttribute("onclick");
      button.addEventListener("click", function (e) {
        e.preventDefault();
        showCustomConfirm(
          "Delete Post",
          "Are you sure you want to delete this post? This action cannot be undone.",
          () => {
            const form = this.closest("form");
            if (form) form.submit();
          }
        );
      });
    });

    // Button hover effects with ripple
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        createRipple(e, this);
      });
    });

    // Auto-resize textareas
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((textarea) => {
      autoResizeTextarea(textarea);
    });
  }

  // Custom confirmation dialog
  function showCustomConfirm(title, message, onConfirm) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
        `;

    const dialog = document.createElement("div");
    dialog.style.cssText = `
            background: var(--bg-primary);
            border-radius: var(--radius-lg);
            padding: 24px;
            max-width: 400px;
            margin: 16px;
            box-shadow: var(--shadow-xl);
            border: 1px solid var(--border);
        `;

    dialog.innerHTML = `
            <h3 style="margin-bottom: 12px; color: var(--text-primary); font-size: 18px;">${title}</h3>
            <p style="margin-bottom: 24px; color: var(--text-secondary); line-height: 1.5;">${message}</p>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button class="btn btn-outline cancel-btn">Cancel</button>
                <button class="btn btn-danger confirm-btn">Delete</button>
            </div>
        `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Add event listeners
    dialog.querySelector(".cancel-btn").addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    dialog.querySelector(".confirm-btn").addEventListener("click", () => {
      document.body.removeChild(overlay);
      onConfirm();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }

  // Ripple effect for buttons
  function createRipple(event, element) {
    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

    element.style.position = "relative";
    element.style.overflow = "hidden";
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Auto-resize textarea
  function autoResizeTextarea(textarea) {
    function resize() {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }

    textarea.addEventListener("input", resize);
    resize(); // Initial resize
  }

  // Scroll Effects
  function initializeScrollEffects() {
    // Scroll-to-top button
    const scrollButton = document.createElement("button");
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            transform: translateY(100px);
            transition: all 0.3s ease;
            z-index: 100;
        `;

    document.body.appendChild(scrollButton);

    // Show/hide scroll button
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollButton.style.transform = "translateY(0)";
      } else {
        scrollButton.style.transform = "translateY(100px)";
      }
    });

    // Scroll to top
    scrollButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    // Parallax effect for page headers
    const pageHeaders = document.querySelectorAll(".page-header");
    pageHeaders.forEach((header) => {
      window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        const parallax = scrolled * 0.5;
        header.style.transform = `translateY(${parallax}px)`;
      });
    });
  }

  // Tooltips
  function initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll("[title]");

    elementsWithTooltips.forEach((element) => {
      const title = element.getAttribute("title");
      element.removeAttribute("title");

      let tooltip;

      element.addEventListener("mouseenter", () => {
        tooltip = document.createElement("div");
        tooltip.textContent = title;
        tooltip.style.cssText = `
                    position: absolute;
                    background: var(--gray-800);
                    color: white;
                    padding: 6px 12px;
                    border-radius: var(--radius);
                    font-size: 14px;
                    white-space: nowrap;
                    z-index: 1000;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                `;

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left =
          rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + "px";

        setTimeout(() => (tooltip.style.opacity = "1"), 10);
      });

      element.addEventListener("mouseleave", () => {
        if (tooltip) {
          tooltip.style.opacity = "0";
          setTimeout(() => tooltip.remove(), 200);
        }
      });
    });
  }

  // Notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 16px 20px;
            border-radius: var(--radius);
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow-lg);
        `;

    // Set background color based on type
    const colors = {
      info: "var(--info)",
      success: "var(--success)",
      warning: "var(--warning)",
      error: "var(--danger)",
    };
    notification.style.background = colors[type] || colors.info;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => (notification.style.transform = "translateX(0)"), 10);

    // Auto remove
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Loading state for buttons
  function showLoadingState(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
    button.disabled = true;

    // Reset after form submission (this won't actually run due to page redirect)
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.disabled = false;
    }, 2000);
  }

  // Auto-save indicator
  function showAutoSaveIndicator() {
    let indicator = document.querySelector(".auto-save-indicator");

    if (!indicator) {
      indicator = document.createElement("div");
      indicator.className = "auto-save-indicator";
      indicator.style.cssText = `
                position: fixed;
                bottom: 24px;
                left: 24px;
                padding: 8px 16px;
                background: var(--success);
                color: white;
                border-radius: var(--radius);
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
      indicator.innerHTML = '<i class="fas fa-check"></i> Draft saved';
      document.body.appendChild(indicator);
    }

    indicator.style.opacity = "1";
    setTimeout(() => (indicator.style.opacity = "0"), 2000);
  }
});

// Add ripple animation CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
