import express from 'express';
import promClient from 'prom-client';

// Criar registry para as métricas
const register = new promClient.Registry();

// Adicionar métricas padrão do Node.js
promClient.collectDefaultMetrics({
  register,
  prefix: 'nodejs_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

// ========== MÉTRICAS CUSTOMIZADAS ==========

// Contador de requisições HTTP
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status', 'service'],
  registers: [register],
});

// Histograma de duração das requisições
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status', 'service'],
  buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

// Contador de erros
const errorCount = new promClient.Counter({
  name: 'app_errors_total',
  help: 'Total de erros na aplicação',
  labelNames: ['type', 'service'],
  registers: [register],
});

// Gauge para conexões ativas do banco
const dbConnectionsActive = new promClient.Gauge({
  name: 'db_connections_active',
  help: 'Número de conexões ativas no banco de dados',
  labelNames: ['database', 'service'],
  registers: [register],
});

// Contador de operações no banco de dados
const dbOperationsTotal = new promClient.Counter({
  name: 'db_operations_total',
  help: 'Total de operações no banco de dados',
  labelNames: ['operation', 'table', 'status', 'service'],
  registers: [register],
});

// Histograma de duração das queries no banco
const dbQueryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duração das queries no banco de dados',
  labelNames: ['operation', 'table', 'service'],
  buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Contador de mensagens Kafka
const kafkaMessagesTotal = new promClient.Counter({
  name: 'kafka_messages_total',
  help: 'Total de mensagens enviadas/recebidas no Kafka',
  labelNames: ['topic', 'type', 'status', 'service'],
  registers: [register],
});

// Histograma de latência do Kafka
const kafkaLatency = new promClient.Histogram({
  name: 'kafka_latency_seconds',
  help: 'Latência de envio/recebimento de mensagens Kafka',
  labelNames: ['topic', 'type', 'service'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Gauge para reservas ativas (específico do domínio)
const activeReservations = new promClient.Gauge({
  name: 'active_reservations_total',
  help: 'Número total de reservas ativas',
  labelNames: ['service'],
  registers: [register],
});

// Gauge para veículos disponíveis
const availableVehicles = new promClient.Gauge({
  name: 'available_vehicles_total',
  help: 'Número total de veículos disponíveis',
  labelNames: ['service'],
  registers: [register],
});

// ========== MIDDLEWARE EXPRESS ==========

/**
 * Middleware para coletar métricas de requisições HTTP
 */
export const metricsMiddleware = (serviceName) => {
  return (req, res, next) => {
    const start = Date.now();
    
    // Capturar o fim da resposta
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route?.path || req.path || 'unknown';
      
      // Incrementar contador de requisições
      httpRequestsTotal.inc({
        method: req.method,
        route,
        status: res.statusCode,
        service: serviceName,
      });
      
      // Registrar duração da requisição
      httpRequestDuration.observe(
        {
          method: req.method,
          route,
          status: res.statusCode,
          service: serviceName,
        },
        duration
      );
    });
    
    next();
  };
};

/**
 * Endpoint para expor métricas
 */
export const metricsEndpoint = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Função para registrar erro
 */
export const recordError = (errorType, serviceName) => {
  errorCount.inc({
    type: errorType,
    service: serviceName,
  });
};

/**
 * Função para registrar operação no banco de dados
 */
export const recordDbOperation = (operation, table, status, serviceName, duration) => {
  dbOperationsTotal.inc({
    operation,
    table,
    status,
    service: serviceName,
  });
  
  if (duration) {
    dbQueryDuration.observe(
      {
        operation,
        table,
        service: serviceName,
      },
      duration
    );
  }
};

/**
 * Função para atualizar conexões ativas do banco
 */
export const updateDbConnections = (count, database, serviceName) => {
  dbConnectionsActive.set(
    {
      database,
      service: serviceName,
    },
    count
  );
};

/**
 * Função para registrar mensagem Kafka
 */
export const recordKafkaMessage = (topic, type, status, serviceName, latency) => {
  kafkaMessagesTotal.inc({
    topic,
    type, // 'produce' ou 'consume'
    status, // 'success' ou 'error'
    service: serviceName,
  });
  
  if (latency) {
    kafkaLatency.observe(
      {
        topic,
        type,
        service: serviceName,
      },
      latency
    );
  }
};

/**
 * Função para atualizar número de reservas ativas
 */
export const updateActiveReservations = (count, serviceName) => {
  activeReservations.set({ service: serviceName }, count);
};

/**
 * Função para atualizar número de veículos disponíveis
 */
export const updateAvailableVehicles = (count, serviceName) => {
  availableVehicles.set({ service: serviceName }, count);
};

/**
 * Configura servidor de métricas separado
 */
export const startMetricsServer = (port, serviceName) => {
  const metricsApp = express();
  
  metricsApp.get('/metrics', metricsEndpoint);
  
  metricsApp.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: serviceName });
  });
  
  metricsApp.listen(port, () => {
    console.log(`📊 Servidor de métricas rodando na porta ${port}`);
  });
};

// Exportar o registry para uso avançado
export { register };
