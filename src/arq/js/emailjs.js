document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("Nl1pSehQMNTqbt0ib");

    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const values = {};
        formData.forEach((value, key) => {
            values[key] = value;
        });

        console.log("🟡 Dados capturados:", values);

        emailjs.sendForm("service_9i6r5en", "template_qb418zc", form)
            .then(() => {
                const modal = new bootstrap.Modal(document.getElementById('modalEmailSucesso'));
                modal.show();

                form.reset();
            })
            .catch((error) => {
                console.error("❌ Erro:", error);
                alert("Erro ao enviar.");
            });
    });
});
