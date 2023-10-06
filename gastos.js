document.addEventListener('DOMContentLoaded', function() {
    const valorInicialInput = document.getElementById('valorInicial');
    const atualizarButton = document.getElementById('atualizar');
    const saldoSpan = document.getElementById('saldo');
    const novaDespesaInput = document.getElementById('novaDespesa');
    const valorDespesaInput = document.getElementById('valorDespesa');
    const adicionarButton = document.getElementById('adicionar');
    const listaDespesas = document.getElementById('listaDespesas');
    const graficoGastos = document.getElementById('graficoGastos').getContext('2d');

    let saldoInicial = 0;
    let saldoAtual = 0;

    let chartData = {
        labels: ['Saldo inicial', 'Saldo final'],
        datasets: [{
            label: 'Saldo',
            data: [0, 0],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        },
    
        {
            label: 'Saldo com despesas',
            data: [0, 0],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const chartConfig = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },

        plugins: [
            {
                afterDraw: (chart) => {
                    chart.canvas.style.width = '100%';
                    chart.canvas.style.height = 'auto';
                }
            }
        ]
    };

    let graficoGastosChart = new Chart(graficoGastos, chartConfig);

    atualizarButton.addEventListener('click', function() {
        const novoSaldo = parseFloat(valorInicialInput.value);
        if (!isNaN(novoSaldo)) {
            saldoInicial = novoSaldo;
            saldoAtual = novoSaldo;
            saldoSpan.textContent = saldoAtual.toFixed(2);
            valorInicialInput.value = '';
            chartData.datasets[0].data[0] = saldoAtual;
            chartData.datasets[0].data[1] = saldoAtual;
            graficoGastosChart.update();
        }
    });

    adicionarButton.addEventListener('click', function() {
        const novaDespesa = novaDespesaInput.value;
        const valorDespesa = parseFloat(valorDespesaInput.value);
        if (novaDespesa && !isNaN(valorDespesa)) {
            const novaDespesaItem = document.createElement('li');
            novaDespesaItem.textContent = `${novaDespesa}: R$${valorDespesa.toFixed(2)}`;
            const excluirButton = document.createElement('button');
            excluirButton.innerHTML = '<i class="fas fa-trash"></i>';
            excluirButton.classList.add('excluir');
            novaDespesaItem.appendChild(excluirButton);
            listaDespesas.appendChild(novaDespesaItem);

            saldoAtual -= valorDespesa;
            saldoSpan.textContent = saldoAtual.toFixed(2);
            chartData.datasets[0].data[1] = saldoAtual;
            graficoGastosChart.update();

            excluirButton.addEventListener('click', function() {
                saldoAtual += valorDespesa;
                saldoSpan.textContent = saldoAtual.toFixed(2);
                novaDespesaItem.remove();
                chartData.datasets[0].data[1] = saldoAtual;
                graficoGastosChart.update();
            });

            excluirButton.classList.add('botaoExcluir');

            novaDespesaInput.value = '';
            valorDespesaInput.value = '';
        }
    });

    const cleanButton = document.getElementById('clean');
    cleanButton.addEventListener('click', function() {
        // Limpa os campos de input
        valorInicialInput.value = '';
        novaDespesaInput.value = '';
        valorDespesaInput.value = '';

        // Reinicia o saldo e a lista de despesas
        saldoInicial = 0;
        saldoAtual = 0;
        saldoSpan.textContent = '0.00';
        listaDespesas.innerHTML = '';

        // Reinicia o gráfico
        chartData.datasets[0].data[0] = saldoAtual;
        chartData.datasets[0].data[1] = saldoAtual;
        graficoGastosChart.update();
    });
});
