/**
 * YAML Templates for Kubernetes Resources
 * These functions generate YAML strings for different resource types
 */

/**
 * Generate Function CR YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {Array} config.eventSubscriptions - Array of event subscriptions
 * @returns {string} YAML string
 */
function generateFunctionYAML(config) {
    const eventSubscriptions = config.eventSubscriptions || [];

    let subscriptionsYAML = '';
    if (eventSubscriptions.length > 0) {
        // Group subscriptions by broker and aggregate event types
        const brokerMap = {};
        eventSubscriptions.forEach(sub => {
            if (!brokerMap[sub.broker]) {
                brokerMap[sub.broker] = [];
            }
            brokerMap[sub.broker].push(sub.eventType);
        });

        // Generate YAML for each broker
        const subscriptionEntries = Object.entries(brokerMap).map(([broker, eventTypes]) => {
            const eventTypesYAML = eventTypes.map(type => `        - ${type}`).join('\n');
            return `      - broker: ${broker}\n        eventTypes:\n${eventTypesYAML}`;
        }).join('\n');

        subscriptionsYAML = `    subscriptions:\n${subscriptionEntries}`;
    } else {
        subscriptionsYAML = `    subscriptions: []`;
    }

    // Add sink configuration
    let sinkYAML = '';
    if (config.sinkMethod === 'broker' && config.sinkConfig && config.sinkConfig.broker) {
        sinkYAML = `\n    sink:\n      ref:\n        apiVersion: eventing.knative.dev/v1\n        kind: Broker\n        name: ${config.sinkConfig.broker}`;
    } else if (config.sinkMethod === 'sink' && config.sinkConfig && config.sinkConfig.sinkName) {
        const sinkKind = getSinkKind(config.sinkConfig.sinkType);
        sinkYAML = `\n    sink:\n      ref:\n        apiVersion: sinks.knative.dev/v1alpha1\n        kind: ${sinkKind}\n        name: ${config.sinkConfig.sinkName}`;
    } else if (config.sinkMethod === 'function' && config.sinkConfig && config.sinkConfig.functionName) {
        sinkYAML = `\n    sink:\n      ref:\n        apiVersion: v1\n        kind: Service\n        name: ${config.sinkConfig.functionName}`;
    }

    // Add status with reply event types (populated by controller/broker)
    let statusYAML = '';
    if (config.replyEventTypes && config.replyEventTypes.length > 0) {
        const replyTypesYAML = config.replyEventTypes.map(type => `    - ${type}`).join('\n');
        statusYAML = `\nstatus:\n  # Discovered by Broker controller watching actual CloudEvents produced\n  replyEventTypes:\n${replyTypesYAML}`;
    }

    return `apiVersion: serverless.openshift.io/v1alpha1
kind: Function
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  eventing:
${subscriptionsYAML}${sinkYAML}${statusYAML}`;
}

/**
 * Generate Shipwright Build YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {string} config.image - Output container image
 * @param {Object} config.buildConfig - Build configuration
 * @returns {string} YAML string
 */
function generateShipwrightBuildYAML(config) {
    const buildConfig = config.buildConfig || {};
    return `apiVersion: shipwright.io/v1beta1
kind: Build
metadata:
  name: ${config.name}-build
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: ${config.name}
      uid: <generated-by-apiserver>
      controller: false
      blockOwnerDeletion: true
spec:
  source:
    git:
      url: ${buildConfig.gitURL}
      revision: ${buildConfig.gitRevision || 'main'}
  strategy:
    name: ${buildConfig.strategy}
  output:
    image: ${buildConfig.outputImage || config.image}`;
}

/**
 * Generate OpenShift S2I BuildConfig YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {Object} config.buildConfig - Build configuration
 * @returns {string} YAML string
 */
