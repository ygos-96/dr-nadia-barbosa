const scriptURL = 'https://script.google.com/macros/s/AKfycbyUK_x3u1YcswO_Ga6KaUWMtv2pSHdGCx_qlQtjwtBanPQs7rQvP-EJzcfYRDVgm3ut/exec';
let horariosOcupados = [];

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendario');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        selectable: true,
        datesSet: () => marcarDiasInativos(),
        dateClick: async function (info) {
            const hoje = dayjs().format('YYYY-MM-DD');
            const selecionada = info.dateStr;
            const diaSemana = dayjs(selecionada).day();

            // Impede seleção de hoje, dias anteriores ou domingos
            if (!dayjs(selecionada).isAfter(hoje) || diaSemana === 0) return;

            document.getElementById('data').value = selecionada;
            document.querySelectorAll('.fc-daygrid-day').forEach(el => el.classList.remove('fc-day-selected'));
            info.dayEl.classList.add('fc-day-selected');

            await gerarHorarios(selecionada);
        }
    });

    calendar.render();
});

function marcarDiasInativos() {
    const hoje = dayjs().format('YYYY-MM-DD');
    const dias = document.querySelectorAll('.fc-daygrid-day');

    dias.forEach(dia => {
        const data = dia.getAttribute('data-date');
        const diaSemana = dayjs(data).day();

        if (!data) return;

        // Bloqueia hoje, dias anteriores e domingos
        if (!dayjs(data).isAfter(hoje) || diaSemana === 0) {
            dia.classList.add('fc-day-disabled');
        }
    });
}

async function gerarHorarios(dataSelecionada) {
    const container = document.getElementById('horarios');
    const loading = document.getElementById('loadingHorarios');

    container.innerHTML = '';
    loading.classList.remove('hidden');

    const horarios = [];
    const diaSemana = dayjs(dataSelecionada).day();
    const inicio = diaSemana === 6 ? 9 : 8;
    const fim = diaSemana === 6 ? 13 : 21;

    for (let h = inicio; h < fim; h++) {
        horarios.push(`${h.toString().padStart(2, '0')}:00`);
    }

    try {
        const response = await fetch(scriptURL);
        const agendados = await response.json();

        horariosOcupados = [];

        agendados.forEach(ev => {
            if (ev.data !== dataSelecionada) return;

            if (ev.horaInicio && ev.horaFim) {
                const horaInicio = parseInt(ev.horaInicio.split(':')[0]);
                const horaFim = parseInt(ev.horaFim.split(':')[0]);

                for (let h = horaInicio; h < horaFim; h++) {
                    horariosOcupados.push(`${h.toString().padStart(2, '0')}:00`);
                }
            }

            if (ev.hora) {
                horariosOcupados.push(ev.hora);
            }
        });

    } catch (err) {
        console.error("Erro ao buscar agendados:", err);
        container.innerHTML = "<p class='text-danger'>Erro ao carregar horários.</p>";
        loading.classList.add('hidden');
        return;
    }

    horarios.forEach(hora => {
        const btn = document.createElement('button');
        btn.textContent = hora;
        btn.type = 'button';

        const bloqueado = horariosOcupados.includes(hora);
        btn.className = bloqueado
            ? 'btn btn-outline-danger btn-sm m-1'
            : 'btn btn-outline-success btn-sm m-1';

        if (!bloqueado) {
            btn.onclick = () => {
                document.getElementById('horarioSelecionado').value = hora;
                document.querySelectorAll('#horarios button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
        } else {
            btn.disabled = true;
        }

        container.appendChild(btn);
    });

    loading.classList.add('hidden');
}

document.getElementById("form-agendamento").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const data = document.getElementById("data").value;
    const hora = document.getElementById("horarioSelecionado").value;
    const observacoes = document.getElementById("obs").value.trim();

    if (!nome || !email || !telefone || !data || !hora) {
        alert("Por favor, preencha todos os campos obrigatórios e selecione uma data e horário.");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("telefone", telefone);
    formData.append("data", data);
    formData.append("hora", hora);
    formData.append("observacoes", observacoes);

    const btn = document.querySelector('#form-agendamento button[type="submit"]');
    const loading = document.getElementById("loadingSubmit");

    btn.disabled = true;
    loading.classList.remove("hidden");

    try {
        const res = await fetch(scriptURL, {
            method: "POST",
            body: formData,
        });

        const respostaTexto = await res.text();

        if (respostaTexto.includes("Horário já está ocupado")) {
            alert("Esse horário já foi agendado. Por favor, escolha outro.");
        } else if (respostaTexto.includes("Agendado com sucesso")) {
            loading.classList.add("hidden");
            const modal = new bootstrap.Modal(document.getElementById('modalSucesso'));
            modal.show();

            document.getElementById("form-agendamento").reset();
            document.getElementById("horarios").innerHTML = "";
            document.getElementById("data").value = "";
            document.getElementById("horarioSelecionado").value = "";
        } else {
            alert("Erro inesperado: " + respostaTexto);
        }
    } catch (err) {
        console.error("Erro ao enviar formulário:", err);
        alert("Erro ao tentar agendar. Tente novamente mais tarde.");
    } finally {
        btn.disabled = false;
        loading.classList.add("hidden");
    }
});
