<?php
/**
 * API Dashboard - Retorna apenas dados JSON
 * @author Pedro Solozabal
 * @version 1.0.0
 */

// Configurações de segurança
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');

// Incluir conexão
require_once 'conect.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();

    /** @var array $metrics Array de métricas do dashboard */
    $metrics = [];

    // Total e taxas
    $total_result = $pdo->query("SELECT COUNT(*) as total FROM leads");
    $total = $total_result ? $total_result->fetch()['total'] : 0;
    
    $lgpd_result = $pdo->query("SELECT COUNT(*) as aceitos FROM leads WHERE lgpd_consent = 'true'");
    $lgpd = $lgpd_result ? $lgpd_result->fetch()['aceitos'] : 0;
    
    // Para cookies, contar apenas quem explicitamente aceitou (valor = 1)
    $cookies_aceitos_result = $pdo->query("SELECT COUNT(*) as cookies FROM leads WHERE cookies_accepted = 1");
    $cookies_aceitos = $cookies_aceitos_result ? $cookies_aceitos_result->fetch()['cookies'] : 0;
    
    // Contar quantos fizeram alguma escolha sobre cookies (1 ou 0, não null)
    $cookies_escolha_result = $pdo->query("SELECT COUNT(*) as escolheram FROM leads WHERE cookies_accepted IS NOT NULL");
    $cookies_escolheram = $cookies_escolha_result ? $cookies_escolha_result->fetch()['escolheram'] : 0;
    
    $metrics['total_cadastros'] = (int)$total;
    $metrics['taxa_lgpd'] = $total > 0 ? round(($lgpd / $total) * 100, 2) : 0;
    
    // Taxa de cookies: dos que fizeram escolha, quantos % aceitaram
    if ($cookies_escolheram > 0) {
        $metrics['taxa_cookies'] = round(($cookies_aceitos / $cookies_escolheram) * 100, 2);
        $metrics['cookies_info'] = "De {$cookies_escolheram} que escolheram, {$cookies_aceitos} aceitaram";
    } else {
        $metrics['taxa_cookies'] = 0;
        $metrics['cookies_info'] = "Nenhum usuário fez escolha sobre cookies ainda";
    }

    // Consultas de dados
    $queries = [
        'faixa_etaria' => "SELECT 
            CASE 
                WHEN idade BETWEEN 60 AND 70 THEN '60-70 anos' 
                WHEN idade BETWEEN 71 AND 80 THEN '71-80 anos' 
                WHEN idade BETWEEN 81 AND 90 THEN '81-90 anos' 
                WHEN idade BETWEEN 91 AND 100 THEN '91-100 anos'
                WHEN idade > 100 THEN 'Acima de 100 anos'
                ELSE 'Fora da faixa etária'
            END as faixa_etaria, 
            COUNT(*) as quantidade 
            FROM leads 
            WHERE idade IS NOT NULL AND idade >= 60
            GROUP BY faixa_etaria 
            ORDER BY 
                CASE 
                    WHEN idade BETWEEN 60 AND 70 THEN 1
                    WHEN idade BETWEEN 71 AND 80 THEN 2
                    WHEN idade BETWEEN 81 AND 90 THEN 3
                    WHEN idade BETWEEN 91 AND 100 THEN 4
                    WHEN idade > 100 THEN 5
                    ELSE 6
                END",
        'cadastros_7_dias' => "SELECT DATE(data_cadastro) as data, COUNT(*) as cadastros 
            FROM leads 
            WHERE data_cadastro >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
            GROUP BY DATE(data_cadastro) 
            ORDER BY data DESC",
        'leads_recentes' => "SELECT nome, email, telefone, idade, data_cadastro 
            FROM leads 
            ORDER BY data_cadastro DESC 
            LIMIT 10",
        'distribuicao_cookies' => "SELECT 
            CASE 
                WHEN cookies_accepted = 1 THEN 'Aceitaram cookies'
                WHEN cookies_accepted = 0 THEN 'Recusaram cookies' 
                WHEN cookies_accepted IS NULL THEN 'Não fizeram escolha'
                ELSE 'Outros'
            END as status_cookies,
            COUNT(*) as quantidade
            FROM leads 
            GROUP BY status_cookies
            ORDER BY quantidade DESC"
    ];

    foreach($queries as $key => $query) {
        try {
            $result = $pdo->query($query);
            $metrics[$key] = $result ? $result->fetchAll(PDO::FETCH_ASSOC) : [];
        } catch (PDOException $e) {
            error_log("Erro na consulta $key: " . $e->getMessage());
            $metrics[$key] = [];
        }
    }

    // Resposta de sucesso
    $response = [
        'success' => true,
        'metrics' => $metrics,
        'ultima_atualizacao' => date('d/m/Y H:i:s')
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    $response = [
        'success' => false,
        'message' => 'Erro: ' . $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    error_log("Dashboard API error: " . $e->getMessage());
}
?>