function generateS2IBuildConfigYAML(config) {
    const buildConfig = config.buildConfig || {};
    const outputImageStreamTag = buildConfig.outputImageStream || `${config.name}:latest`;

    return `apiVersion: build.openshift.io/v1
kind: BuildConfig
metadata:
  name: ${config.name}-build
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: ${config.name}
      uid: <generated-by-apiserver>
      controller: false
      blockOwnerDeletion: true
spec:
  runPolicy: Serial
  source:
    git:
      uri: ${buildConfig.gitURL}
      ref: ${buildConfig.gitRevision || 'main'}
  strategy:
    sourceStrategy:
      from:
        kind: ImageStreamTag
        name: ${buildConfig.builderImage}
  output:
    to:
      kind: ImageStreamTag
      name: ${outputImageStreamTag}
  triggers:
    - type: ConfigChange
    - type: ImageChange`;
}

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
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: ${config.name}
      uid: <generated-by-apiserver>
      controller: false
      blockOwnerDeletion: true
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
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: ${config.name}
      uid: <generated-by-apiserver>
      controller: false
      blockOwnerDeletion: true
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
 * @param {Object} config.networkingConfig - Networking configuration
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

    // Include hosts if networking is configured with a hostname
    let hostsYAML = '';
    if (config.networkingConfig && config.networkingConfig.hostname) {
        hostsYAML = `  hosts:
    - ${config.networkingConfig.hostname}`;
    }

    // Include pathPrefixes if networking is configured with a path other than /
    let pathPrefixesYAML = '';
    if (config.networkingConfig && config.networkingConfig.path && config.networkingConfig.path !== '/') {
        pathPrefixesYAML = `  pathPrefixes:
    - ${config.networkingConfig.path}`;
    }

    return `apiVersion: http.keda.sh/v1alpha1
kind: HTTPScaledObject
metadata:
  name: ${config.name}-http
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: ${config.name}
      uid: <generated-by-apiserver>
      controller: false
      blockOwnerDeletion: true
spec:
${hostsYAML}
${pathPrefixesYAML}
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
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: ${config.name}
      uid: <generated-by-apiserver>
      controller: false
      blockOwnerDeletion: true
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
 * Generate Gateway API HTTPRoute YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {Object} config.networkingConfig - Networking configuration
 * @returns {string} YAML string
 */
function generateHTTPRouteYAML(config) {
    const nc = config.networkingConfig;
    let hostnamesYAML = '';

    if (nc.hostname) {
        hostnamesYAML = `  hostnames:
    - ${nc.hostname}`;
    }

    return `apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: ${config.name}
      uid: <generated-by-apiserver>
      controller: false
      blockOwnerDeletion: true
spec:
  parentRefs:
    - name: ${nc.gatewayName}
${hostnamesYAML}
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: ${nc.path}
      backendRefs:
        - name: ${config.name}
          port: 80`;
}

/**
 * Generate Ingress YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {Object} config.networkingConfig - Networking configuration
 * @returns {string} YAML string
 */
function generateIngressYAML(config) {
    const nc = config.networkingConfig;
    let ingressClassYAML = '';
    let tlsYAML = '';

    if (nc.ingressClass) {
        ingressClassYAML = `  ingressClassName: ${nc.ingressClass}`;
    }

    if (nc.tlsEnabled && nc.tlsSecretName) {
        tlsYAML = `  tls:
    - hosts:
        - ${nc.hostname}
      secretName: ${nc.tlsSecretName}`;
    }

    return `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: ${config.name}
      uid: <generated-by-apiserver>
      controller: false
      blockOwnerDeletion: true
