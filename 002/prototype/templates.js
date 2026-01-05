/**
 * YAML Templates for Kubernetes Resources
 * These functions generate YAML strings for different resource types
 */

/**
 * Generate Deployment YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {string} config.image - Container image
 * @param {number} config.containerPort - Container port
 * @returns {string} YAML string
 */
function generateDeploymentYAML(config) {
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
spec:
  replicas: 0
  selector:
    matchLabels:
      app: ${config.name}
  template:
    metadata:
      labels:
        app: ${config.name}
    spec:
      containers:
        - name: function
          image: ${config.image}
          ports:
            - containerPort: ${config.containerPort}`;
}

/**
 * Generate Service YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {number} config.containerPort - Container port
 * @returns {string} YAML string
 */
function generateServiceYAML(config) {
    return `apiVersion: v1
kind: Service
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
spec:
  selector:
    app: ${config.name}
  ports:
    - port: 80
      targetPort: ${config.containerPort}`;
}

/**
 * Generate HTTPScaledObject YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {string} config.scalingMetric - Metric type: 'concurrency' or 'requestRate'
 * @param {Object} config.metricConfig - Metric-specific configuration
 * @returns {string} YAML string
 */
function generateHTTPScaledObjectYAML(config) {
    let scalingMetricYAML = '';

    if (config.scalingMetric === 'concurrency') {
        scalingMetricYAML = `  scalingMetric:
    concurrency:
      targetValue: ${config.metricConfig.targetValue}`;
    } else if (config.scalingMetric === 'requestRate') {
        scalingMetricYAML = `  scalingMetric:
    requestRate:
      targetValue: ${config.metricConfig.targetValue}
      window: ${config.metricConfig.window}
      granularity: ${config.metricConfig.granularity}`;
    }

    return `apiVersion: http.keda.sh/v1alpha1
kind: HTTPScaledObject
metadata:
  name: ${config.name}-http
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
spec:
  scaleTargetRef:
    name: ${config.name}
    kind: Deployment
    apiVersion: apps/v1
    service: ${config.name}
    port: 80
${scalingMetricYAML}`;
}

/**
 * Generate ScaledObject YAML with KEDA triggers
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {Object} config.metricConfig - ScaledObject configuration
 * @returns {string} YAML string
 */
function generateScaledObjectYAML(config) {
    const mc = config.metricConfig;
    let triggerYAML = '';

    if (mc.triggerType === 'cpu') {
        triggerYAML = `  triggers:
    - type: cpu
      metricType: Utilization
      metadata:
        value: "${mc.triggerConfig.utilization}"`;
    } else if (mc.triggerType === 'memory') {
        triggerYAML = `  triggers:
    - type: memory
      metricType: Utilization
      metadata:
        value: "${mc.triggerConfig.utilization}"`;
    } else if (mc.triggerType === 'prometheus') {
        triggerYAML = `  triggers:
    - type: prometheus
      metadata:
        serverAddress: ${mc.triggerConfig.serverAddress}
        query: ${mc.triggerConfig.query}
        threshold: "${mc.triggerConfig.threshold}"`;
    } else if (mc.triggerType === 'kafka') {
        triggerYAML = `  triggers:
    - type: kafka
      metadata:
        bootstrapServers: ${mc.triggerConfig.bootstrapServers}
        consumerGroup: ${mc.triggerConfig.consumerGroup}
        topic: ${mc.triggerConfig.topic}
        lagThreshold: "${mc.triggerConfig.lagThreshold}"`;
    } else if (mc.triggerType === 'rabbitmq') {
        triggerYAML = `  triggers:
    - type: rabbitmq
      metadata:
        host: ${mc.triggerConfig.host}
        queueName: ${mc.triggerConfig.queueName}
        queueLength: "${mc.triggerConfig.queueLength}"`;
    } else if (mc.triggerType === 'redis') {
        triggerYAML = `  triggers:
    - type: redis
      metadata:
        address: ${mc.triggerConfig.address}
        listName: ${mc.triggerConfig.listName}
        listLength: "${mc.triggerConfig.listLength}"`;
    } else if (mc.triggerType === 'cron') {
        triggerYAML = `  triggers:
    - type: cron
      metadata:
        timezone: ${mc.triggerConfig.timezone}
        start: ${mc.triggerConfig.start}
        end: ${mc.triggerConfig.end}
        desiredReplicas: "${mc.triggerConfig.desiredReplicas}"`;
    } else if (mc.triggerType === 'custom') {
        // Use custom YAML directly, indenting each line properly
        const metadataLines = mc.customMetadataYAML
            .split('\n')
            .map(line => `        ${line}`)
            .join('\n');

        triggerYAML = `  triggers:
    - type: ${mc.customTriggerType}
      metadata:
${metadataLines}`;
    }

    return `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: ${config.name}-scaledobject
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${config.name}
  minReplicaCount: ${mc.minReplicaCount}
  maxReplicaCount: ${mc.maxReplicaCount}
  pollingInterval: 30
  cooldownPeriod: 300
${triggerYAML}`;
}

/**
 * Resource metadata for UI display
 */
const RESOURCE_METADATA = {
    deployment: {
        kind: 'Deployment',
        apiVersion: 'apps/v1',
        description: 'Manages the runtime workload for the function. Starts with 0 replicas (scale to zero) and will be scaled by KEDA based on HTTP traffic.'
    },
    service: {
        kind: 'Service',
        apiVersion: 'v1',
        description: 'Provides a stable network endpoint for the function. Acts as the target for event delivery and HTTP routing.'
    },
    httpScaledObject: {
        kind: 'HTTPScaledObject',
        apiVersion: 'http.keda.sh/v1alpha1',
        description: 'Configures KEDA HTTP Add-on for scaling. Monitors HTTP traffic (concurrency or request rate) and scales the Deployment based on the chosen metric.'
    },
    scaledObject: {
        kind: 'ScaledObject',
        apiVersion: 'keda.sh/v1alpha1',
        description: 'Configures KEDA ScaledObject with custom triggers. Scales the Deployment based on metrics like CPU, memory, Prometheus, or cron schedules.'
    }
};
