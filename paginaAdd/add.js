// Impede o acesso direto pela URL se não estiver logado como Administrador
if (sessionStorage.getItem('isAdmin') !== 'true') {
    alert('Acesso negado! Apenas administradores podem acessar esta página.');
    window.location.href = '../index.html';
}

const containerFoto = document.getElementById('divContainerFoto');
const inputArquivo = document.getElementById('inputArquivo');
const imagemPreview = document.getElementById('previewImg');
const botaoUpload = document.querySelector('.botao-upload');
const botaoSalvar = document.querySelector('.botao-salvar');

if (containerFoto) {
    containerFoto.addEventListener('click', () => {
        inputArquivo.click();
    });
}

if (inputArquivo) {
    inputArquivo.addEventListener('change', (event) => {
        const arquivo = event.target.files[0];
        
        if (arquivo) {
            imagemPreview.src = URL.createObjectURL(arquivo);
            imagemPreview.style.display = 'block'; 
            if (botaoUpload) botaoUpload.style.display = 'none'; 
        }
    });
}

if (botaoSalvar) {
    botaoSalvar.addEventListener('click', () => {
        const nomeInput = document.querySelector('.nome').value.trim();
        const dataInput = document.querySelector('.data').value;
        const arquivo = inputArquivo.files[0];

        if (!nomeInput || !dataInput || !arquivo) {
            alert('Por favor, preencha o nome, a data e escolha uma foto!');
            return;
        }

        const leitor = new FileReader();
        
        leitor.onload = function(e) {
            const imagemBase64 = e.target.result;

            const novoFuncionario = {
                id: Date.now(), // ID único para controle e exclusão
                nome: nomeInput,
                data: dataInput,
                foto: imagemBase64
            };

            // Pega a lista atual do LocalStorage ou inicia uma vazia
            let listaFuncionarios = JSON.parse(localStorage.getItem('listaFuncionarios')) || [];
            
            // Adiciona o novo registro sem apagar os anteriores
            listaFuncionarios.push(novoFuncionario);

            // Salva de volta no LocalStorage
            localStorage.setItem('listaFuncionarios', JSON.stringify(listaFuncionarios));

            // Retorna para a página principal
            window.location.href = '../index.html'; 
        };

        leitor.readAsDataURL(arquivo);
    });
}