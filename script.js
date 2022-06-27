
let nome;
let usuario;

entrarSala()

function entrarSala() {
     nome = prompt('Qual o seu nome?')
     usuario = {name: nome}
     const enviar = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', usuario);
     enviar.then(carregarMsg)
     enviar.catch(verificaNome)
}
function verificaNome() {
    alert('Esse nome já está sendo usado...')
    window.location.reload()
}
function verificaStatus() {
    let status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    status.catch(()=> {
        
            alert("Seu tempo de conexão expirou");
            window.location.reload()
        })       
}
let mensagem;

function carregarMsg() {
    mensagem = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    mensagem.then(mostrarMsg)
}
function mostrarMsg (mensagem){

    let totalMsg = mensagem.data.length;
    let paginaMsg = document.querySelector(".pagina")
    paginaMsg.innerHTML = "";

    for (let i = 0; i < totalMsg; i++) {

        let msg = mensagem.data[i];
        let containerMsg;
        if (msg.type === "status") {
            
            containerMsg =
            `<div class="${msg.type}">
                <p><a>(${msg.time})</a> <b>${msg.from}</b> ${msg.text}</p>
            </div>`

        } else if (msg.type === "message") {

            containerMsg =
            `<div class="${msg.type}">
                <p><a>(${msg.time})</a> <b>${msg.from}</b> para <c>${msg.to}</c>: ${msg.text}</p>
            </div>`

        } else if (msg.type === "private_message" && (msg.to === nome || msg.from === nome)) {

            containerMsg =
            `<div class="${msg.type}">
                <p><a>(${msg.time})</a> <b>${msg.from}</b> reservadamente para <c>${msg.to}</c>: ${msg.text}</p>
            </div>`

        } else {
            containerMsg = '<div class="hidden"></div>'
        }

        paginaMsg.innerHTML += containerMsg;
    }
    novaMsg()
}

let remetente = 'Todos';
let tipoMsg = 'message';

function novaMsg() {

    document.querySelector('.pagina').lastElementChild.scrollIntoView();
}
function enviarMensagem() {

    let recado = document.querySelector('input.frase').value
    let modeloMsg = {

        from: nome,
        to: remetente,
        text: recado,
        type: tipoMsg

    }

    console.log(modeloMsg);

    const mensagemEnviada = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', modeloMsg);
    document.querySelector('input.frase').value = "";
    mensagemEnviada.then(carregarMsg);
    mensagemEnviada.catch(alertaErro);
}
function alertaErro(error) {
    console.log(error.response.statusText);
}

setInterval(carregarMsg, 3000);
setInterval(verificaStatus, 5000)
