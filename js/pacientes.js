const form = document.getElementById("formPaciente");
const lista = document.getElementById("listaPacientes");

function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    input.value = valor;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let nome = document.getElementById("nome").value.trim();
    let idade = document.getElementById("idade").value;
    let telefone = document.getElementById("telefone").value.replace(/\D/g, '');
    let responsavel = document.getElementById("responsavel").value;
    let email = document.getElementById("email").value;
    let obs = document.getElementById("obs").value;

    // Validações
    if (!nome || !idade || !telefone || !responsavel || !email) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        alert("Nome deve conter apenas letras!");
        return;
    }

    if (!/^\d{10,11}$/.test(telefone)) {
        alert("Telefone inválido! Digite 10 ou 11 números.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Email inválido!");
        return;
    }

    try {
        await db.collection("pacientes").add({
            nome,
            idade: parseInt(idade),
            telefone,
            responsavel,
            email,
            obs: obs || "Sem observações",
            dataCadastro: new Date()
        });

        alert("Paciente salvo com sucesso!");
        form.reset();
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar paciente!");
    }
});

function carregarPacientes() {
    db.collection("pacientes").orderBy("nome", "asc").onSnapshot(snapshot => {
        lista.innerHTML = "";

        if (snapshot.empty) {
            lista.innerHTML = '<li class="list-group-item text-muted">Nenhum paciente cadastrado</li>';
            return;
        }

        snapshot.forEach(doc => {
            let paciente = doc.data();
            let li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
                <div>
                    <strong>${paciente.nome}</strong> - ${paciente.telefone}
                    <br>
                    <small>Responsável: ${paciente.responsavel} | ${paciente.email}</small>
                </div>
                <button onclick="deletarPaciente('${doc.id}')" class="btn btn-danger btn-sm">
                    Excluir
                </button>
            `;

            lista.appendChild(li);
        });
    });
}

function deletarPaciente(id) {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
        db.collection("pacientes").doc(id).delete()
            .then(() => alert("Paciente excluído!"))
            .catch(error => alert("Erro ao excluir: " + error.message));
    }
}

carregarPacientes();