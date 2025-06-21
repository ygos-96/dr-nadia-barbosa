document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("Nl1pSehQMNTqbt0ib");

  const form = document.getElementById("form-agendamento"); // Corrigido o ID

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      emailjs.sendForm("service_hq86q3o", "template_wgr6r07", form)
        .then(() => {
          alert("Mensagem enviada com sucesso!");
          form.reset();
        })
        .catch((error) => {
          console.error("Erro ao enviar:", error);
          alert("Erro ao enviar. Tente novamente.");
        });
    });
  }
});
