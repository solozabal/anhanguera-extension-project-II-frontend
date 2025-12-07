<?php
/**
 * Classe de conexão com banco de dados MySQL usando PDO
 * 
 * @author Pedro Solozabal
 * @version 1.0.0
 * @package PHP
 */

/**
 * Gerencia conexões PDO com MySQL
 */
class Database {
    /** @var string */
    private $host = 'localhost';
    
    /** @var string */
    private $user = 'root';
    
    /** @var string */
    private $password = '';
    
    /** @var string */
    private $database = 'projeto_extensao_2';
    
    /** @var PDO|null */
    private $conn;

    /**
     * Inicializa conexão PDO com configurações otimizadas
     * 
     * @throws Exception Se falha ao conectar
     */
    public function __construct() {
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->database};charset=utf8",
                $this->user,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            error_log("Erro de conexão: " . $e->getMessage());
            throw new Exception("Erro ao conectar com o banco de dados.");
        }
    }

    /**
     * Retorna a conexão PDO ativa
     * 
     * @return PDO
     */
    public function getConnection() {
        return $this->conn;
    }

    /**
     * Fecha a conexão com o banco
     * 
     * @return void
     */
    public function closeConnection() {
        $this->conn = null;
    }
}