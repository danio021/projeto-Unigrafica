document.addEventListener("DOMContentLoaded", () => {
    const containerFuncionarios = document.getElementById('listaFuncionarios');
    const inputPesquisa = document.getElementById('pesquisa');
    const selectAno = document.getElementById('filtroAno');
    const selectMes = document.getElementById('filtroMes');
    const selectOrdenacao = document.getElementById('ordenacao');
    const btnLimpar = document.getElementById('btnLimparFiltros');
    const btnFlutuanteAdd = document.getElementById('btnFlutuanteAdd');
    
    const btnAbrirAdmModal = document.getElementById('btnAbrirAdmModal');
    const modalAdm = document.getElementById('modalAdm');
    const inputSenhaAdm = document.getElementById('inputSenhaAdm');
    const btnLoginAdm = document.getElementById('btnLoginAdm');
    const btnSairAdm = document.getElementById('btnSairAdm');
    const textoStatusModal = document.getElementById('textoStatusModal');
    const areaLoginAdm = document.getElementById('areaLoginAdm');

    let funcionarios = JSON.parse(localStorage.getItem('listaFuncionarios')) || [];
    let isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    
    function popularAnos() {
        if (!selectAno) return;
        const anoInicial = 1940;
        const anoFinal = new Date().getFullYear();

        for (let ano = anoFinal; ano >= anoInicial; ano--) {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            selectAno.appendChild(option);
        }
    }
    popularAnos();
    atualizarEstadoAdm();

    if (btnAbrirAdmModal) {
        btnAbrirAdmModal.addEventListener('click', (e) => {
            e.stopPropagation();
            modalAdm.style.display = modalAdm.style.display === 'block' ? 'none' : 'block';
        });
    }

    document.addEventListener('click', (e) => {
        if (modalAdm && !modalAdm.contains(e.target) && e.target !== btnAbrirAdmModal) {
            modalAdm.style.display = 'none';
        }
    });

    if (btnLoginAdm) {
        btnLoginAdm.addEventListener('click', () => {
            const senhaDigitada = inputSenhaAdm.value;
            if (senhaDigitada === '') {
                isAdmin = true;
                sessionStorage.setItem('isAdmin', 'true');
                alert('Modo Administrador ativado com sucesso!');
                inputSenhaAdm.value = '';
                modalAdm.style.display = 'none';
            } else {
                alert('Senha incorreta!');
                inputSenhaAdm.value = '';
            }
            atualizarEstadoAdm();
            filtrarEordenarFuncionarios();
        });
    }

    if (btnSairAdm) {
        btnSairAdm.addEventListener('click', () => {
            isAdmin = false;
            sessionStorage.setItem('isAdmin', 'false');
            alert('Modo Administrador desativado.');
            modalAdm.style.display = 'none';
            atualizarEstadoAdm();
            filtrarEordenarFuncionarios();
        });
    }

    function atualizarEstadoAdm() {
        if (isAdmin) {
            if (textoStatusModal) textoStatusModal.textContent = 'Modo ADM: Ligado (Ativo)';
            if (areaLoginAdm) areaLoginAdm.style.display = 'none';
            if (btnSairAdm) btnSairAdm.style.display = 'block';
            if (btnFlutuanteAdd) btnFlutuanteAdd.style.display = 'flex';
        } else {
            if (textoStatusModal) textoStatusModal.textContent = 'Modo ADM: Desligado';
            if (areaLoginAdm) areaLoginAdm.style.display = 'flex';
            if (btnSairAdm) btnSairAdm.style.display = 'none';
            if (btnFlutuanteAdd) btnFlutuanteAdd.style.display = 'none';
        }
    }

    function renderizarCards(dados) {
        if (!containerFuncionarios) return;
        containerFuncionarios.innerHTML = '';

        if (dados.length === 0) {
            containerFuncionarios.innerHTML = `<p style="color: #444; width: 100%; text-align: center;">Nenhum funcionário encontrado.</p>`;
            return;
        }

        const fragmento = document.createDocumentFragment();

        dados.forEach(func => {
            const partesData = func.data ? func.data.split('-') : [];
            const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : func.data;

            const card = document.createElement('div');
            card.classList.add('funcionarios');

            let htmlCard = `
                <img src="${func.foto}" alt="Foto do Funcionário" loading="lazy">
                <p><strong>${func.nome}</strong></p>
                <p style="font-size: 14px; color: #555;">Aniversário: ${dataFormatada}</p>
            `;

            if (isAdmin) {
                htmlCard += `
                    <button class="btn-deletar" data-id="${func.id}">Deletar</button>
                `;
            }

            card.innerHTML = htmlCard;
            fragmento.appendChild(card);
        });

        containerFuncionarios.appendChild(fragmento);

        if (isAdmin) {
            const botoesDeletar = document.querySelectorAll('.btn-deletar');
            botoesDeletar.forEach(botao => {
                botao.addEventListener('click', (e) => {
                    const idParaDeletar = Number(e.target.getAttribute('data-id'));
                    if (confirm('Tem certeza que deseja remover este funcionário?')) {
                        deletarFuncionario(idParaDeletar);
                    }
                });
            });
        }
    }

    function deletarFuncionario(id) {
        funcionarios = funcionarios.filter(func => func.id !== id);
        localStorage.setItem('listaFuncionarios', JSON.stringify(funcionarios));
        filtrarEordenarFuncionarios();
    }

    function filtrarEordenarFuncionarios() {
        const termoBusca = inputPesquisa ? inputPesquisa.value.toLowerCase() : '';
        const anoSelecionado = selectAno ? selectAno.value : '';
        const mesSelecionado = selectMes ? selectMes.value : '';
        const tipoOrdenacao = selectOrdenacao ? selectOrdenacao.value : 'data-recente';

        let filtrados = funcionarios.filter(func => {
            if (!func.data) return false;
            const [anoFunc, mesFunc, diaFunc] = func.data.split('-');
            const dataFormatadaStr = `${diaFunc}/${mesFunc}/${anoFunc}`;

            const correspondeBusca = func.nome.toLowerCase().includes(termoBusca) || 
                                     dataFormatadaStr.includes(termoBusca) ||
                                     func.data.includes(termoBusca);

            const correspondeAno = anoSelecionado === "" || anoFunc === anoSelecionado;
            const correspondeMes = mesSelecionado === "" || mesFunc === mesSelecionado;

            return correspondeBusca && correspondeAno && correspondeMes;
        });

        filtrados.sort((a, b) => {
            if (tipoOrdenacao === 'alfabetica') {
                return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'accent' });
            } else if (tipoOrdenacao === 'data-antiga') {
                return new Date(a.data) - new Date(b.data);
            } else {
                return new Date(b.data) - new Date(a.data);
            }
        });

        renderizarCards(filtrados);
    }

    if (inputPesquisa) inputPesquisa.addEventListener('input', filtrarEordenarFuncionarios);
    if (selectAno) selectAno.addEventListener('change', filtrarEordenarFuncionarios);
    if (selectMes) selectMes.addEventListener('change', filtrarEordenarFuncionarios);
    if (selectOrdenacao) selectOrdenacao.addEventListener('change', filtrarEordenarFuncionarios);

    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            if (inputPesquisa) inputPesquisa.value = '';
            if (selectAno) selectAno.value = '';
            if (selectMes) selectMes.value = '';
            if (selectOrdenacao) selectOrdenacao.value = 'data-recente';
            filtrarEordenarFuncionarios();
        });
    }

    filtrarEordenarFuncionarios();
});