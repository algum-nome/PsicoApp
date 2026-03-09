window.onload = () => {
    carregarPacientes();
    listarAgendas();
};

function carregarPacientes() {
    let select = document.getElementById("paciente");
    select.innerHTML = '<option value="">Selecione um paciente...</option>';

    db.collection("pacientes").orderBy("nome", "asc").get().then(snapshot => {
        snapshot.forEach(doc => {
            let paciente = doc.data();
            let option = document.createElement("option");
            option.value = doc.id;
            option.textContent = paciente.nome;
            select.appendChild(option);
        });
    }).catch(error => console.error("Erro ao carregar pacientes:", error));
}

function salvarAgenda() {
    let paciente = document.getElementById("paciente").value;
    let data = document.getElementById("data").value;
    let hora = document.getElementById("hora").value;

    if (!paciente || !data || !hora) {
        alert("Preencha todas as informações!");
        return;
    }

    let hoje = new Date().toISOString().split('T')[0];
    if (data < hoje) {
        alert("A data não pode ser anterior a hoje!");
        return;
    }

    db.collection("agendas").add({
        pacienteId: paciente,
        data,
        hora,
        status: "agendado",
        dataCriacao: new Date()
    }).then(() => {
        alert("Agendamento criado com sucesso!");
        document.getElementById("data").value = "";
        document.getElementById("hora").value = "";
        listarAgendas();
    }).catch(error => alert("Erro ao agendar: " + error.message));
}

function listarAgendas() {
    let lista = document.getElementById("listaAgendas");

    db.collection("agendas").orderBy("data", "desc").onSnapshot(snapshot => {
        lista.innerHTML = "";

        if (snapshot.empty) {
            lista.innerHTML = '<li class="list-group-item text-muted">Nenhum agendamento</li>';
            return;
        }

        snapshot.forEach(doc => {
            let agenda = doc.data();

            db.collection("pacientes").doc(agenda.pacienteId).get()
                .then(pacienteDoc => {
                    let nomePaciente = pacienteDoc.exists ? pacienteDoc.data().nome : "Paciente não encontrado";
                    let li = document.createElement("li");
                    li.className = "list-group-item";

                    li.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${nomePaciente}</strong><br>
                                Data: ${formatarData(agenda.data)} - ${agenda.hora}
                            </div>
                            <a href="sessoes.html?id=${doc.id}" class="btn btn-primary btn-sm">
                                Ver Sessões
                            </a>
                        </div>
                    `;

                    lista.appendChild(li);
                });
        });
    });
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}