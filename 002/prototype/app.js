/**
 * Application logic for Function composition UI
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Views
    const listView = document.getElementById('listView');
    const formView = document.getElementById('formView');

    // List elements
    const functionsTableBody = document.getElementById('functionsTableBody');
    const emptyTableState = document.getElementById('emptyTableState');
    const functionCountSpan = document.getElementById('functionCount');
    const searchInput = document.getElementById('searchInput');
    const selectAllCheckbox = document.getElementById('selectAll');
    const createNewBtn = document.getElementById('createNewBtn');
    const backToListBtn = document.getElementById('backToListBtn');

    // Sorting state
    let currentSort = { column: 'name', direction: 'asc' };
    let searchQuery = '';

    // Form elements
    const form = document.getElementById('functionForm');
    const formTitle = document.getElementById('formTitle');
    const userView = document.getElementById('userView');
    const platformView = document.getElementById('platformView');
    const emptyState = document.getElementById('emptyState');
    const userMessage = document.getElementById('userMessage');
    const resourceCards = document.getElementById('resourceCards');
    const resourceCount = document.getElementById('resourceCount');
    const platformDescription = document.getElementById('platformDescription');
    const createFunctionBtn = document.getElementById('createFunctionBtn');
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    const scalingMetricRadios = document.querySelectorAll('input[name="scalingMetric"]');
    const concurrencyPanel = document.getElementById('concurrencyPanel');
    const requestRatePanel = document.getElementById('requestRatePanel');
    const scaledObjectPanel = document.getElementById('scaledObjectPanel');
    const triggerTypeSelect = document.getElementById('triggerType');
    const networkingMethodRadios = document.querySelectorAll('input[name="networkingMethod"]');
    const noAccessPanel = document.getElementById('noAccessPanel');
    const gatewayAPIPanel = document.getElementById('gatewayAPIPanel');
    const ingressPanel = document.getElementById('ingressPanel');
    const routePanel = document.getElementById('routePanel');
    const ingressTLSCheckbox = document.getElementById('ingressTLSEnabled');
    const ingressTLSFields = document.getElementById('ingressTLSFields');

    // Store last rendered function data
    let lastRenderedFunction = null;

    // Initialize - show list view
    renderFunctionsList();

    // Navigation handlers
    createNewBtn.addEventListener('click', function() {
        clearCurrentEditingFunction();
        showFormView('create');
    });

    backToListBtn.addEventListener('click', function() {
        showListView();
    });

    // Create function button handler (after rendering)
    createFunctionBtn.addEventListener('click', function() {
        if (lastRenderedFunction) {
            saveFunction(lastRenderedFunction);
            showListView();
        }
    });

    // Cancel create button handler
    cancelCreateBtn.addEventListener('click', function() {
        showListView();
    });

    // Search handler
    searchInput.addEventListener('input', function() {
        searchQuery = this.value.toLowerCase();
        renderFunctionsList();
    });

    // Select all checkbox handler
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.function-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
    });

    // Sorting handlers
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', function() {
            const column = this.dataset.sort;

            // Toggle direction if same column, otherwise default to asc
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }

            // Update UI
            document.querySelectorAll('.sortable').forEach(h => {
                h.classList.remove('active', 'desc');
            });
            this.classList.add('active');
            if (currentSort.direction === 'desc') {
                this.classList.add('desc');
            }

            renderFunctionsList();
        });
    });

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

    // Handle networking method radio button change
    networkingMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            noAccessPanel.classList.remove('active');
            gatewayAPIPanel.classList.remove('active');
            ingressPanel.classList.remove('active');
            routePanel.classList.remove('active');

            if (this.value === 'none') {
                noAccessPanel.classList.add('active');
            } else if (this.value === 'gateway') {
                gatewayAPIPanel.classList.add('active');
            } else if (this.value === 'ingress') {
                ingressPanel.classList.add('active');
            } else if (this.value === 'route') {
                routePanel.classList.add('active');
            }
        });
    });

    // Handle Ingress TLS checkbox
    ingressTLSCheckbox.addEventListener('change', function() {
        if (this.checked) {
            ingressTLSFields.style.display = 'block';
        } else {
            ingressTLSFields.style.display = 'none';
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

        // Collect networking configuration
        const networkingMethod = document.querySelector('input[name="networkingMethod"]:checked').value;
        let networkingConfig = {
            method: networkingMethod
        };

        if (networkingMethod === 'gateway') {
            networkingConfig.gatewayName = document.getElementById('gatewayName').value.trim();
            networkingConfig.hostname = document.getElementById('gatewayHostname').value.trim();
            networkingConfig.path = document.getElementById('gatewayPath').value.trim();
        } else if (networkingMethod === 'ingress') {
            networkingConfig.ingressClass = document.getElementById('ingressClass').value.trim();
            networkingConfig.hostname = document.getElementById('ingressHostname').value.trim();
            networkingConfig.path = document.getElementById('ingressPath').value.trim();
            networkingConfig.tlsEnabled = document.getElementById('ingressTLSEnabled').checked;
            if (networkingConfig.tlsEnabled) {
                networkingConfig.tlsSecretName = document.getElementById('ingressTLSSecretName').value.trim();
            }
        } else if (networkingMethod === 'route') {
            networkingConfig.hostname = document.getElementById('routeHostname').value.trim();
            networkingConfig.path = document.getElementById('routePath').value.trim();
            networkingConfig.tlsTermination = document.getElementById('routeTLSTermination').value;
        }

        // Collect form data
        const formData = {
            name: document.getElementById('functionName').value.trim(),
            namespace: document.getElementById('namespace').value.trim(),
            image: document.getElementById('containerImage').value.trim(),
            containerPort: parseInt(document.getElementById('containerPort').value),
            scalingMetric: scalingMetric,
            metricConfig: metricConfig,
            networkingMethod: networkingMethod,
            networkingConfig: networkingConfig
        };

        // Validate
        if (!validateForm(formData)) {
            return;
        }

        // Store for later creation
        lastRenderedFunction = formData;

        // Generate resources
        generateAndDisplayResources(formData);

        // Show create/cancel buttons
        createFunctionBtn.style.display = 'inline-block';
        cancelCreateBtn.style.display = 'inline-block';

        // Scroll to results
        setTimeout(() => {
            platformView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
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

        // Validate networking configuration
        if (data.networkingMethod === 'gateway') {
            if (!data.networkingConfig.gatewayName || !data.networkingConfig.path) {
                alert('Please fill in Gateway name and path');
                return false;
            }
        } else if (data.networkingMethod === 'ingress') {
            if (!data.networkingConfig.hostname || !data.networkingConfig.path) {
                alert('Please fill in Ingress hostname and path');
                return false;
            }
            if (data.networkingConfig.tlsEnabled && !data.networkingConfig.tlsSecretName) {
                alert('Please provide a TLS secret name when TLS is enabled');
                return false;
            }
        } else if (data.networkingMethod === 'route') {
            if (!data.networkingConfig.path) {
                alert('Please fill in Route path');
                return false;
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

        // Build networking description
        let networkingDescription = '';
        if (config.networkingMethod === 'none') {
            networkingDescription = 'The function is only accessible within the cluster via the Service.';
        } else if (config.networkingMethod === 'gateway') {
            const hostnameDesc = config.networkingConfig.hostname ? ` at hostname <strong>${config.networkingConfig.hostname}</strong>` : '';
            networkingDescription = `The function is exposed externally via <strong>Gateway API (HTTPRoute)</strong>, attached to gateway <strong>${config.networkingConfig.gatewayName}</strong>${hostnameDesc} with path <strong>${config.networkingConfig.path}</strong>.`;
        } else if (config.networkingMethod === 'ingress') {
            const tlsDesc = config.networkingConfig.tlsEnabled ? ' with <strong>TLS enabled</strong>' : '';
            networkingDescription = `The function is exposed externally via <strong>Ingress</strong> at <strong>${config.networkingConfig.hostname}${config.networkingConfig.path}</strong>${tlsDesc}.`;
        } else if (config.networkingMethod === 'route') {
            const hostnameDesc = config.networkingConfig.hostname ? ` at <strong>${config.networkingConfig.hostname}</strong>` : ' (auto-generated hostname)';
            const tlsDesc = config.networkingConfig.tlsTermination !== 'none' ? ` with <strong>${config.networkingConfig.tlsTermination}</strong> TLS termination` : '';
            networkingDescription = `The function is exposed externally via <strong>OpenShift Route</strong>${hostnameDesc} with path <strong>${config.networkingConfig.path}</strong>${tlsDesc}.`;
        }

        userMessage.innerHTML = `
            You created a Function named <strong>${config.name}</strong> in namespace <strong>${config.namespace}</strong>
            with auto-scaling enabled.
            <br><br>
            The platform will automatically scale your function based on HTTP traffic,
            ${scalingDescription}.
            <br><br>
            ${networkingDescription}
        `;

        // Show platform view
        platformView.style.display = 'block';

        // Generate resources
        const resources = [
            {
                type: 'function',
                name: config.name,
                yaml: generateFunctionYAML(config),
                metadata: RESOURCE_METADATA.function
            },
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

        // Add networking resource based on selected method
        if (config.networkingMethod === 'gateway') {
            resources.push({
                type: 'httpRoute',
                name: config.name,
                yaml: generateHTTPRouteYAML(config),
                metadata: RESOURCE_METADATA.httpRoute
            });
        } else if (config.networkingMethod === 'ingress') {
            resources.push({
                type: 'ingress',
                name: config.name,
                yaml: generateIngressYAML(config),
                metadata: RESOURCE_METADATA.ingress
            });
        } else if (config.networkingMethod === 'route') {
            resources.push({
                type: 'route',
                name: config.name,
                yaml: generateRouteYAML(config),
                metadata: RESOURCE_METADATA.route
            });
        }

        // Update platform description with resource count
        resourceCount.textContent = resources.length;
        platformDescription.innerHTML = `
            The UI composed <strong>${resources.length}</strong> Kubernetes resources from your simple form input.
            <br>
            You created one Function CR, but the platform composed multiple resources: runtime (Deployment, Service),
            scaling (KEDA), ${config.networkingMethod !== 'none' ? 'and networking (HTTPRoute/Ingress/Route)' : 'without external networking'}.
        `;

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

    /**
     * Show list view
     */
    function showListView() {
        listView.style.display = 'block';
        formView.style.display = 'none';
        renderFunctionsList();
        resetForm();
    }

    /**
     * Show form view
     */
    function showFormView(mode) {
        listView.style.display = 'none';
        formView.style.display = 'block';

        if (mode === 'create') {
            formTitle.textContent = 'Create Function';
            resetForm();
        } else if (mode === 'edit') {
            formTitle.textContent = 'Edit Function';
            loadFunctionIntoForm(getCurrentEditingFunction());
        }

        // Hide results initially
        userView.style.display = 'none';
        platformView.style.display = 'none';
        emptyState.style.display = 'block';

        // Hide create/cancel buttons
        createFunctionBtn.style.display = 'none';
        cancelCreateBtn.style.display = 'none';

        // Clear last rendered function
        lastRenderedFunction = null;
    }

    /**
     * Reset form to default values
     */
    function resetForm() {
        form.reset();
        // Reset to defaults
        document.getElementById('functionName').value = 'my-function';
        document.getElementById('namespace').value = 'default';
        document.getElementById('containerImage').value = 'registry.example.com/functions/my-function:latest';
        document.getElementById('containerPort').value = '8080';
        document.getElementById('minReplicaCount').value = '0';
        document.getElementById('maxReplicaCount').value = '10';

        // Reset panels
        concurrencyPanel.classList.add('active');
        requestRatePanel.classList.remove('active');
        scaledObjectPanel.classList.remove('active');
        noAccessPanel.classList.add('active');
        gatewayAPIPanel.classList.remove('active');
        ingressPanel.classList.remove('active');
        routePanel.classList.remove('active');
    }

    /**
     * Load function data into form for editing
     */
    function loadFunctionIntoForm(functionData) {
        if (!functionData) return;

        document.getElementById('functionName').value = functionData.name;
        document.getElementById('namespace').value = functionData.namespace;
        document.getElementById('containerImage').value = functionData.image;
        document.getElementById('containerPort').value = functionData.containerPort;
        document.getElementById('minReplicaCount').value = functionData.metricConfig.minReplicaCount;
        document.getElementById('maxReplicaCount').value = functionData.metricConfig.maxReplicaCount;

        // Set scaling metric
        const scalingRadio = document.querySelector(`input[name="scalingMetric"][value="${functionData.scalingMetric}"]`);
        if (scalingRadio) {
            scalingRadio.checked = true;
            scalingRadio.dispatchEvent(new Event('change'));
        }

        // Load metric config
        if (functionData.scalingMetric === 'concurrency') {
            document.getElementById('concurrencyTargetValue').value = functionData.metricConfig.targetValue;
        } else if (functionData.scalingMetric === 'requestRate') {
            document.getElementById('requestRateTargetValue').value = functionData.metricConfig.targetValue;
            document.getElementById('requestRateWindow').value = functionData.metricConfig.window;
            document.getElementById('requestRateGranularity').value = functionData.metricConfig.granularity;
        }

        // Set networking method
        const networkingRadio = document.querySelector(`input[name="networkingMethod"][value="${functionData.networkingMethod}"]`);
        if (networkingRadio) {
            networkingRadio.checked = true;
            networkingRadio.dispatchEvent(new Event('change'));
        }

        // Load networking config
        if (functionData.networkingMethod === 'gateway') {
            document.getElementById('gatewayName').value = functionData.networkingConfig.gatewayName || 'default-gateway';
            document.getElementById('gatewayHostname').value = functionData.networkingConfig.hostname || '';
            document.getElementById('gatewayPath').value = functionData.networkingConfig.path || '/';
        } else if (functionData.networkingMethod === 'ingress') {
            document.getElementById('ingressClass').value = functionData.networkingConfig.ingressClass || '';
            document.getElementById('ingressHostname').value = functionData.networkingConfig.hostname || '';
            document.getElementById('ingressPath').value = functionData.networkingConfig.path || '/';
            document.getElementById('ingressTLSEnabled').checked = functionData.networkingConfig.tlsEnabled || false;
            if (functionData.networkingConfig.tlsEnabled) {
                ingressTLSFields.style.display = 'block';
                document.getElementById('ingressTLSSecretName').value = functionData.networkingConfig.tlsSecretName || '';
            }
        } else if (functionData.networkingMethod === 'route') {
            document.getElementById('routeHostname').value = functionData.networkingConfig.hostname || '';
            document.getElementById('routePath').value = functionData.networkingConfig.path || '/';
            document.getElementById('routeTLSTermination').value = functionData.networkingConfig.tlsTermination || 'edge';
        }
    }

    /**
     * Render functions list
     */
    function renderFunctionsList() {
        let functions = getFunctions();

        // Apply search filter
        if (searchQuery) {
            functions = functions.filter(func =>
                func.name.toLowerCase().includes(searchQuery) ||
                func.namespace.toLowerCase().includes(searchQuery)
            );
        }

        // Apply sorting
        functions.sort((a, b) => {
            let aVal, bVal;

            switch (currentSort.column) {
                case 'name':
                    aVal = a.name;
                    bVal = b.name;
                    break;
                case 'namespace':
                    aVal = a.namespace;
                    bVal = b.namespace;
                    break;
                case 'scaling':
                    aVal = a.scalingMetric;
                    bVal = b.scalingMetric;
                    break;
                case 'networking':
                    aVal = a.networkingMethod;
                    bVal = b.networkingMethod;
                    break;
                case 'image':
                    aVal = a.image;
                    bVal = b.image;
                    break;
                case 'created':
                    aVal = new Date(a.createdAt);
                    bVal = new Date(b.createdAt);
                    break;
                default:
                    aVal = a.name;
                    bVal = b.name;
            }

            if (currentSort.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        // Update function count
        functionCountSpan.textContent = functions.length;

        // Clear table
        functionsTableBody.innerHTML = '';

        // Show/hide empty state
        if (functions.length === 0) {
            emptyTableState.style.display = 'block';
            selectAllCheckbox.checked = false;
            return;
        } else {
            emptyTableState.style.display = 'none';
        }

        // Render rows
        functions.forEach(func => {
            const row = document.createElement('tr');

            const scalingDesc = func.scalingMetric === 'concurrency' ? 'Concurrency' :
                              func.scalingMetric === 'requestRate' ? 'Request Rate' : 'KEDA Triggers';
            const networkingDesc = func.networkingMethod === 'none' ? 'No external access' :
                                 func.networkingMethod === 'gateway' ? 'Gateway API' :
                                 func.networkingMethod === 'ingress' ? 'Ingress' : 'OpenShift Route';

            const createdDate = new Date(func.createdAt);
            const createdStr = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString();

            row.innerHTML = `
                <td class="checkbox-column">
                    <input type="checkbox" class="function-checkbox" data-id="${func.id}">
                </td>
                <td>
                    <a href="#" class="function-name-link" data-id="${func.id}">${func.name}</a>
                </td>
                <td>${func.namespace}</td>
                <td>${scalingDesc}</td>
                <td>${networkingDesc}</td>
                <td><code style="font-size: 0.85em">${func.image}</code></td>
                <td>${createdStr}</td>
                <td class="actions-column">
                    <div class="table-actions">
                        <button class="btn-secondary btn-small edit-btn" data-id="${func.id}">Edit</button>
                        <button class="btn-danger btn-small delete-btn" data-id="${func.id}">Delete</button>
                    </div>
                </td>
            `;

            functionsTableBody.appendChild(row);
        });

        // Add event listeners for edit/delete buttons and function name links
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const func = getFunction(this.dataset.id);
                setCurrentEditingFunction(func);
                showFormView('edit');
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const func = getFunction(this.dataset.id);
                if (confirm(`Are you sure you want to delete function "${func.name}"?`)) {
                    deleteFunction(func.id);
                    renderFunctionsList();
                }
            });
        });

        document.querySelectorAll('.function-name-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const func = getFunction(this.dataset.id);
                setCurrentEditingFunction(func);
                showFormView('edit');
            });
        });

        // Reset select all checkbox
        selectAllCheckbox.checked = false;
    }
});
