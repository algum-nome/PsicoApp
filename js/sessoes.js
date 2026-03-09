let agendaId = null;
let audioBlob = null;

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    agendaId = params.get("id");
    
    if (!agendaId) {
        alert("ID da agenda não encontrado!");
        window.location.href = "agenda.html";
        return;
    }
    
    listarSessoes();
};

async function salvarSessao() {
    let descricao = document.getElementById("descricao").value.trim();
    
    if (!descricao) {
        alert("Descreva a sessão!");
        return;
    }
    
    try {
        let audioUrl = "";
        
        if (audioBlob) {
            const storageRef = firebase.storage().ref();
            const audioRef = storageRef.child(`sessoes/${agendaId}_${Date.now()}.webm`);
            
            await audioRef.put(audioBlob);
            
            audioUrl = await audioRef.getDownloadURL();
        }
        
        await db.collection("sessoes").add({
            agendaId,
            descricao,
            audio: audioUrl,
            dataRegistro: new Date()
        });
        
        alert("Sessão salva com sucesso!");
        document.getElementById("descricao").value = "";
        audioBlob = null;
        document.getElementById("player").src = "";
        listarSessoes();
        
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar: " + error.message);
    }
}

function listarSessoes() {
    let lista = document.getElementById("listaSessoes");
    
    db.collection("sessoes")
        .where("agendaId", "==", agendaId)
        .orderBy("dataRegistro", "desc")
        .onSnapshot(snapshot => {
            lista.innerHTML = "";
            
            if (snapshot.empty) {
                lista.innerHTML = '<li class="list-group-item text-muted">Nenhuma sessão registrada</li>';
                return;
            }
            
            snapshot.forEach(doc => {
                let sessao = doc.data();
                let dataFormatada = sessao.dataRegistro ? 
                    new Date(sessao.dataRegistro.seconds * 1000).toLocaleDateString('pt-BR') : 
                    "Data não disponível";
                
                let li = document.createElement("li");
                li.className = "list-group-item";
                
                let audioHtml = sessao.audio ? 
                    `<audio controls src="${sessao.audio}" class="mt-2 w-100"></audio>` : 
                    '<small class="text-muted">Sem áudio</small>';
                
                li.innerHTML = `
                    <div>
                        <small class="text-muted">${dataFormatada}</small>
                        <p class="mt-2 mb-1">${sessao.descricao}</p>
                        ${audioHtml}
                    </div>
                `;
                
                lista.appendChild(li);
            });
        });
}