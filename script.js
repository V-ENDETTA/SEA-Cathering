function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('open');
}

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (window.location.href.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });

  let current = 0;
  const testimonials = document.querySelectorAll('.testimonial');

  function showTestimonial(index) {
    testimonials.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  if (testimonials.length > 0) {
    showTestimonial(current);
    setInterval(() => {
      current = (current + 1) % testimonials.length;
      showTestimonial(current);
    }, 4000);
  }

  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('customerName').value;
      const message = document.getElementById('message').value;
      const rating = document.getElementById('rating').value;
      console.log(`New Testimonial: ${name} - ${rating} Stars - "${message}"`);
      alert("Terima kasih atas testimoni Anda!");
      this.reset();
    });
  }

  const subscriptionForm = document.getElementById('subscriptionForm');
  if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const planPrice = parseInt(document.getElementById('plan').value);
      const mealTypes = Array.from(document.querySelectorAll('#mealTypes input:checked'));
      const deliveryDays = Array.from(document.querySelectorAll('#deliveryDays input:checked'));

      if (mealTypes.length === 0 || deliveryDays.length === 0) {
        alert("Pilih minimal satu jenis makan dan satu hari pengiriman.");
        return;
      }

      const totalPrice = planPrice * mealTypes.length * deliveryDays.length * 4.3;

      document.getElementById('result').innerText =
        `Total Harga Langganan Anda: Rp${totalPrice.toLocaleString('id-ID')},00`;
    });
  }
});

function openModal(id) {
  document.getElementById(`modal-${id}`).style.display = "block";
}

function closeModal(id) {
  document.getElementById(`modal-${id}`).style.display = "none";
}

window.onclick = function (event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
};

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('open');
}

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (window.location.href.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });
});

let current = 0;
const testimonials = document.querySelectorAll('.testimonial');

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
}

setInterval(() => {
  current = (current + 1) % testimonials.length;
  showTestimonial(current);
}, 4000);

document.getElementById('reviewForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const message = document.getElementById('message').value;
  const rating = document.getElementById('rating').value;
  console.log(`New Testimonial: ${name} - ${rating} Stars - "${message}"`);
  alert("Terima kasih atas testimoni Anda!");
  this.reset();
});

document.getElementById('subscriptionForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const planPrice = parseInt(document.getElementById('plan').value);
  const mealTypes = Array.from(document.querySelectorAll('#mealTypes input:checked'));
  const deliveryDays = Array.from(document.querySelectorAll('#deliveryDays input:checked'));

  if (mealTypes.length === 0 || deliveryDays.length === 0) {
    alert("Pilih minimal satu jenis makan dan satu hari pengiriman.");
    return;
  }

  const totalPrice = planPrice * mealTypes.length * deliveryDays.length * 4.3;

  document.getElementById('result').innerText =
    `Total Harga Langganan Anda: Rp${totalPrice.toLocaleString('id-ID')},00`;
});

function calculatePrice() {
  const planPrice = parseInt(document.getElementById('plan').value);
  const mealTypes = Array.from(document.querySelectorAll('#mealTypes input:checked'));
  const deliveryDays = Array.from(document.querySelectorAll('#deliveryDays input:checked'));

  if (mealTypes.length === 0 || deliveryDays.length === 0) {
    document.getElementById('result').innerText = "Pilih minimal satu jenis makan dan satu hari pengiriman.";
    return;
  }

  const totalPrice = planPrice * mealTypes.length * deliveryDays.length * 4.3;

  document.getElementById('result').innerText =
    `Total Harga Langganan Anda:\nRp${totalPrice.toLocaleString('id-ID')},00\n\n` +
    `Rumus: ${formatRumus(planPrice, mealTypes.length, deliveryDays.length)} = Rp${totalPrice.toLocaleString('id-ID')},00`;
}

function formatRumus(price, meals, days) {
  return `Rp${price.toLocaleString('id-ID')} × ${meals} × ${days} × 4,3`;
}
