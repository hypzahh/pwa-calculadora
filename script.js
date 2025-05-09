document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const pesoInput = document.getElementById('peso');
    const quantidadeInput = document.getElementById('quantidade');
    const adicionarBtn = document.getElementById('adicionar');
    const calcularBtn = document.getElementById('calcular');
    const limparBtn = document.getElementById('limpar');
    const salvarBtn = document.getElementById('salvar');
    const abaAdicionados = document.getElementById('abaAdicionados');
    const abaSalvos = document.getElementById('abaSalvos');
    const conteudoAdicionados = document.getElementById('conteudoAdicionados');
    const conteudoSalvos = document.getElementById('conteudoSalvos');
    const listaItens = document.getElementById('lista-itens');
    const listaItensSalvos = document.getElementById('lista-itens-salvos');
    const resultadoDiv = document.getElementById('resultado');
    
    // Array para armazenar os itens adicionados e salvos
    let itensAdicionados = [];
    let itensSalvos = JSON.parse(localStorage.getItem('itensSalvos')) || [];

    // Função para atualizar a lista de itens adicionados
    function atualizarListaAdicionados() {
        listaItens.innerHTML = '';
        if (itensAdicionados.length === 0) {
            listaItens.innerHTML = '<li><i>Nenhum item adicionado.</i></li>';
        } else {
            itensAdicionados.forEach(function(item, index) {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = `${item.peso} kg × ${item.quantidade}`;
                const removerBtn = document.createElement('button');
                removerBtn.textContent = '×';
                removerBtn.className = 'remover-item';
                removerBtn.addEventListener('click', function() {
                    itensAdicionados.splice(index, 1);
                    atualizarListaAdicionados();
                });
                li.appendChild(span);
                li.appendChild(removerBtn);
                listaItens.appendChild(li);
            });
        }
    }

    // Função para atualizar a lista de itens salvos
    function atualizarListaSalvos() {
        listaItensSalvos.innerHTML = '';
        if (itensSalvos.length === 0) {
            listaItensSalvos.innerHTML = '<li><i>Nenhum item salvo.</i></li>';
        } else {
            itensSalvos.forEach(function(item, index) {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = `Total Peso: ${item.totalPeso} kg, Total Itens: ${item.totalItens}, Média: ${item.media} kg (Data: ${item.data})`;
                
                // Botão para excluir item salvo
                const excluirBtn = document.createElement('button');
                excluirBtn.textContent = 'Excluir';
                excluirBtn.className = 'remover-item';
                excluirBtn.addEventListener('click', function() {
                    itensSalvos.splice(index, 1);
                    localStorage.setItem('itensSalvos', JSON.stringify(itensSalvos));
                    atualizarListaSalvos();
                });
                
                li.appendChild(span);
                li.appendChild(excluirBtn);
                listaItensSalvos.appendChild(li);
            });
        }
    }

    // Função para alternar entre as abas
    function alternarAbas(abaAtiva) {
        if (abaAtiva === 'adicionados') {
            conteudoAdicionados.classList.add('active');
            conteudoSalvos.classList.remove('active');
            abaAdicionados.classList.add('active');
            abaSalvos.classList.remove('active');
        } else {
            conteudoAdicionados.classList.remove('active');
            conteudoSalvos.classList.add('active');
            abaAdicionados.classList.remove('active');
            abaSalvos.classList.add('active');
        }
    }

    // Evento das abas
    abaAdicionados.addEventListener('click', function() {
        alternarAbas('adicionados');
    });

    abaSalvos.addEventListener('click', function() {
        alternarAbas('salvos');
    });

    // Adicionar item à lista de itens adicionados
    adicionarBtn.addEventListener('click', function() {
        const peso = parseFloat(pesoInput.value.replace(',', '.'));
        const quantidade = parseInt(quantidadeInput.value);
        
        if (isNaN(peso)) {
            alert('Por favor, insira um peso válido!');
            pesoInput.focus();
            return;
        }
        
        if (isNaN(quantidade) || quantidade < 1) {
            alert('Por favor, insira uma quantidade válida (mínimo 1)!');
            quantidadeInput.focus();
            return;
        }
        
        itensAdicionados.push({ 
            peso: peso, 
            quantidade: quantidade
        });
        
        atualizarListaAdicionados();
        pesoInput.value = '';
        quantidadeInput.value = '1';
        pesoInput.focus();
    });
    
    // Calcular média
    calcularBtn.addEventListener('click', function() {
        if (itensAdicionados.length === 0) {
            resultadoDiv.textContent = 'Adicione pelo menos um item para calcular a média.';
            return;
        }
        
        let totalPeso = 0;
        let totalQuantidade = 0;
        
        for (let i = 0; i < itensAdicionados.length; i++) {
            totalPeso += itensAdicionados[i].peso * itensAdicionados[i].quantidade;
            totalQuantidade += itensAdicionados[i].quantidade;
        }
        
        const media = totalPeso / totalQuantidade;
        
        resultadoDiv.innerHTML = '<strong>Total Peso:</strong> ' + totalPeso.toFixed(2) + ' kg<br>' +
                               '<strong>Total Itens:</strong> ' + totalQuantidade + '<br>' +
                               '<hr>' +
                               '<strong>Média:</strong> ' + media.toFixed(2) + ' kg';
    });
    
    // Limpar tudo
    limparBtn.addEventListener('click', function() {
        itensAdicionados = [];
        atualizarListaAdicionados();
        resultadoDiv.textContent = '';
        pesoInput.focus();
    });

    // Salvar os resultados
    salvarBtn.addEventListener('click', function() {
        if (itensAdicionados.length > 0) {
            let totalPeso = 0;
            let totalItens = 0;

            // Calculando os totais
            for (let i = 0; i < itensAdicionados.length; i++) {
                totalPeso += itensAdicionados[i].peso * itensAdicionados[i].quantidade;
                totalItens += itensAdicionados[i].quantidade;
            }

            const media = totalPeso / totalItens;
            const data = new Date().toLocaleDateString();

            // Adicionando ao array de itens salvos
            itensSalvos.push({
                totalPeso: totalPeso.toFixed(2),
                totalItens: totalItens,
                media: media.toFixed(2),
                data: data
            });

            // Limpar os itens adicionados e atualizar as listas
            itensAdicionados = [];
            atualizarListaAdicionados();
            atualizarListaSalvos();

            // Salvar no localStorage
            localStorage.setItem('itensSalvos', JSON.stringify(itensSalvos));

            alert('Resultado salvo com sucesso!');
        } else {
            alert('Nenhum item foi adicionado para salvar.');
        }
    });

    // Inicializar a interface
    alternarAbas('adicionados');
    atualizarListaSalvos();
});
