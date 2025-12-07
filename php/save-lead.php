<?php
/**
 * Sistema de cadastro de leads - Viver Bem na Melhor Idade
 * Versão simplificada focada em banco de dados
 * 
 * @author Pedro Solozabal
 * @version 3.0.0 - Versão limpa sem Mautic
 */

// Configurações de segurança
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');

// Incluir conexão com banco
require_once 'conect.php';

// Criar instância da conexão
$database = new Database();
$conn = $database->getConnection();

$response = ['success' => false, 'message' => ''];

try {
    // Verificar se é POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método não permitido');
    }

    // Capturar dados do formulário
    $nome = trim($_POST['firstName'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefone = trim($_POST['phone'] ?? '');
    $idade = (int)($_POST['idade'] ?? 0);
    $lgpd_consent = $_POST['lgpd_consent'] ?? 'false';
    
    // Tratar cookies_accepted corretamente
    $cookies_accepted_raw = $_POST['cookies_accepted'] ?? 'null';
    if ($cookies_accepted_raw === 'true') {
        $cookies_accepted = 1; // tinyint para true
    } elseif ($cookies_accepted_raw === 'false') {
        $cookies_accepted = 0; // tinyint para false
    } else {
        $cookies_accepted = null; // NULL para não escolheu
    }
    
    // Debug log para rastrear valores
    error_log("DEBUG - cookies_accepted_raw: " . var_export($cookies_accepted_raw, true));
    error_log("DEBUG - cookies_accepted final: " . var_export($cookies_accepted, true));

    // Validações básicas
    if (empty($nome) || strlen($nome) < 2) {
        throw new Exception('Nome deve ter pelo menos 2 caracteres');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }

    if (empty($telefone)) {
        throw new Exception('Telefone é obrigatório');
    }

    if ($idade < 60 || $idade > 120) {
        throw new Exception('Idade deve estar entre 60 e 120 anos');
    }

    if ($lgpd_consent !== 'true') {
        throw new Exception('É necessário aceitar os termos da LGPD');
    }

    // Verificar se email já existe
    $stmt = $conn->prepare("SELECT id FROM leads WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        throw new Exception('Este email já está cadastrado em nossa plataforma');
    }

    // Inserir no banco de dados
    $stmt = $conn->prepare("
        INSERT INTO leads (nome, email, telefone, idade, lgpd_consent, cookies_accepted, data_cadastro) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    
    if (!$stmt->execute([$nome, $email, $telefone, $idade, $lgpd_consent, $cookies_accepted])) {
        throw new Exception('Erro ao salvar dados');
    }
    
    $lead_id = $conn->lastInsertId();

    // Sucesso
    $response['success'] = true;
    $response['message'] = 'Cadastro realizado com sucesso! Em breve você receberá conteúdos importantes sobre medicamentos, vacinas e cuidados com a saúde.';
    $response['lead_id'] = $lead_id;

    // Log de sucesso
    error_log("✅ Lead cadastrado com sucesso - ID: $lead_id, Email: $email");

} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
    error_log("❌ Erro no cadastro: " . $e->getMessage());
}

// Enviar resposta JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>