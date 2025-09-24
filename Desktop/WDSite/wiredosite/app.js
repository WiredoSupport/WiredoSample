async function loadPage(path) {
  let file;
  switch (path) {
    case "/about":
      file = "/pages/about.html";
      break;
    case "/contact":
      file = "/pages/contact.html";
      break;
    case "/tracking":
      file = "/pages/tracking.html";
      break;
    default:
      file = "/pages/home.html";
  }

  const res = await fetch(file);
  const html = await res.text();
  document.getElementById("app").innerHTML = html;

  // After new page is loaded, initialize accordions if they exist
  initAccordions();

  // For contact us purposes
  initContactForm();
}

function navigateTo(url) {
  history.pushState(null, null, url);
  loadPage(window.location.pathname);
}

document.addEventListener("click", e => {
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    const path = link.getAttribute("data-link");
    navigateTo(path);
  }
});

window.addEventListener("popstate", () => {
  loadPage(window.location.pathname);
});


function initAccordions() {
  // Accordions
  const acc = document.getElementsByClassName("accordion");
  for (let i = 0; i < acc.length; i++) {
    acc[i].onclick = function () {
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    };
  }

  // FAQ accordions (for contact.html)
  const faqAcc = document.getElementsByClassName("faq-accordion");
  for (let i = 0; i < faqAcc.length; i++) {
    faqAcc[i].onclick = function () {
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    };
  }
}

function initContactForm() {
  const form = document.querySelector(".fill-form");
  if (!form) return; // skip if the page isn't contact.html

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const templateParams = {
      name: form.name.value,
      tracking_num: form["tracking-num"].value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value
    };

    emailjs.send("service_9u1wx9n", "template_dyuf60k", templateParams)
      .then(() => {
        alert("Message sent successfully!");
        form.reset();
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        alert("Failed to send message. Please try again.");
      });
  });
}



loadPage(window.location.pathname);
