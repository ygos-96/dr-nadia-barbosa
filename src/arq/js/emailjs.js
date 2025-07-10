document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("Nl1pSehQMNTqbt0ib");

  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const values = {};
      formData.forEach((value, key) => {
        values[key] = value;
      });

      console.log("🟡 Dados capturados do formulário:", values);

      emailjs.sendForm("service_hq86q3o", "template_hifadqj", form)
        .then(() => {
          alert("Mensagem enviada com sucesso!");
          form.reset();
        })
        .catch((error) => {
          console.error("❌ Erro ao enviar:", error);
          alert("Erro ao enviar. Tente novamente.");
        });
    });
  }
});