spec:
${ingressClassYAML}
${tlsYAML}
  rules:
    - host: ${nc.hostname}
      http:
        paths:
          - path: ${nc.path}
            pathType: Prefix
            backend:
              service:
                name: ${config.name}
                port:
                  number: 80`;
}

/**
 * Generate OpenShift Route YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Function name
 * @param {string} config.namespace - Namespace
 * @param {Object} config.networkingConfig - Networking configuration
 * @returns {string} YAML string
 */
function generateRouteYAML(config) {
    const nc = config.networkingConfig;
    let hostYAML = '';
    let tlsYAML = '';

    if (nc.hostname) {
        hostYAML = `  host: ${nc.hostname}`;
    }

    if (nc.tlsTermination && nc.tlsTermination !== 'none') {
        tlsYAML = `  tls:
    termination: ${nc.tlsTermination}
    insecureEdgeTerminationPolicy: Redirect`;
    }

    return `apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
  labels:
    serverless.openshift.io/function: ${config.name}
  ownerReferences:
    - apiVersion: serverless.openshift.io/v1alpha1
      kind: Function
      name: ${config.name}
      uid: <generated-by-apiserver>
      controller: false
      blockOwnerDeletion: true
spec:
${hostYAML}
  path: ${nc.path}
  to:
    kind: Service
    name: ${config.name}
    weight: 100
  port:
    targetPort: 80
${tlsYAML}`;
}

/**
 * Generate Broker YAML
 * @param {Object} config - Configuration object
 * @param {string} config.name - Broker name
 * @param {string} config.namespace - Namespace
 * @param {Object} config.deliveryConfig - Delivery configuration
 * @returns {string} YAML string
 */
function generateBrokerYAML(config) {
    const dc = config.deliveryConfig || {};
    let deliveryYAML = '';

    if (dc.retry || dc.backoffPolicy || dc.backoffDelay) {
        const retryLine = dc.retry ? `    retry: ${dc.retry}` : '';
        const backoffPolicyLine = dc.backoffPolicy ? `    backoffPolicy: ${dc.backoffPolicy}` : '';
        const backoffDelayLine = dc.backoffDelay ? `    backoffDelay: ${dc.backoffDelay}` : '';

        const lines = [retryLine, backoffPolicyLine, backoffDelayLine].filter(line => line).join('\n');

        deliveryYAML = `  delivery:
${lines}`;
    }

    // Get all event types from event sources that send to this broker
    const eventSources = getEventSources().filter(es => es.broker === config.name);
    const allEventTypes = eventSources.flatMap(es => es.eventTypes);
    const uniqueEventTypes = [...new Set(allEventTypes)];

    let statusYAML = '';
    if (uniqueEventTypes.length > 0) {
        statusYAML = `status:
  # Event types being routed through this broker
  observedEventTypes:
    - ${uniqueEventTypes.join('\n    - ')}`;
    } else {
        statusYAML = `status:
  # No event sources connected yet
  observedEventTypes: []`;
    }

    return `apiVersion: eventing.knative.dev/v1
kind: Broker
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
${deliveryYAML}
${statusYAML}`;
}

/**
 * Generate sink reference YAML for event sources
 * @param {Object} config - Configuration object with sinkMethod and sinkConfig
 * @returns {string} YAML string for sink reference
 */
function generateEventSourceSinkYAML(config) {
    const sinkMethod = config.sinkMethod || 'broker';
    const sinkConfig = config.sinkConfig || {};

    if (sinkMethod === 'broker') {
        const broker = sinkConfig.broker || config.broker || '';
        return `  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: ${broker}`;
    } else if (sinkMethod === 'sink') {
        const sinkKind = getSinkKind(sinkConfig.sinkType);
        return `  sink:
    ref:
      apiVersion: sinks.knative.dev/v1alpha1
      kind: ${sinkKind}
      name: ${sinkConfig.sinkName}`;
    } else if (sinkMethod === 'function') {
        return `  sink:
    ref:
      apiVersion: v1
      kind: Service
      name: ${sinkConfig.functionName}`;
    }
    return '';
}

/**
 * Generate Event Source YAML (unified function for all types)
 * @param {Object} config - Configuration object
 * @param {string} config.name - Event source name
 * @param {string} config.namespace - Namespace
 * @param {string} config.type - Event source type (github, kafka, slack, cron)
 * @param {string} config.sinkMethod - Target method (broker, sink, function)
 * @param {Object} config.sinkConfig - Target configuration
 * @param {Object} config.config - Type-specific configuration
 * @param {Array} config.eventTypes - Event types
 * @returns {string} YAML string
 */
function generateEventSourceYAML(config) {
    if (config.type === 'github') {
        return generateGitHubSourceYAML(config);
    } else if (config.type === 'kafka') {
        return generateKafkaSourceYAML(config);
    } else if (config.type === 'slack') {
        return generateSlackSourceYAML(config);
    } else if (config.type === 'cron') {
        return generateCronSourceYAML(config);
    }
    return '# Unknown event source type';
}

/**
 * Generate GitHub Source YAML
 */
function generateGitHubSourceYAML(config) {
    const sinkYAML = generateEventSourceSinkYAML(config);

    return `apiVersion: sources.knative.dev/v1
