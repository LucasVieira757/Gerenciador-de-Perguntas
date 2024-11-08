// app.js
 
// Carrega as perguntas ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
    displayQuestions();
    setInterval(backupData, 7 * 24 * 60 * 60 * 1000); // Backup semanal
});
 
// Adiciona uma nova pergunta
function addQuestion() {
    const questionText = document.getElementById("question").value;
    if (questionText === "") {
        alert("Por favor, insira uma pergunta.");
        return;
    }
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    questions.push({ question: questionText, answer: "", status: "Pendente" });
    localStorage.setItem("questions", JSON.stringify(questions));
    document.getElementById("question").value = "";
    displayQuestions();
}
 
// Exibe perguntas de acordo com o status
function displayQuestions() {
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    
    // Limpa colunas
    document.getElementById("pendente-list").innerHTML = "";
    document.getElementById("analise-list").innerHTML = "";
    document.getElementById("concluido-list").innerHTML = "";
    
    // Distribui perguntas por status
    questions.forEach((item, index) => {
        const questionHTML = `
            <div class="question-card">
                <strong>Pergunta:</strong> ${item.question}<br>
                <strong>Resposta:</strong> ${item.answer || "Aguardando resposta"}<br>
                <div class="status status-${item.status.toLowerCase()}">Status: ${item.status}</div>
                
                <input type="text" id="answer-${index}" placeholder="Digite a resposta" value="${item.answer}" ${item.status === "Concluído" ? "disabled" : ""}>
                <button onclick="addAnswer(${index})" ${item.status === "Concluído" ? "disabled" : ""}>Responder</button>
 
                <select class="status-select" id="status-${index}" onchange="updateStatus(${index})" ${item.status === "Concluído" ? "disabled" : ""}>
                    <option value="Pendente" ${item.status === "Pendente" ? "selected" : ""}>Pendente</option>
                    <option value="Análise" ${item.status === "Análise" ? "selected" : ""}>Análise</option>
                </select>
 
                <button class="delete-btn" onclick="deleteQuestion(${index})">Excluir</button>
                <button class="complete-btn" onclick="markAsCompleted(${index})" ${item.status === "Concluído" ? "disabled" : ""}>Concluído</button>
            </div>
        `;
        if (item.status === "Pendente") {
            document.getElementById("pendente-list").innerHTML += questionHTML;
        } else if (item.status === "Análise") {
            document.getElementById("analise-list").innerHTML += questionHTML;
        } else {
            document.getElementById("concluido-list").innerHTML += questionHTML;
        }
    });
}
 
// Adiciona resposta a uma pergunta e altera o status para Análise
function addAnswer(index) {
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    const answerInput = document.getElementById(`answer-${index}`);
    const answerText = answerInput.value;
    if (answerText === "") {
        alert("Por favor, insira uma resposta.");
        return;
    }
    questions[index].answer = answerText;
    questions[index].status = "Análise";
    localStorage.setItem("questions", JSON.stringify(questions));
    displayQuestions();
}
 
// Atualiza o status da pergunta
function updateStatus(index) {
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    const selectedStatus = document.getElementById(`status-${index}`).value;
    questions[index].status = selectedStatus;
    localStorage.setItem("questions", JSON.stringify(questions));
    displayQuestions();
}
 
// Exclui uma pergunta
function deleteQuestion(index) {
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    questions.splice(index, 1);
    localStorage.setItem("questions", JSON.stringify(questions));
    displayQuestions();
}
 
// Marca a pergunta como concluída e salva resposta
function markAsCompleted(index) {
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    if (questions[index].answer === "") {
        alert("Por favor, insira uma resposta antes de marcar como concluído.");
        return;
    }
    questions[index].status = "Concluído";
    localStorage.setItem("questions", JSON.stringify(questions));
    displayQuestions();
}
 
// Filtra perguntas e respostas
function filterQuestions() {
    const searchQuery = document.getElementById("search").value.toLowerCase();
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    const filteredQuestions = questions.filter(q =>
        q.question.toLowerCase().includes(searchQuery) || q.answer.toLowerCase().includes(searchQuery)
    );
    displayFilteredQuestions(filteredQuestions);
}
 
// Exibe perguntas filtradas
function displayFilteredQuestions(filteredQuestions) {
    document.getElementById("pendente-list").innerHTML = "";
    document.getElementById("analise-list").innerHTML = "";
    document.getElementById("concluido-list").innerHTML = "";
 
    filteredQuestions.forEach((item, index) => {
        const questionHTML = `<div class="question-card"><strong>Pergunta:</strong> ${item.question}<br><strong>Resposta:</strong> ${item.answer || "Aguardando resposta"}<br><div class="status status-${item.status.toLowerCase()}">Status: ${item.status}</div></div>`;
        if (item.status === "Pendente") {
            document.getElementById("pendente-list").innerHTML += questionHTML;
        } else if (item.status === "Análise") {
            document.getElementById("analise-list").innerHTML += questionHTML;
        } else {
            document.getElementById("concluido-list").innerHTML += questionHTML;
        }
    });
}
 
// Função de backup semanal para arquivo JSON
function backupData() {
    const questions = localStorage.getItem("questions");
    const blob = new Blob([questions], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
a.download = `backup_${new Date().toISOString().split("T")[0]}.json`;
a.click();
    URL.revokeObjectURL(url);
}