window.onload = () => {
    carregarEstatisticas();
    carregarPacientesRecentes();
};

function carregarEstatisticas() {
    db.collection("pacientes").get().then(snapshot => {
        document.getElementById("totalPacientes").innerText = snapshot.size || 0;
    });

    db.collection("agendas").get().then(snapshot => {
        document.getElementById("totalAgendas").innerText = snapshot.size || 0;
    });

    db.collection("sessoes").get().then(snapshot => {
        document.getElementById("totalSessoes").innerText = snapshot.size || 0;
    });
}

function carregarPacientesRecentes() {
    let lista = document.getElementById("pacientesRecentes");

    db.collection("pacientes")
        .orderBy("dataCadastro", "desc")
        .limit(5)
        .get()
        .then(snapshot => {
            lista.innerHTML = "";

            if (snapshot.empty) {
                lista.innerHTML = '<li class="list-group-item text-muted">Nenhum paciente recente</li>';
                return;
            }

            snapshot.forEach(doc => {
                let paciente = doc.data();
                let li = document.createElement("li");
                li.className = "list-group-item";
                li.innerText = paciente.nome;
                lista.appendChild(li);
            });
        });
}