kind: GitHubSource
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  owner: ${config.config.repository.split('/')[0]}
  repository: ${config.config.repository.split('/')[1]}
  accessToken:
    secretKeyRef:
      name: ${config.config.accessTokenSecret}
      key: accessToken
${sinkYAML}
status:
  # CloudEvent type produced by this source
  observedEventTypes:
    - dev.knative.sources.github.event`;
}

/**
 * Generate Kafka Source YAML
 */
function generateKafkaSourceYAML(config) {
    const topics = config.config.topics || [];
    const sinkYAML = generateEventSourceSinkYAML(config);

    return `apiVersion: sources.knative.dev/v1beta1
kind: KafkaSource
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  consumerGroup: ${config.config.consumerGroup}
  bootstrapServers:
    - ${config.config.bootstrapServers}
  topics:
    - ${topics.join('\n    - ')}
${sinkYAML}
status:
  # CloudEvent type produced by this source
  observedEventTypes:
    - dev.knative.kafka.event`;
}

/**
 * Generate Slack Source YAML
 */
function generateSlackSourceYAML(config) {
    const sinkYAML = generateEventSourceSinkYAML(config);

    return `apiVersion: sources.knative.dev/v1alpha1
kind: SlackSource
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  signingSecret:
    secretKeyRef:
      name: ${config.config.webhookURLSecret}
      key: signingSecret
  token:
    secretKeyRef:
      name: ${config.config.webhookURLSecret}
      key: token
${sinkYAML}
status:
  # CloudEvent type produced by this source
  observedEventTypes:
    - dev.knative.sources.slack.event`;
}

/**
 * Generate Cron Source YAML
 */
function generateCronSourceYAML(config) {
    let dataYAML = '';
    if (config.config.data) {
        dataYAML = `  data: '${config.config.data}'`;
    }

    const sinkYAML = generateEventSourceSinkYAML(config);

    return `apiVersion: sources.knative.dev/v1
kind: PingSource
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  schedule: "${config.config.schedule}"
${dataYAML}
${sinkYAML}
status:
  # CloudEvent type produced by this source
  observedEventTypes:
    - dev.knative.sources.ping`;
}

/**
 * Generate Event Sink YAML (unified function for all types)
 * @param {Object} config - Configuration object
 * @param {string} config.name - Event sink name
 * @param {string} config.namespace - Namespace
 * @param {string} config.type - Event sink type (http, kafka, sns, pubsub, eventgrid, database)
 * @param {string} config.mode - Mode (standalone or referenced)
 * @param {string} config.broker - Source broker name (standalone mode only)
 * @param {Array} config.eventTypes - Event types (standalone mode only)
 * @param {Object} config.config - Type-specific configuration
 * @returns {string} YAML string
 */
function generateEventSinkYAML(config) {
    if (config.type === 'http') {
        return generateHttpSinkYAML(config);
    } else if (config.type === 'kafka') {
        return generateKafkaSinkYAML(config);
    } else if (config.type === 'sns') {
        return generateSnsSinkYAML(config);
    } else if (config.type === 'pubsub') {
        return generatePubSubSinkYAML(config);
    } else if (config.type === 'eventgrid') {
        return generateEventGridSinkYAML(config);
    } else if (config.type === 'database') {
        return generateDatabaseSinkYAML(config);
    }
    return '# Unknown event sink type';
}

/**
 * Generate HTTP Sink YAML
 */
function generateHttpSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: HttpSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  url: ${config.config.url}
  headers:
    Content-Type: "application/cloudevents+json"`;
}

