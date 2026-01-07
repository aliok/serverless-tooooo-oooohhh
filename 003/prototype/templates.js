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
        // Simple array of event types (no broker grouping)
        const subscriptionEntries = eventSubscriptions
            .map(sub => `      - eventType: ${sub.eventType}`)
            .join('\n');

        subscriptionsYAML = `    subscriptions:\n${subscriptionEntries}`;
    } else {
        subscriptionsYAML = `    subscriptions: []`;
    }

    return `apiVersion: serverless.openshift.io/v1alpha1
kind: Function
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  eventing:
${subscriptionsYAML}`;
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
 * Generate Event Source YAML (unified function for all types)
 * @param {Object} config - Configuration object
 * @param {string} config.name - Event source name
 * @param {string} config.namespace - Namespace
 * @param {string} config.type - Event source type (github, kafka, slack, cron)
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
  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: default  # ← Platform-managed default broker
status:
  # CloudEvent type produced by this source
  observedEventTypes:
    - dev.knative.sources.github.event
  sinkUri: http://default-broker.${config.namespace}.svc.cluster.local`;
}

/**
 * Generate Kafka Source YAML
 */
function generateKafkaSourceYAML(config) {
    const topics = config.config.topics || [];

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
  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: default  # ← Platform-managed default broker
status:
  # CloudEvent type produced by this source
  observedEventTypes:
    - dev.knative.kafka.event
  sinkUri: http://default-broker.${config.namespace}.svc.cluster.local`;
}

/**
 * Generate Slack Source YAML
 */
function generateSlackSourceYAML(config) {
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
  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: default  # ← Platform-managed default broker
status:
  # CloudEvent type produced by this source
  observedEventTypes:
    - dev.knative.sources.slack.event
  sinkUri: http://default-broker.${config.namespace}.svc.cluster.local`;
}

/**
 * Generate Cron Source YAML
 */
function generateCronSourceYAML(config) {
    let dataYAML = '';
    if (config.config.data) {
        dataYAML = `  data: '${config.config.data}'`;
    }

    return `apiVersion: sources.knative.dev/v1
kind: PingSource
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  schedule: "${config.config.schedule}"
${dataYAML}
  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: default  # ← Platform-managed default broker
status:
  # CloudEvent type produced by this source
  observedEventTypes:
    - dev.knative.sources.ping
  sinkUri: http://default-broker.${config.namespace}.svc.cluster.local`;
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
    }
};
