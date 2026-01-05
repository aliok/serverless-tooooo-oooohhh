/**
 * Application logic for Function composition UI
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('functionForm');
    const userView = document.getElementById('userView');
    const platformView = document.getElementById('platformView');
    const emptyState = document.getElementById('emptyState');
    const userMessage = document.getElementById('userMessage');
    const resourceCards = document.getElementById('resourceCards');
    const scalingMetricRadios = document.querySelectorAll('input[name="scalingMetric"]');
    const concurrencyPanel = document.getElementById('concurrencyPanel');
    const requestRatePanel = document.getElementById('requestRatePanel');
    const scaledObjectPanel = document.getElementById('scaledObjectPanel');
    const triggerTypeSelect = document.getElementById('triggerType');

    // Handle scaling metric radio button change
    scalingMetricRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            concurrencyPanel.classList.remove('active');
            requestRatePanel.classList.remove('active');
            scaledObjectPanel.classList.remove('active');

            if (this.value === 'concurrency') {
                concurrencyPanel.classList.add('active');
            } else if (this.value === 'requestRate') {
                requestRatePanel.classList.add('active');
            } else if (this.value === 'scaledObject') {
                scaledObjectPanel.classList.add('active');
            }
        });
    });

    // Handle trigger type selection for ScaledObject
    triggerTypeSelect.addEventListener('change', function() {
        const cpuFields = document.getElementById('cpuTriggerFields');
        const memoryFields = document.getElementById('memoryTriggerFields');
        const prometheusFields = document.getElementById('prometheusTriggerFields');
        const kafkaFields = document.getElementById('kafkaTriggerFields');
        const rabbitmqFields = document.getElementById('rabbitmqTriggerFields');
        const redisFields = document.getElementById('redisTriggerFields');
        const cronFields = document.getElementById('cronTriggerFields');
        const customFields = document.getElementById('customTriggerFields');

        // Hide all trigger fields
        cpuFields.style.display = 'none';
        memoryFields.style.display = 'none';
        prometheusFields.style.display = 'none';
        kafkaFields.style.display = 'none';
        rabbitmqFields.style.display = 'none';
        redisFields.style.display = 'none';
        cronFields.style.display = 'none';
        customFields.style.display = 'none';

        // Show selected trigger fields
        if (this.value === 'cpu') {
            cpuFields.style.display = 'block';
        } else if (this.value === 'memory') {
            memoryFields.style.display = 'block';
        } else if (this.value === 'prometheus') {
            prometheusFields.style.display = 'block';
        } else if (this.value === 'kafka') {
            kafkaFields.style.display = 'block';
        } else if (this.value === 'rabbitmq') {
            rabbitmqFields.style.display = 'block';
        } else if (this.value === 'redis') {
            redisFields.style.display = 'block';
        } else if (this.value === 'cron') {
            cronFields.style.display = 'block';
        } else if (this.value === 'custom') {
            customFields.style.display = 'block';
        }
    });


    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const scalingMetric = document.querySelector('input[name="scalingMetric"]:checked').value;

        // Collect shared replica settings
        const minReplicaCount = parseInt(document.getElementById('minReplicaCount').value);
        const maxReplicaCount = parseInt(document.getElementById('maxReplicaCount').value);

        let metricConfig = {
            minReplicaCount: minReplicaCount,
            maxReplicaCount: maxReplicaCount
        };

        // Collect metric-specific config
        if (scalingMetric === 'concurrency') {
            metricConfig.targetValue = parseInt(document.getElementById('concurrencyTargetValue').value);
        } else if (scalingMetric === 'requestRate') {
            metricConfig.targetValue = parseInt(document.getElementById('requestRateTargetValue').value);
            metricConfig.window = document.getElementById('requestRateWindow').value.trim();
            metricConfig.granularity = document.getElementById('requestRateGranularity').value.trim();
        } else if (scalingMetric === 'scaledObject') {
            const triggerType = document.getElementById('triggerType').value;
            metricConfig.triggerType = triggerType;

            // Collect trigger-specific fields
            if (triggerType === 'cpu') {
                metricConfig.triggerConfig = {
                    utilization: parseInt(document.getElementById('cpuUtilization').value)
                };
            } else if (triggerType === 'memory') {
                metricConfig.triggerConfig = {
                    utilization: parseInt(document.getElementById('memoryUtilization').value)
                };
            } else if (triggerType === 'prometheus') {
                metricConfig.triggerConfig = {
                    serverAddress: document.getElementById('prometheusServerAddress').value.trim(),
                    query: document.getElementById('prometheusQuery').value.trim(),
                    threshold: parseInt(document.getElementById('prometheusThreshold').value)
                };
            } else if (triggerType === 'kafka') {
                metricConfig.triggerConfig = {
                    bootstrapServers: document.getElementById('kafkaBootstrapServers').value.trim(),
                    topic: document.getElementById('kafkaTopic').value.trim(),
                    consumerGroup: document.getElementById('kafkaConsumerGroup').value.trim(),
                    lagThreshold: parseInt(document.getElementById('kafkaLagThreshold').value)
                };
            } else if (triggerType === 'rabbitmq') {
                metricConfig.triggerConfig = {
                    host: document.getElementById('rabbitmqHost').value.trim(),
                    queueName: document.getElementById('rabbitmqQueueName').value.trim(),
                    queueLength: parseInt(document.getElementById('rabbitmqQueueLength').value)
                };
            } else if (triggerType === 'redis') {
                metricConfig.triggerConfig = {
                    address: document.getElementById('redisAddress').value.trim(),
                    listName: document.getElementById('redisListName').value.trim(),
                    listLength: parseInt(document.getElementById('redisListLength').value)
                };
            } else if (triggerType === 'cron') {
                metricConfig.triggerConfig = {
                    timezone: document.getElementById('cronTimezone').value.trim(),
                    start: document.getElementById('cronStart').value.trim(),
                    end: document.getElementById('cronEnd').value.trim(),
                    desiredReplicas: parseInt(document.getElementById('cronDesiredReplicas').value)
                };
            } else if (triggerType === 'custom') {
                // Collect custom trigger type and metadata YAML
                const customType = document.getElementById('customTriggerType').value.trim();
                const metadataYAML = document.getElementById('customTriggerMetadata').value.trim();

                metricConfig.customTriggerType = customType;
                metricConfig.customMetadataYAML = metadataYAML;
            }
        }

        // Collect form data
        const formData = {
            name: document.getElementById('functionName').value.trim(),
            namespace: document.getElementById('namespace').value.trim(),
            image: document.getElementById('containerImage').value.trim(),
            containerPort: parseInt(document.getElementById('containerPort').value),
            scalingMetric: scalingMetric,
            metricConfig: metricConfig
        };

        // Validate
        if (!validateForm(formData)) {
            return;
        }

        // Generate resources
        generateAndDisplayResources(formData);
    });

    /**
     * Validate form data
     */
    function validateForm(data) {
        if (!data.name || !data.namespace || !data.image) {
            alert('Please fill in all required fields');
            return false;
        }

        if (data.scalingMetric === 'concurrency' || data.scalingMetric === 'requestRate') {
            if (data.metricConfig.targetValue < 1) {
                alert('Target value must be at least 1');
                return false;
            }
        }

        if (data.scalingMetric === 'requestRate') {
            if (!data.metricConfig.window || !data.metricConfig.granularity) {
                alert('Please fill in window and granularity for request rate metric');
                return false;
            }
        }

        // Validate min/max replicas (applies to all scaling types)
        if (data.metricConfig.minReplicaCount > data.metricConfig.maxReplicaCount) {
            alert('Min replica count cannot be greater than max replica count');
            return false;
        }

        if (data.scalingMetric === 'scaledObject') {
            const triggerType = data.metricConfig.triggerType;

            if (triggerType === 'prometheus') {
                if (!data.metricConfig.triggerConfig.serverAddress || !data.metricConfig.triggerConfig.query) {
                    alert('Please fill in Prometheus server address and query');
                    return false;
                }
            } else if (triggerType === 'kafka') {
                if (!data.metricConfig.triggerConfig.bootstrapServers || !data.metricConfig.triggerConfig.topic || !data.metricConfig.triggerConfig.consumerGroup) {
                    alert('Please fill in Kafka bootstrap servers, topic, and consumer group');
                    return false;
                }
            } else if (triggerType === 'rabbitmq') {
                if (!data.metricConfig.triggerConfig.host || !data.metricConfig.triggerConfig.queueName) {
                    alert('Please fill in RabbitMQ host and queue name');
                    return false;
                }
            } else if (triggerType === 'redis') {
                if (!data.metricConfig.triggerConfig.address || !data.metricConfig.triggerConfig.listName) {
                    alert('Please fill in Redis address and list name');
                    return false;
                }
            } else if (triggerType === 'cron') {
                if (!data.metricConfig.triggerConfig.start || !data.metricConfig.triggerConfig.end) {
                    alert('Please fill in cron start and end schedules');
                    return false;
                }
            } else if (triggerType === 'custom') {
                if (!data.metricConfig.customTriggerType) {
                    alert('Please specify the custom trigger type');
                    return false;
                }
                if (!data.metricConfig.customMetadataYAML) {
                    alert('Please provide metadata YAML for the custom trigger');
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Generate and display all resources
     */
    function generateAndDisplayResources(config) {
        // Hide empty state
        emptyState.style.display = 'none';

        // Show user view
        userView.style.display = 'block';

        let scalingDescription = '';
        if (config.scalingMetric === 'concurrency') {
            scalingDescription = `targeting <strong>${config.metricConfig.targetValue}</strong> concurrent requests per instance`;
        } else if (config.scalingMetric === 'requestRate') {
            scalingDescription = `targeting <strong>${config.metricConfig.targetValue}</strong> requests per second
                (window: ${config.metricConfig.window}, granularity: ${config.metricConfig.granularity})`;
        } else if (config.scalingMetric === 'scaledObject') {
            const triggerType = config.metricConfig.triggerType;
            let triggerDesc = '';

            if (triggerType === 'cpu') {
                triggerDesc = `CPU utilization at <strong>${config.metricConfig.triggerConfig.utilization}%</strong>`;
            } else if (triggerType === 'memory') {
                triggerDesc = `memory utilization at <strong>${config.metricConfig.triggerConfig.utilization}%</strong>`;
            } else if (triggerType === 'prometheus') {
                triggerDesc = `Prometheus metric "<strong>${config.metricConfig.triggerConfig.query}</strong>" exceeding <strong>${config.metricConfig.triggerConfig.threshold}</strong>`;
            } else if (triggerType === 'kafka') {
                triggerDesc = `Kafka topic "<strong>${config.metricConfig.triggerConfig.topic}</strong>" lag exceeding <strong>${config.metricConfig.triggerConfig.lagThreshold}</strong>`;
            } else if (triggerType === 'rabbitmq') {
                triggerDesc = `RabbitMQ queue "<strong>${config.metricConfig.triggerConfig.queueName}</strong>" length exceeding <strong>${config.metricConfig.triggerConfig.queueLength}</strong>`;
            } else if (triggerType === 'redis') {
                triggerDesc = `Redis list "<strong>${config.metricConfig.triggerConfig.listName}</strong>" length exceeding <strong>${config.metricConfig.triggerConfig.listLength}</strong>`;
            } else if (triggerType === 'cron') {
                triggerDesc = `cron schedule (active from <strong>${config.metricConfig.triggerConfig.start}</strong> to <strong>${config.metricConfig.triggerConfig.end}</strong>)`;
            } else if (triggerType === 'custom') {
                triggerDesc = `custom trigger type "<strong>${config.metricConfig.customTriggerType}</strong>" with custom metadata`;
            }

            scalingDescription = `using KEDA trigger based on ${triggerDesc}, scaling between <strong>${config.metricConfig.minReplicaCount}</strong> and <strong>${config.metricConfig.maxReplicaCount}</strong> replicas`;
        }

        // Update scaling description to include min/max for HTTP-based scaling too
        if (config.scalingMetric === 'concurrency' || config.scalingMetric === 'requestRate') {
            scalingDescription += `, scaling between <strong>${config.metricConfig.minReplicaCount}</strong> and <strong>${config.metricConfig.maxReplicaCount}</strong> replicas`;
        }

        userMessage.innerHTML = `
            You created a Function named <strong>${config.name}</strong> in namespace <strong>${config.namespace}</strong>
            with auto-scaling enabled.
            <br><br>
            The platform will automatically scale your function based on HTTP traffic,
            ${scalingDescription}.
        `;

        // Show platform view
        platformView.style.display = 'block';

        // Generate resources
        const resources = [
            {
                type: 'deployment',
                name: config.name,
                yaml: generateDeploymentYAML(config),
                metadata: RESOURCE_METADATA.deployment
            },
            {
                type: 'service',
                name: config.name,
                yaml: generateServiceYAML(config),
                metadata: RESOURCE_METADATA.service
            }
        ];

        // Add scaling resource based on selected metric
        if (config.scalingMetric === 'concurrency' || config.scalingMetric === 'requestRate') {
            resources.push({
                type: 'httpScaledObject',
                name: `${config.name}-http`,
                yaml: generateHTTPScaledObjectYAML(config),
                metadata: RESOURCE_METADATA.httpScaledObject
            });
        } else if (config.scalingMetric === 'scaledObject') {
            resources.push({
                type: 'scaledObject',
                name: `${config.name}-scaledobject`,
                yaml: generateScaledObjectYAML(config),
                metadata: RESOURCE_METADATA.scaledObject
            });
        }

        // Render resource cards
        renderResourceCards(resources, config.name);
    }

    /**
     * Render resource cards in the UI
     */
    function renderResourceCards(resources, functionName) {
        resourceCards.innerHTML = '';

        resources.forEach((resource, index) => {
            const card = createResourceCard(resource, functionName, index);
            resourceCards.appendChild(card);
        });
    }

    /**
     * Create a resource card element
     */
    function createResourceCard(resource, functionName, index) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.id = `resource-${index}`;

        // Header
        const header = document.createElement('div');
        header.className = 'resource-header';
        header.innerHTML = `
            <div class="resource-title">
                <div class="resource-kind">${resource.metadata.kind}</div>
                <div class="resource-name">${resource.name}</div>
                <div class="resource-api-version">${resource.metadata.apiVersion}</div>
            </div>
            <div class="expand-icon">▼</div>
        `;

        // Body (initially hidden)
        const body = document.createElement('div');
        body.className = 'resource-body';

        // Meta information
        const meta = document.createElement('div');
        meta.className = 'resource-meta';
        meta.innerHTML = `
            <strong>Label:</strong> <code>serverless.openshift.io/function: ${functionName}</code>
            <br>
            <strong>Purpose:</strong> ${resource.metadata.description}
        `;

        // YAML display
        const yamlDisplay = document.createElement('div');
        yamlDisplay.className = 'yaml-display';
        yamlDisplay.innerHTML = `<pre>${escapeHtml(resource.yaml)}</pre>`;

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy YAML';
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(resource.yaml);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy YAML';
            }, 2000);
        });

        body.appendChild(meta);
        body.appendChild(yamlDisplay);
        body.appendChild(copyBtn);

        card.appendChild(header);
        card.appendChild(body);

        // Toggle expand/collapse
        header.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });

        return card;
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

    /**
     * Escape HTML for safe display
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