/**
 * Generate Kafka Sink YAML
 */
function generateKafkaSinkYAML(config) {
    return `apiVersion: eventing.knative.dev/v1alpha1
kind: KafkaSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  topic: ${config.config.topic}
  bootstrapServers:
    - ${config.config.bootstrapServers}`;
}

/**
 * Generate AWS SNS Sink YAML
 */
function generateSnsSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: AwsSnsSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  topicArn: ${config.config.topicArn}
  credentials:
    secretKeyRef:
      name: ${config.config.credentialsSecret}
      key: credentials`;
}

/**
 * Generate GCP Pub/Sub Sink YAML
 */
function generatePubSubSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: GcpPubSubSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  topic: ${config.config.topic}
  credentials:
    secretKeyRef:
      name: ${config.config.credentialsSecret}
      key: credentials`;
}

/**
 * Generate Azure Event Grid Sink YAML
 */
function generateEventGridSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: AzureEventGridSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  endpoint: ${config.config.endpoint}
  key:
    secretKeyRef:
      name: ${config.config.keySecret}
      key: key`;
}

/**
 * Generate Database Sink YAML
 */
function generateDatabaseSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: DatabaseSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  type: ${config.config.databaseType}
  connectionSecret: ${config.config.connectionSecret}
  table: ${config.config.table}`;
}

/**
 * Generate Trigger for Standalone Mode Event Sink
 * @param {Object} config - Sink configuration
 * @returns {string} YAML string
 */
function generateSinkTriggerYAML(config) {
    const eventTypeFilters = config.eventTypes
        .map(type => `    - exact:\n        type: ${type}`)
        .join('\n');

    return `apiVersion: eventing.knative.dev/v1
kind: Trigger
metadata:
  name: ${config.name}-trigger
  namespace: ${config.namespace}
spec:
  broker: ${config.broker}
  filter:
    attributes:
${eventTypeFilters}
  subscriber:
    ref:
      apiVersion: sinks.knative.dev/v1alpha1
      kind: ${getSinkKind(config.type)}
      name: ${config.name}`;
}

/**
 * Get Kubernetes Kind for sink type
 * @param {string} type - Sink type
 * @returns {string} Kubernetes Kind
 */
function getSinkKind(type) {
    const kindMap = {
        'http': 'HttpSink',
        'kafka': 'KafkaSink',
        'sns': 'AwsSnsSink',
        'pubsub': 'GcpPubSubSink',
        'eventgrid': 'AzureEventGridSink',
        'database': 'DatabaseSink'
    };
    return kindMap[type] || 'HttpSink';
}

/**
 * Resource metadata for UI display
 */
