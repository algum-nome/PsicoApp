let mediaRecorder;
let chunks = [];
let audioBlob = null;

async function gravarAudio() {
    try {
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        
        chunks = [];
        
        mediaRecorder.ondataavailable = e => {
            chunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
            audioBlob = new Blob(chunks, { type: "audio/webm" });
            let audioURL = URL.createObjectURL(audioBlob);
            document.getElementById("player").src = audioURL;
            
            stream.getTracks().forEach(track => track.stop());
        };
        
        setTimeout(() => {
            if (mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
        }, 30000);
        
        alert("Gravação iniciada! A gravação parará automaticamente após 30 segundos.");
        
    } catch (error) {
        console.error("Erro ao acessar microfone:", error);
        alert("Não foi possível acessar o microfone. Verifique as permissões.");
    }
}