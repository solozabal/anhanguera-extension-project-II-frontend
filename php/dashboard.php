<?php
/**
 * Dashboard administrativo simples
 */
require_once 'conect.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Viver Bem na Melhor Idade</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f5f7f9; }
        .dashboard-container { padding: 30px; max-width: 1200px; margin: 0 auto; }
        .metric-card { background: white; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .metric-value { font-size: 2.5rem; font-weight: 800; color: #198754; }
        .loading-spinner { width: 2rem; height: 2rem; border: 3px solid #f3f3f3; border-top: 3px solid #198754; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        /* Melhorar espaçamento dos itens nos gráficos */
        .chart-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 8px 0; 
            border-bottom: 1px solid #f0f0f0; 
        }
        .chart-item:last-child { border-bottom: none; }
        .chart-label { font-weight: 500; color: #333; }
        .chart-value { 
            background: #0d6efd; 
            color: white; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-weight: 600; 
            min-width: 40px; 
            text-align: center; 
        }
        .chart-container { margin-top: 15px; }
        
        /* Melhorar responsividade da tabela de leads */
        .table-responsive {
            overflow-x: auto;
        }
        
        @media (max-width: 768px) {
            .table th, .table td {
                font-size: 0.8rem;
                padding: 0.5rem 0.3rem;
            }
            
            .table th:nth-child(2), 
            .table td:nth-child(2) {
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .table th:nth-child(3), 
            .table td:nth-child(3) {
                min-width: 100px;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="../index.html">🏠 Viver Bem na Melhor Idade</a>
            <span class="navbar-text">Dashboard Administrativo</span>
        </div>
    </nav>

    <div class="dashboard-container">
        <h1>📊 Dashboard de Métricas</h1>
        
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="metric-card text-center">
                    <div class="metric-value" id="total-cadastros">0</div>
                    <div>Total de Cadastros</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="metric-card text-center">
                    <div class="metric-value" id="taxa-lgpd">0%</div>
                    <div>Aceitação LGPD</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="metric-card text-center">
                    <div class="metric-value" id="taxa-cookies">0%</div>
                    <div>Aceitação Cookies</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="metric-card text-center">
                    <div id="timestamp">Carregando...</div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="metric-card">
                    <h5>📈 Faixa Etária</h5>
                    <div id="faixa-etaria-chart">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="metric-card">
                    <h5>📅 Últimos 7 Dias</h5>
                    <div id="cadastros-7-dias-chart">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="metric-card">
                    <h5>🍪 Escolhas de Cookies</h5>
                    <div id="cookies-chart">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="metric-card">
            <h5>👥 Leads Recentes</h5>
            <div class="table-responsive">
                <table class="table" id="leads-recentes-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Idade</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="5" class="text-center">
                                <div class="loading-spinner"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        function updateChart(id, data, msg) {
            const container = document.getElementById(id);
            if (data.length > 0) {
                container.innerHTML = `<div class="chart-container">${data.map(item => 
                    `<div class="chart-item">
                        <span class="chart-label">${Object.values(item)[0]}</span>
                        <span class="chart-value">${Object.values(item)[1]}</span>
                    </div>`
                ).join('')}</div>`;
            } else {
                container.innerHTML = `<p class="text-muted text-center">${msg}</p>`;
            }
        }

        async function loadDashboard() {
            try {
                const response = await fetch('dashboard-api.php');
                const data = await response.json();

                if (data.success) {
                    document.getElementById('total-cadastros').textContent = data.metrics.total_cadastros;
                    document.getElementById('taxa-lgpd').textContent = data.metrics.taxa_lgpd + '%';
                    document.getElementById('taxa-cookies').textContent = data.metrics.taxa_cookies + '%';
                    document.getElementById('timestamp').textContent = data.ultima_atualizacao;

                    const tbody = document.querySelector('#leads-recentes-table tbody');
                    if (data.metrics.leads_recentes.length > 0) {
                        tbody.innerHTML = data.metrics.leads_recentes.map(lead => `
                            <tr>
                                <td>${lead.nome}</td>
                                <td>${lead.email}</td>
                                <td>${lead.telefone}</td>
                                <td>${lead.idade}</td>
                                <td>${new Date(lead.data_cadastro).toLocaleDateString('pt-BR')}</td>
                            </tr>
                        `).join('');
                    } else {
                        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum lead</td></tr>';
                    }

                    updateChart('faixa-etaria-chart', data.metrics.faixa_etaria, 'Sem dados');
                    updateChart('cadastros-7-dias-chart', data.metrics.cadastros_7_dias, 'Sem dados');
                    updateChart('cookies-chart', data.metrics.distribuicao_cookies, 'Nenhuma escolha de cookies registrada');
                }
            } catch (error) {
                document.getElementById('timestamp').textContent = 'Erro de conexão';
            }
        }

        loadDashboard();
        setInterval(loadDashboard, 30000);
    </script>
</body>
</html>