const RESOURCE_METADATA = {
    broker: {
        kind: 'Broker',
        apiVersion: 'eventing.knative.dev/v1',
        description: 'Routes CloudEvents from Event Sources to Functions. Provides delivery guarantees including retry policies and backoff configuration for reliable event delivery.'
    },
    githubSource: {
        kind: 'GitHubSource',
        apiVersion: 'sources.knative.dev/v1',
        description: 'Produces CloudEvents from GitHub webhooks. Connects to a GitHub repository and forwards all webhook events to the Broker as CloudEvents with type dev.knative.sources.github.event.'
    },
    kafkaSource: {
        kind: 'KafkaSource',
        apiVersion: 'sources.knative.dev/v1beta1',
        description: 'Produces CloudEvents from Kafka topics. Consumes messages from Kafka and converts them to CloudEvents with type dev.knative.kafka.event for routing through the Broker.'
    },
    slackSource: {
        kind: 'SlackSource',
        apiVersion: 'sources.knative.dev/v1alpha1',
        description: 'Produces CloudEvents from Slack webhooks. Receives Slack events and forwards them to the Broker as CloudEvents with type dev.knative.sources.slack.event.'
    },
    cronSource: {
        kind: 'PingSource',
        apiVersion: 'sources.knative.dev/v1',
        description: 'Produces CloudEvents on a cron schedule. Sends periodic events to the Broker as CloudEvents with type dev.knative.sources.ping, useful for scheduled tasks.'
    },
    function: {
        kind: 'Function',
        apiVersion: 'serverless.openshift.io/v1alpha1',
        description: 'The semantic anchor for the function. Declares event subscriptions - the Function controller will create Knative Triggers to route CloudEvents. This is the only resource users directly interact with in the conceptual model. All other resources are owned by this Function CR.'
    },
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
    },
    httpRoute: {
        kind: 'HTTPRoute',
        apiVersion: 'gateway.networking.k8s.io/v1',
        description: 'Exposes the function via Gateway API. Provides advanced HTTP routing capabilities including hostname-based routing, path matching, and traffic splitting.'
    },
    ingress: {
        kind: 'Ingress',
        apiVersion: 'networking.k8s.io/v1',
        description: 'Exposes the function via Kubernetes Ingress. Works with any Ingress controller (nginx, Traefik, etc.) to provide external HTTP/HTTPS access.'
    },
    route: {
        kind: 'Route',
        apiVersion: 'route.openshift.io/v1',
        description: 'Exposes the function via OpenShift Route. Provides automatic hostname generation, built-in TLS termination, and seamless integration with OpenShift routing.'
    },
    shipwrightBuild: {
        kind: 'Build',
        apiVersion: 'shipwright.io/v1beta1',
        description: 'Builds the function container image from source code using Shipwright. Takes source from Git repository and produces the container image specified in the function configuration.'
    },
    s2iBuildConfig: {
        kind: 'BuildConfig',
        apiVersion: 'build.openshift.io/v1',
        description: 'Builds the function container image using OpenShift Source-to-Image (S2I). Automatically detects the source code language and builds a runnable container image.'
    },
    httpSink: {
        kind: 'HttpSink',
        apiVersion: 'sinks.knative.dev/v1alpha1',
        description: 'Sends CloudEvents to HTTP/Webhook endpoints. Delivers events as HTTP POST requests with CloudEvents format to external webhook URLs.'
    },
    kafkaSink: {
        kind: 'KafkaSink',
        apiVersion: 'eventing.knative.dev/v1alpha1',
        description: 'Sends CloudEvents to Kafka topics. Converts CloudEvents to Kafka messages and publishes them to the specified topic.'
    },
    snsSink: {
        kind: 'AwsSnsSink',
        apiVersion: 'sinks.knative.dev/v1alpha1',
        description: 'Sends CloudEvents to AWS SNS topics. Publishes events as SNS messages to the specified Amazon SNS topic ARN.'
    },
    pubsubSink: {
        kind: 'GcpPubSubSink',
        apiVersion: 'sinks.knative.dev/v1alpha1',
        description: 'Sends CloudEvents to GCP Pub/Sub topics. Publishes events as Pub/Sub messages to the specified Google Cloud Pub/Sub topic.'
    },
    eventgridSink: {
        kind: 'AzureEventGridSink',
        apiVersion: 'sinks.knative.dev/v1alpha1',
        description: 'Sends CloudEvents to Azure Event Grid topics. Publishes events to the specified Azure Event Grid endpoint.'
    },
    databaseSink: {
        kind: 'DatabaseSink',
        apiVersion: 'sinks.knative.dev/v1alpha1',
        description: 'Sends CloudEvents to database tables. Stores events as rows in the specified database table or collection (PostgreSQL or MongoDB).'
    },
    trigger: {
        kind: 'Trigger',
        apiVersion: 'eventing.knative.dev/v1',
        description: 'Filters and routes CloudEvents from a Broker to a subscriber. Matches events by type and forwards them to the configured destination (Function or Sink).'
    }
};
