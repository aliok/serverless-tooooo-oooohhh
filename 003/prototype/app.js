/**
 * Application logic for Function composition UI
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');

    // Views
    const listView = document.getElementById('listView');
    const formView = document.getElementById('formView');
    const detailView = document.getElementById('detailView');
    const subscriptionsView = document.getElementById('subscriptionsView');
    const eventSourceDetailView = document.getElementById('eventSourceDetailView');
    const eventSourcesListView = document.getElementById('eventSourcesListView');

    // List elements - Functions
    const functionsTableBody = document.getElementById('functionsTableBody');
    const emptyTableState = document.getElementById('emptyTableState');
    const functionCountSpan = document.getElementById('functionCount');
    const searchInput = document.getElementById('searchInput');
    const selectAllCheckbox = document.getElementById('selectAll');
    const createNewBtn = document.getElementById('createNewBtn');
    const backToListBtn = document.getElementById('backToListBtn');


    // List elements - Event Sources
    const eventSourcesTableBody = document.getElementById('eventSourcesTableBody');
    const emptyEventSourcesState = document.getElementById('emptyEventSourcesState');
    const eventSourceCountSpan = document.getElementById('eventSourceCount');
    const createNewEventSourceBtn = document.getElementById('createNewEventSourceBtn');

    // Event Source form elements
    const eventSourceFormView = document.getElementById('eventSourceFormView');
    const eventSourceForm = document.getElementById('eventSourceForm');
    const eventSourceFormTitle = document.getElementById('eventSourceFormTitle');
    const backToEventSourcesListBtn = document.getElementById('backToEventSourcesListBtn');
    const saveEventSourceBtn = document.getElementById('saveEventSourceBtn');
    const eventSourcePlatformView = document.getElementById('eventSourcePlatformView');
    const eventSourcePlatformDescription = document.getElementById('eventSourcePlatformDescription');
    const eventSourceResourceCards = document.getElementById('eventSourceResourceCards');
    const eventSourceTypeRadios = document.querySelectorAll('input[name="eventSourceType"]');
    const githubSourcePanel = document.getElementById('githubSourcePanel');
    const kafkaSourcePanel = document.getElementById('kafkaSourcePanel');
    const slackSourcePanel = document.getElementById('slackSourcePanel');
    const cronSourcePanel = document.getElementById('cronSourcePanel');

    // Broker form elements
    // Sorting state
    let currentSort = { column: 'name', direction: 'asc' };
    let searchQuery = '';

    // Form elements
    const form = document.getElementById('functionForm');
    const formTitle = document.getElementById('formTitle');
    const userView = document.getElementById('userView');
    const platformView = document.getElementById('platformView');
    const userMessage = document.getElementById('userMessage');
    const resourceCards = document.getElementById('resourceCards');
    const resourceCount = document.getElementById('resourceCount');
    const platformDescription = document.getElementById('platformDescription');
    const createFunctionDirectBtn = document.getElementById('createFunctionDirectBtn');
    const buildMethodRadios = document.querySelectorAll('input[name="buildMethod"]');
    const noBuildPanel = document.getElementById('noBuildPanel');
    const shipwrightBuildPanel = document.getElementById('shipwrightBuildPanel');
    const s2iBuildPanel = document.getElementById('s2iBuildPanel');
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

    // Detail view elements
    const backToListFromDetailBtn = document.getElementById('backToListFromDetailBtn');
    const detailFunctionName = document.getElementById('detailFunctionName');
    const detailNamespace = document.getElementById('detailNamespace');
    const detailImage = document.getElementById('detailImage');
    const detailScaling = document.getElementById('detailScaling');
    const detailNetworking = document.getElementById('detailNetworking');
    const editFunctionBtn = document.getElementById('editFunctionBtn');
    const manageSubscriptionsBtn = document.getElementById('manageSubscriptionsBtn');
    const subscriptionsSummaryText = document.getElementById('subscriptionsSummaryText');
    const detailPlatformView = document.getElementById('detailPlatformView');
    const detailResourceCount = document.getElementById('detailResourceCount');
    const detailPlatformDescription = document.getElementById('detailPlatformDescription');
    const detailResourceCards = document.getElementById('detailResourceCards');
    const diagramFunctionName = document.getElementById('diagramFunctionName');
    const eventSourcesList = document.getElementById('eventSourcesList');
    const destinationsList = document.getElementById('destinationsList');
    const addTriggerBtn = document.getElementById('addTriggerBtn');

    // Subscriptions view elements
    const backToDetailFromSubscriptionsBtn = document.getElementById('backToDetailFromSubscriptionsBtn');
    const subscriptionsViewFunctionName = document.getElementById('subscriptionsViewFunctionName');
    const subscriptionsList = document.getElementById('subscriptionsList');
    const emptySubscriptions = document.getElementById('emptySubscriptions');
    const subscriptionForm = document.getElementById('subscriptionForm');
    const subscriptionEventType = document.getElementById('subscriptionEventType');
    const customEventTypeField = document.getElementById('customEventTypeField');
    const saveSubscriptionBtn = document.getElementById('saveSubscriptionBtn');

    // Destinations view elements
    const backToDetailFromDestinationsBtn = document.getElementById('backToDetailFromDestinationsBtn');
    const destinationsViewFunctionName = document.getElementById('destinationsViewFunctionName');
    const destinationDisplay = document.getElementById('destinationDisplay');
    const emptyDestination = document.getElementById('emptyDestination');
    const destinationForm = document.getElementById('destinationForm');
    const saveDestinationBtn = document.getElementById('saveDestinationBtn');
    const addDestinationBtn = document.getElementById('addDestinationBtn');

    // Event Source detail view elements
    const backToEventSourcesListFromDetailBtn = document.getElementById('backToEventSourcesListFromDetailBtn');
    const editEventSourceFromDetailBtn = document.getElementById('editEventSourceFromDetailBtn');
    const detailEventSourceName = document.getElementById('detailEventSourceName');
    const diagramEventSourceName = document.getElementById('diagramEventSourceName');
    const detailEventSourceType = document.getElementById('detailEventSourceType');
    const detailEventSourceNamespace = document.getElementById('detailEventSourceNamespace');
    const detailEventSourceBroker = document.getElementById('detailEventSourceBroker');
    const detailEventSourceEventTypes = document.getElementById('detailEventSourceEventTypes');
    const eventSourceExternalSource = document.getElementById('eventSourceExternalSource');
    const eventSourceTargetBroker = document.getElementById('eventSourceTargetBroker');
    const eventSourceDetailResourceCount = document.getElementById('eventSourceDetailResourceCount');
    const eventSourceDetailPlatformDescription = document.getElementById('eventSourceDetailPlatformDescription');
    const eventSourceDetailResourceCards = document.getElementById('eventSourceDetailResourceCards');

    // Store last rendered function data
    let lastRenderedFunction = null;

    // Store current detail view function
    let currentDetailFunction = null;

    // Initialize - show list view
    renderFunctionsList();

    // Navigation tab handlers
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const view = this.dataset.view;

            // Update active tab
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show appropriate view
            if (view === 'functions') {
                showFunctionsList();
            } else if (view === 'brokers') {
                showBrokersList();
            } else if (view === 'eventSources') {
                showEventSourcesList();
            }
        });
    });

    // Navigation handlers
    createNewBtn.addEventListener('click', function() {
        clearCurrentEditingFunction();
        showFormView('create');
    });

    backToListBtn.addEventListener('click', function() {
        showListView();
    });

    backToListFromDetailBtn.addEventListener('click', function() {
        showListView();
    });

    createNewEventSourceBtn.addEventListener('click', function() {
        clearCurrentEditingEventSource();
        showEventSourceFormView('create');
    });

    backToEventSourcesListBtn.addEventListener('click', function() {
        showEventSourcesList();
    });

    saveEventSourceBtn.addEventListener('click', function() {
        const eventSourceData = collectEventSourceFormData();

        // Validate
        if (!eventSourceData.name || !eventSourceData.namespace || !eventSourceData.broker) {
            alert('Please fill in all required fields');
            return;
        }

        // Save and show list
        saveEventSource(eventSourceData);
        showEventSourcesList();
    });

    backToDetailFromSubscriptionsBtn.addEventListener('click', function() {
        if (currentDetailFunction) {
            showDetailView(currentDetailFunction);
        }
    });

    editFunctionBtn.addEventListener('click', function() {
        if (currentDetailFunction) {
            setCurrentEditingFunction(currentDetailFunction);
            showFormView('edit');
        }
    });

    manageSubscriptionsBtn.addEventListener('click', function() {
        if (currentDetailFunction) {
            showSubscriptionsView(currentDetailFunction);
        }
    });

    addTriggerBtn.addEventListener('click', function() {
        if (currentDetailFunction) {
            showSubscriptionsView(currentDetailFunction);
        }
    });

    addDestinationBtn.addEventListener('click', function() {
        if (currentDetailFunction) {
            showDestinationsView(currentDetailFunction);
        }
    });

    backToDetailFromDestinationsBtn.addEventListener('click', function() {
        if (currentDetailFunction) {
            showDetailView(currentDetailFunction);
        }
    });

    //     //     // Broker detail view navigation handlers
    //     //     backToBrokersListFromDetailBtn.addEventListener('click', function() {
    //     //         showBrokersList();
    //     //     });

    editBrokerFromDetailBtn.addEventListener('click', function() {
        const brokerData = getCurrentEditingBroker();
        if (brokerData) {
            setCurrentEditingBroker(brokerData);
            showBrokerFormView('edit');
        }
    });

    // Event Source detail view navigation handlers
    backToEventSourcesListFromDetailBtn.addEventListener('click', function() {
        showEventSourcesList();
    });

    editEventSourceFromDetailBtn.addEventListener('click', function() {
        const eventSourceData = getCurrentEditingEventSource();
        if (eventSourceData) {
            setCurrentEditingEventSource(eventSourceData);
            showEventSourceFormView('edit');
        }
    });

    // Create/Save function button handler
    createFunctionDirectBtn.addEventListener('click', function() {
        // Collect form data without rendering
        const formData = collectFormData();

        // Validate
        if (!validateForm(formData)) {
            return;
        }

        // Initialize eventSubscriptions
        formData.eventSubscriptions = [];

        // Save and show detail view
        saveFunction(formData);
        showDetailView(formData);
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

    // Handle build method radio button change
    buildMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            noBuildPanel.classList.remove('active');
            shipwrightBuildPanel.classList.remove('active');
            s2iBuildPanel.classList.remove('active');

            if (this.value === 'none') {
                noBuildPanel.classList.add('active');
            } else if (this.value === 'shipwright') {
                shipwrightBuildPanel.classList.add('active');
            } else if (this.value === 's2i') {
                s2iBuildPanel.classList.add('active');
            }
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

    // Handle event source type radio button change
    eventSourceTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            githubSourcePanel.classList.remove('active');
            kafkaSourcePanel.classList.remove('active');
            slackSourcePanel.classList.remove('active');
            cronSourcePanel.classList.remove('active');

            if (this.value === 'github') {
                githubSourcePanel.classList.add('active');
            } else if (this.value === 'kafka') {
                kafkaSourcePanel.classList.add('active');
            } else if (this.value === 'slack') {
                slackSourcePanel.classList.add('active');
            } else if (this.value === 'cron') {
                cronSourcePanel.classList.add('active');
            }
        });
    });

    // Handle event type dropdown change
    subscriptionEventType.addEventListener('change', function() {
        if (this.value === 'custom') {
            customEventTypeField.style.display = 'block';
        } else {
            customEventTypeField.style.display = 'none';
        }
    });

    // Handle subscription form submission
    subscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let eventType = subscriptionEventType.value;

        if (eventType === 'custom') {
            eventType = document.getElementById('customEventType').value.trim();
        }

        if (!eventType || eventType === '') {
            alert('Please select or enter an event type');
            return;
        }

        // Check if this subscription already exists
        const existing = currentDetailFunction.eventSubscriptions.find(
            sub => sub.eventType === eventType
        );

        if (existing) {
            alert('This event subscription already exists');
            return;
        }

        // Add subscription
        currentDetailFunction.eventSubscriptions.push({
            eventType: eventType
        });

        // Save to state
        saveFunction(currentDetailFunction);

        // Refresh subscriptions view
        renderEventSubscriptions(currentDetailFunction);

        // Reset form
        subscriptionForm.reset();
        customEventTypeField.style.display = 'none';
    });

    // Handle destination form submission
    destinationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const broker = document.getElementById('destinationBroker').value.trim();

        if (!broker) {
            alert('Please select a broker');
            return;
        }

        // Set destination
        currentDetailFunction.sinkMethod = 'broker';
        currentDetailFunction.sinkConfig = {
            method: 'broker',
            broker: broker
        };

        // Save to state
        saveFunction(currentDetailFunction);

        // Refresh destination view
        renderDestination(currentDetailFunction);

        // Reset form
        destinationForm.reset();
    });

    /**
     * Collect form data into an object
     */
    function collectFormData() {
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

        // Collect build configuration
        const buildMethod = document.querySelector('input[name="buildMethod"]:checked').value;
        let buildConfig = {
            method: buildMethod
        };

        // Determine the image based on build method
        let containerImage = '';
        if (buildMethod === 'none') {
            containerImage = document.getElementById('containerImage').value.trim();
        } else if (buildMethod === 'shipwright') {
            buildConfig.gitURL = document.getElementById('shipwrightGitURL').value.trim();
            buildConfig.gitRevision = document.getElementById('shipwrightGitRevision').value.trim();
            buildConfig.strategy = document.getElementById('shipwrightStrategy').value;
            buildConfig.outputImage = document.getElementById('shipwrightOutputImage').value.trim();
            containerImage = buildConfig.outputImage; // Use the build output image
        } else if (buildMethod === 's2i') {
            buildConfig.gitURL = document.getElementById('s2iGitURL').value.trim();
            buildConfig.gitRevision = document.getElementById('s2iGitRevision').value.trim();
            buildConfig.builderImage = document.getElementById('s2iBuilderImage').value;
            buildConfig.outputImageStream = document.getElementById('s2iOutputImageStream').value.trim();
            // For S2I, construct image reference from ImageStreamTag
            const imageStreamTag = buildConfig.outputImageStream || `${document.getElementById('functionName').value.trim()}:latest`;
            containerImage = `image-registry.openshift-image-registry.svc:5000/${document.getElementById('namespace').value.trim()}/${imageStreamTag}`;
        }

        // Collect form data
        const formData = {
            name: document.getElementById('functionName').value.trim(),
            namespace: document.getElementById('namespace').value.trim(),
            image: containerImage,
            containerPort: parseInt(document.getElementById('containerPort').value),
            buildMethod: buildMethod,
            buildConfig: buildConfig,
            scalingMetric: scalingMetric,
            metricConfig: metricConfig,
            networkingMethod: networkingMethod,
            networkingConfig: networkingConfig
        };

        // If editing, preserve the ID and sink configuration
        const currentEditing = getCurrentEditingFunction();
        if (currentEditing && currentEditing.id) {
            formData.id = currentEditing.id;
            // Preserve sink configuration if it exists
            if (currentEditing.sinkMethod) {
                formData.sinkMethod = currentEditing.sinkMethod;
                formData.sinkConfig = currentEditing.sinkConfig;
            }
        }

        return formData;
    }

    // Handle form submission (preview resources)
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateResourcePreview();
    });

    /**
     * Update resource preview in form view
     */
    function updateResourcePreview() {
        const formData = collectFormData();

        // Basic validation (don't show validation errors during auto-update)
        if (!formData.name || !formData.namespace || !formData.image) {
            return;
        }

        // Store for later creation
        lastRenderedFunction = formData;

        // Generate resources
        generateAndDisplayResources(formData);
    }

    // Auto-update resources on form input changes
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Debounce the update
            clearTimeout(input.updateTimeout);
            input.updateTimeout = setTimeout(() => {
                updateResourcePreview();
            }, 500);
        });

        input.addEventListener('change', function() {
            // Immediate update on change (for radio buttons, checkboxes, selects)
            updateResourcePreview();
        });
    });

    // Auto-update broker resources on form input changes
    const brokerFormInputs = brokerForm.querySelectorAll('input, select, textarea');
    brokerFormInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Debounce the update
            clearTimeout(input.updateTimeout);
            input.updateTimeout = setTimeout(() => {
                updateBrokerResourcePreview();
            }, 500);
        });

        input.addEventListener('change', function() {
            // Immediate update on change (for radio buttons, checkboxes, selects)
            updateBrokerResourcePreview();
        });
    });

    // Auto-update event source resources on form input changes
    const eventSourceFormInputs = eventSourceForm.querySelectorAll('input, select, textarea');
    eventSourceFormInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Debounce the update
            clearTimeout(input.updateTimeout);
            input.updateTimeout = setTimeout(() => {
                updateEventSourceResourcePreview();
            }, 500);
        });

        input.addEventListener('change', function() {
            // Immediate update on change (for radio buttons, checkboxes, selects)
            updateEventSourceResourcePreview();
        });
    });

    /**
     * Validate form data
     */
    function validateForm(data) {
        if (!data.name || !data.namespace) {
            alert('Please fill in all required fields');
            return false;
        }

        // Validate image based on build method
        if (!data.image) {
            alert('Please provide a container image');
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

        // Validate build configuration
        if (data.buildMethod === 'shipwright') {
            if (!data.buildConfig.gitURL) {
                alert('Please provide a Git URL for Shipwright build');
                return false;
            }
            if (!data.buildConfig.outputImage) {
                alert('Please provide an output image for Shipwright build');
                return false;
            }
        } else if (data.buildMethod === 's2i') {
            if (!data.buildConfig.gitURL) {
                alert('Please provide a Git URL for S2I build');
                return false;
            }
        }

        return true;
    }

    /**
     * Generate and display all resources
     */
    function generateAndDisplayResources(config) {
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

        // Build build description
        let buildDescription = '';
        if (config.buildMethod === 'none') {
            buildDescription = 'The function uses the pre-built container image you provided.';
        } else if (config.buildMethod === 'shipwright') {
            buildDescription = `The function will be built from source using <strong>Shipwright Build</strong> with the <strong>${config.buildConfig.strategy}</strong> strategy from <strong>${config.buildConfig.gitURL}</strong>.`;
        } else if (config.buildMethod === 's2i') {
            buildDescription = `The function will be built from source using <strong>OpenShift S2I</strong> with the <strong>${config.buildConfig.builderImage}</strong> builder image from <strong>${config.buildConfig.gitURL}</strong>.`;
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
            ${buildDescription}
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
            }
        ];

        // Add build resource based on selected method
        if (config.buildMethod === 'shipwright') {
            resources.push({
                type: 'shipwrightBuild',
                name: `${config.name}-build`,
                yaml: generateShipwrightBuildYAML(config),
                metadata: RESOURCE_METADATA.shipwrightBuild
            });
        } else if (config.buildMethod === 's2i') {
            resources.push({
                type: 's2iBuildConfig',
                name: `${config.name}-build`,
                yaml: generateS2IBuildConfigYAML(config),
                metadata: RESOURCE_METADATA.s2iBuildConfig
            });
        }

        // Add runtime resources
        resources.push(
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
        );

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
        const buildPart = config.buildMethod !== 'none' ? `build (${config.buildMethod === 'shipwright' ? 'Shipwright' : 'S2I BuildConfig'}), ` : '';
        const networkingPart = config.networkingMethod !== 'none' ? 'and networking (HTTPRoute/Ingress/Route)' : 'without external networking';
        platformDescription.innerHTML = `
            The UI composed <strong>${resources.length}</strong> Kubernetes resources from your simple form input.
            <br>
            You created one Function CR, but the platform composed multiple resources: ${buildPart}runtime (Deployment, Service),
            scaling (KEDA), ${networkingPart}.
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
     * Show list view (deprecated - use showFunctionsList instead)
     */
    function showListView() {
        showFunctionsList();
    }

    /**
     * Show functions list view
     */
    function showFunctionsList() {
        listView.style.display = 'block';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        // // brokerDetailView.style.display = 'none';
        eventSourceDetailView.style.display = 'none';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';
        renderFunctionsList();
        resetForm();
    }

    /**
     * Show brokers list view
     */
    function showBrokersList() {
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        // // brokerDetailView.style.display = 'none';
        eventSourceDetailView.style.display = 'none';
        brokersListView.style.display = 'block';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';
        renderBrokersList();
    }

    /**
     * Show event sources list view
     */
    function showEventSourcesList() {
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        // // brokerDetailView.style.display = 'none';
        eventSourceDetailView.style.display = 'none';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'block';
        eventSourceFormView.style.display = 'none';
        renderEventSourcesList();
    }

    /**
     * Show event source form view
     */
    function showEventSourceFormView(mode) {
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        // // brokerDetailView.style.display = 'none';
        eventSourceDetailView.style.display = 'none';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'block';

        if (mode === 'create') {
            eventSourceFormTitle.textContent = 'Create Event Source';
            saveEventSourceBtn.textContent = 'Create Event Source';
            resetEventSourceForm();
        } else if (mode === 'edit') {
            eventSourceFormTitle.textContent = 'Edit Event Source';
            saveEventSourceBtn.textContent = 'Save Event Source';
            loadEventSourceIntoForm(getCurrentEditingEventSource());
        }

        // Populate broker dropdown
        populateBrokerDropdown();

        // Trigger initial resource preview
        setTimeout(() => {
            updateEventSourceResourcePreview();
        }, 100);
    }

    /**
     * Populate broker dropdown with existing brokers
     */
    function populateBrokerDropdown() {
        const dropdown = document.getElementById('eventSourceBroker');
        const brokers = getBrokers();

        // Clear existing options except first
        dropdown.innerHTML = '<option value="">Select a broker...</option>';

        // Add broker options
        brokers.forEach(broker => {
            const option = document.createElement('option');
            option.value = broker.name;
            option.textContent = `${broker.name} (${broker.namespace})`;
            dropdown.appendChild(option);
        });
    }

    /**
     * Collect event source form data into an object
     */
    function collectEventSourceFormData() {
        const eventSourceType = document.querySelector('input[name="eventSourceType"]:checked').value;
        let config = {};
        let eventTypes = [];

        // Collect type-specific config and set proper CloudEvent types
        if (eventSourceType === 'github') {
            config = {
                repository: document.getElementById('githubRepository').value.trim(),
                accessTokenSecret: document.getElementById('githubAccessTokenSecret').value.trim()
            };
            eventTypes = ['dev.knative.sources.github.event'];
        } else if (eventSourceType === 'kafka') {
            config = {
                bootstrapServers: document.getElementById('kafkaBootstrapServers').value.trim(),
                topics: document.getElementById('kafkaTopics').value.trim().split(',').map(t => t.trim()),
                consumerGroup: document.getElementById('kafkaConsumerGroup').value.trim()
            };
            eventTypes = ['dev.knative.kafka.event'];
        } else if (eventSourceType === 'slack') {
            config = {
                webhookURLSecret: document.getElementById('slackWebhookURL').value.trim()
            };
            eventTypes = ['dev.knative.sources.slack.event'];
        } else if (eventSourceType === 'cron') {
            config = {
                schedule: document.getElementById('cronSchedule').value.trim(),
                data: document.getElementById('cronData').value.trim()
            };
            eventTypes = ['dev.knative.sources.ping'];
        }

        const formData = {
            name: document.getElementById('eventSourceName').value.trim(),
            namespace: document.getElementById('eventSourceNamespace').value.trim(),
            type: eventSourceType,
            config: config,
            eventTypes: eventTypes
        };

        // If editing, preserve the ID
        const currentEditing = getCurrentEditingEventSource();
        if (currentEditing && currentEditing.id) {
            formData.id = currentEditing.id;
        }

        return formData;
    }

    /**
     * Reset event source form to default values
     */
    function resetEventSourceForm() {
        document.getElementById('eventSourceName').value = 'my-event-source';
        document.getElementById('eventSourceNamespace').value = 'default';
        document.getElementById('eventSourceBroker').value = '';

        // Reset to GitHub as default
        const githubRadio = document.querySelector('input[name="eventSourceType"][value="github"]');
        if (githubRadio) {
            githubRadio.checked = true;
            githubRadio.dispatchEvent(new Event('change'));
        }

        // Reset GitHub fields
        document.getElementById('githubRepository').value = 'username/repo';
        document.getElementById('githubAccessTokenSecret').value = 'github-secret';

        // Reset Kafka fields
        document.getElementById('kafkaBootstrapServers').value = 'kafka:9092';
        document.getElementById('kafkaTopics').value = 'my-topic';
        document.getElementById('kafkaConsumerGroup').value = 'my-consumer-group';

        // Reset Slack fields
        document.getElementById('slackWebhookURL').value = 'slack-webhook-secret';

        // Reset Cron fields
        document.getElementById('cronSchedule').value = '*/5 * * * *';
        document.getElementById('cronData').value = '';
    }

    /**
     * Load event source data into form for editing
     */
    function loadEventSourceIntoForm(eventSourceData) {
        if (!eventSourceData) return;

        document.getElementById('eventSourceName').value = eventSourceData.name;
        document.getElementById('eventSourceNamespace').value = eventSourceData.namespace;
        document.getElementById('eventSourceBroker').value = eventSourceData.broker;

        // Set type radio
        const typeRadio = document.querySelector(`input[name="eventSourceType"][value="${eventSourceData.type}"]`);
        if (typeRadio) {
            typeRadio.checked = true;
            typeRadio.dispatchEvent(new Event('change'));
        }

        // Load type-specific config (event types are now automatically set)
        if (eventSourceData.type === 'github') {
            document.getElementById('githubRepository').value = eventSourceData.config.repository || '';
            document.getElementById('githubAccessTokenSecret').value = eventSourceData.config.accessTokenSecret || '';
        } else if (eventSourceData.type === 'kafka') {
            document.getElementById('kafkaBootstrapServers').value = eventSourceData.config.bootstrapServers || '';
            document.getElementById('kafkaTopics').value = (eventSourceData.config.topics || []).join(',');
            document.getElementById('kafkaConsumerGroup').value = eventSourceData.config.consumerGroup || '';
        } else if (eventSourceData.type === 'slack') {
            document.getElementById('slackWebhookURL').value = eventSourceData.config.webhookURLSecret || '';
        } else if (eventSourceData.type === 'cron') {
            document.getElementById('cronSchedule').value = eventSourceData.config.schedule || '';
            document.getElementById('cronData').value = eventSourceData.config.data || '';
        }
    }

    /**
     * Update event source resource preview
     */
    function updateEventSourceResourcePreview() {
        const formData = collectEventSourceFormData();

        // Basic validation (don't show validation errors during auto-update)
        if (!formData.name || !formData.namespace) {
            eventSourcePlatformView.style.display = 'none';
            return;
        }

        // Show platform view
        eventSourcePlatformView.style.display = 'block';

        // Generate resource (will use type-specific YAML generators)
        const resourceType = `${formData.type}Source`;
        const resource = {
            type: resourceType,
            name: formData.name,
            yaml: generateEventSourceYAML(formData),
            metadata: RESOURCE_METADATA[resourceType] || {
                kind: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}Source`,
                apiVersion: 'sources.knative.dev/v1',
                description: `Produces CloudEvents from ${formData.type} to the ${formData.broker} Broker.`
            }
        };

        // Update platform description
        const typeDisplayName = formData.type.charAt(0).toUpperCase() + formData.type.slice(1);
        eventSourcePlatformDescription.innerHTML = `
            The UI composed <strong>1</strong> Kubernetes resource from your event source configuration.
            <br>
            You created a <strong>${typeDisplayName} Source</strong> that will send CloudEvents to the <strong>${formData.broker}</strong> Broker.
        `;

        // Render resource card
        eventSourceResourceCards.innerHTML = '';
        const card = createResourceCard(resource, formData.name, 0);
        eventSourceResourceCards.appendChild(card);
    }

    /**
     * Show broker form view
     */
    function showBrokerFormView(mode) {
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        // // brokerDetailView.style.display = 'none';
        eventSourceDetailView.style.display = 'none';
        brokersListView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';
        brokerFormView.style.display = 'block';

        if (mode === 'create') {
            brokerFormTitle.textContent = 'Create Broker';
            saveBrokerBtn.textContent = 'Create Broker';
            resetBrokerForm();
        } else if (mode === 'edit') {
            brokerFormTitle.textContent = 'Edit Broker';
            saveBrokerBtn.textContent = 'Save Broker';
            loadBrokerIntoForm(getCurrentEditingBroker());
        }

        // Trigger initial resource preview
        setTimeout(() => {
            updateBrokerResourcePreview();
        }, 100);
    }

    /**
     * Show form view
     */
    function showFormView(mode) {
        listView.style.display = 'none';
        formView.style.display = 'block';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        // // brokerDetailView.style.display = 'none';
        eventSourceDetailView.style.display = 'none';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';

        if (mode === 'create') {
            formTitle.textContent = 'Create Function';
            resetForm();
        } else if (mode === 'edit') {
            formTitle.textContent = 'Edit Function';
            loadFunctionIntoForm(getCurrentEditingFunction());
        }

        // Set button text based on mode
        if (mode === 'edit') {
            createFunctionDirectBtn.textContent = 'Save Function';
        } else {
            createFunctionDirectBtn.textContent = 'Create Function';
        }

        // Trigger initial resource preview after a short delay to let form populate
        setTimeout(() => {
            updateResourcePreview();
        }, 100);
    }

    /**
     * Reset form to default values
     */
    function resetForm() {
        form.reset();
        // Reset to defaults
        document.getElementById('functionName').value = 'my-function';
        document.getElementById('namespace').value = 'default';
        document.getElementById('containerPort').value = '8080';
        document.getElementById('containerImage').value = 'registry.example.com/functions/my-function:latest';
        document.getElementById('shipwrightOutputImage').value = 'registry.example.com/functions/my-function:latest';
        document.getElementById('minReplicaCount').value = '0';
        document.getElementById('maxReplicaCount').value = '10';

        // Reset panels
        noBuildPanel.classList.add('active');
        shipwrightBuildPanel.classList.remove('active');
        s2iBuildPanel.classList.remove('active');
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
        document.getElementById('containerPort').value = functionData.containerPort;
        document.getElementById('minReplicaCount').value = functionData.metricConfig.minReplicaCount;
        document.getElementById('maxReplicaCount').value = functionData.metricConfig.maxReplicaCount;

        // Set build method
        const buildRadio = document.querySelector(`input[name="buildMethod"][value="${functionData.buildMethod}"]`);
        if (buildRadio) {
            buildRadio.checked = true;
            buildRadio.dispatchEvent(new Event('change'));
        }

        // Load build config and image
        if (functionData.buildMethod === 'none') {
            document.getElementById('containerImage').value = functionData.image || '';
        } else if (functionData.buildMethod === 'shipwright') {
            document.getElementById('shipwrightGitURL').value = functionData.buildConfig.gitURL || '';
            document.getElementById('shipwrightGitRevision').value = functionData.buildConfig.gitRevision || 'main';
            document.getElementById('shipwrightStrategy').value = functionData.buildConfig.strategy || 'nodejs';
            document.getElementById('shipwrightOutputImage').value = functionData.buildConfig.outputImage || functionData.image || '';
        } else if (functionData.buildMethod === 's2i') {
            document.getElementById('s2iGitURL').value = functionData.buildConfig.gitURL || '';
            document.getElementById('s2iGitRevision').value = functionData.buildConfig.gitRevision || 'main';
            document.getElementById('s2iBuilderImage').value = functionData.buildConfig.builderImage || 'nodejs:16-ubi8';
            document.getElementById('s2iOutputImageStream').value = functionData.buildConfig.outputImageStream || '';
        }

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
     * Collect broker form data into an object
     */
    function collectBrokerFormData() {
        const formData = {
            name: document.getElementById('brokerName').value.trim(),
            namespace: document.getElementById('brokerNamespace').value.trim(),
            deliveryConfig: {
                retry: parseInt(document.getElementById('brokerRetry').value),
                backoffPolicy: document.getElementById('brokerBackoffPolicy').value,
                backoffDelay: document.getElementById('brokerBackoffDelay').value.trim()
            }
        };

        // If editing, preserve the ID
        const currentEditing = getCurrentEditingBroker();
        if (currentEditing && currentEditing.id) {
            formData.id = currentEditing.id;
        }

        return formData;
    }

    /**
     * Reset broker form to default values
     */
    function resetBrokerForm() {
        document.getElementById('brokerName').value = 'default';
        document.getElementById('brokerNamespace').value = 'default';
        document.getElementById('brokerRetry').value = '3';
        document.getElementById('brokerBackoffPolicy').value = 'exponential';
        document.getElementById('brokerBackoffDelay').value = '1s';
    }

    /**
     * Load broker data into form for editing
     */
    function loadBrokerIntoForm(brokerData) {
        if (!brokerData) return;

        document.getElementById('brokerName').value = brokerData.name;
        document.getElementById('brokerNamespace').value = brokerData.namespace;
        document.getElementById('brokerRetry').value = brokerData.deliveryConfig.retry;
        document.getElementById('brokerBackoffPolicy').value = brokerData.deliveryConfig.backoffPolicy;
        document.getElementById('brokerBackoffDelay').value = brokerData.deliveryConfig.backoffDelay;
    }

    /**
     * Update broker resource preview
     */
    function updateBrokerResourcePreview() {
        const formData = collectBrokerFormData();

        // Basic validation (don't show validation errors during auto-update)
        if (!formData.name || !formData.namespace) {
            brokerPlatformView.style.display = 'none';
            return;
        }

        // Show platform view
        brokerPlatformView.style.display = 'block';

        // Generate resource
        const resource = {
            type: 'broker',
            name: formData.name,
            yaml: generateBrokerYAML(formData),
            metadata: RESOURCE_METADATA.broker
        };

        // Update platform description
        brokerPlatformDescription.innerHTML = `
            The UI composed <strong>1</strong> Kubernetes resource from your broker configuration.
            <br>
            You created a Knative Eventing Broker that will route CloudEvents from Event Sources to Functions.
        `;

        // Render resource card
        brokerResourceCards.innerHTML = '';
        const card = createResourceCard(resource, formData.name, 0);
        brokerResourceCards.appendChild(card);
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
                showDetailView(func);
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
                showDetailView(func);
            });
        });

        // Reset select all checkbox
        selectAllCheckbox.checked = false;
    }

    /**
     * Render brokers list
     */
    function renderBrokersList() {
        const brokers = getBrokers();

        // Update broker count
        brokerCountSpan.textContent = brokers.length;

        // Clear table
        brokersTableBody.innerHTML = '';

        // Show/hide empty state
        if (brokers.length === 0) {
            emptyBrokersState.style.display = 'block';
            return;
        } else {
            emptyBrokersState.style.display = 'none';
        }

        // Render rows
        brokers.forEach(broker => {
            const row = document.createElement('tr');

            // Count event sources and functions using this broker
            const eventSourcesCount = getEventSources().filter(es => es.broker === broker.name).length;
            const functionsCount = getFunctions().filter(f =>
                f.eventSubscriptions && f.eventSubscriptions.some(sub => sub.broker === broker.name)
            ).length;

            row.innerHTML = `
                <td>
                    <a href="#" class="broker-name-link" data-id="${broker.id}">${broker.name}</a>
                </td>
                <td>${broker.namespace}</td>
                <td>${eventSourcesCount}</td>
                <td>${functionsCount}</td>
                <td class="actions-column">
                    <div class="table-actions">
                        <button class="btn-secondary btn-small edit-broker-btn" data-id="${broker.id}">Edit</button>
                        <button class="btn-danger btn-small delete-broker-btn" data-id="${broker.id}">Delete</button>
                    </div>
                </td>
            `;

            brokersTableBody.appendChild(row);
        });

        // Add event listeners for edit/delete buttons and broker name links
        document.querySelectorAll('.edit-broker-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const broker = getBroker(this.dataset.id);
                setCurrentEditingBroker(broker);
                showBrokerFormView('edit');
            });
        });

        document.querySelectorAll('.delete-broker-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const broker = getBroker(this.dataset.id);
                if (confirm(`Are you sure you want to delete broker "${broker.name}"?`)) {
                    deleteBroker(broker.id);
                    renderBrokersList();
                }
            });
        });

        document.querySelectorAll('.broker-name-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const broker = getBroker(this.dataset.id);
                showBrokerDetailView(broker);
            });
        });
    }

    /**
     * Render event sources list
     */
    function renderEventSourcesList() {
        const eventSources = getEventSources();

        // Update event source count
        eventSourceCountSpan.textContent = eventSources.length;

        // Clear table
        eventSourcesTableBody.innerHTML = '';

        // Show/hide empty state
        if (eventSources.length === 0) {
            emptyEventSourcesState.style.display = 'block';
            return;
        } else {
            emptyEventSourcesState.style.display = 'none';
        }

        // Render rows
        eventSources.forEach(eventSource => {
            const row = document.createElement('tr');

            // Format event types
            const eventTypesStr = eventSource.eventTypes.join(', ');

            // Get type display name
            const typeDisplayName = eventSource.type.charAt(0).toUpperCase() + eventSource.type.slice(1);

            row.innerHTML = `
                <td>
                    <a href="#" class="event-source-name-link" data-id="${eventSource.id}">${eventSource.name}</a>
                </td>
                <td>${typeDisplayName}</td>
                <td>${eventSource.broker}</td>
                <td><code style="font-size: 0.85em">${eventTypesStr}</code></td>
                <td class="actions-column">
                    <div class="table-actions">
                        <button class="btn-secondary btn-small edit-event-source-btn" data-id="${eventSource.id}">Edit</button>
                        <button class="btn-danger btn-small delete-event-source-btn" data-id="${eventSource.id}">Delete</button>
                    </div>
                </td>
            `;

            eventSourcesTableBody.appendChild(row);
        });

        // Add event listeners for edit/delete buttons and event source name links
        document.querySelectorAll('.edit-event-source-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const eventSource = getEventSource(this.dataset.id);
                setCurrentEditingEventSource(eventSource);
                showEventSourceFormView('edit');
            });
        });

        document.querySelectorAll('.delete-event-source-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const eventSource = getEventSource(this.dataset.id);
                if (confirm(`Are you sure you want to delete event source "${eventSource.name}"?`)) {
                    deleteEventSource(eventSource.id);
                    renderEventSourcesList();
                }
            });
        });

        document.querySelectorAll('.event-source-name-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const eventSource = getEventSource(this.dataset.id);
                showEventSourceDetailView(eventSource);
            });
        });
    }

    /**
     * Show detail view for a function
     */
    function showDetailView(functionData) {
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'block';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';

        currentDetailFunction = functionData;
        renderDetailView(functionData);

        // Auto-render resources
        renderDetailResources(functionData);
    }

    /**
     * Show subscriptions management view
     */
    function showSubscriptionsView(functionData) {
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'block';
        destinationsView.style.display = 'none';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';

        currentDetailFunction = functionData;
        subscriptionsViewFunctionName.textContent = `Function: ${functionData.name}`;

        // Populate broker dropdown in subscription form
        populateSubscriptionBrokerDropdown();

        renderEventSubscriptions(functionData);
    }

    /**
     * Show destinations management view
     */
    function showDestinationsView(functionData) {
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'block';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';

        currentDetailFunction = functionData;
        destinationsViewFunctionName.textContent = `Function: ${functionData.name}`;

        // Populate broker dropdown in destination form
        populateDestinationBrokerDropdown();

        renderDestination(functionData);
    }

    /**
     * Populate subscription broker dropdown with existing brokers
     */
    function populateSubscriptionBrokerDropdown() {
        const dropdown = document.getElementById('subscriptionBroker');
        const brokers = getBrokers();

        // Clear existing options except first
        dropdown.innerHTML = '<option value="">Select a broker...</option>';

        // Add broker options
        brokers.forEach(broker => {
            const option = document.createElement('option');
            option.value = broker.name;
            option.textContent = `${broker.name} (${broker.namespace})`;
            dropdown.appendChild(option);
        });
    }

    /**
     * Populate destination broker dropdown with existing brokers
     */
    function populateDestinationBrokerDropdown() {
        const dropdown = document.getElementById('destinationBroker');
        const brokers = getBrokers();

        // Clear existing options except first
        dropdown.innerHTML = '<option value="">Select a broker...</option>';

        // Add broker options
        brokers.forEach(broker => {
            const option = document.createElement('option');
            option.value = broker.name;
            option.textContent = `${broker.name} (${broker.namespace})`;
            dropdown.appendChild(option);
        });
    }

    /**
     * Show broker detail view
     */
    function showBrokerDetailView(brokerData) {
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        // // brokerDetailView.style.display = 'block';
        eventSourceDetailView.style.display = 'none';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';

        // Set current editing broker so edit button works
        setCurrentEditingBroker(brokerData);

        renderBrokerDetailView(brokerData);
        renderBrokerDetailResources(brokerData);
    }

    /**
     * Show event source detail view
     */
    function showEventSourceDetailView(eventSourceData) {
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        // // brokerDetailView.style.display = 'none';
        eventSourceDetailView.style.display = 'block';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';

        // Set current editing event source so edit button works
        setCurrentEditingEventSource(eventSourceData);

        renderEventSourceDetailView(eventSourceData);
        renderEventSourceDetailResources(eventSourceData);
    }

    /**
     * Render detail view content
     */
    function renderDetailView(functionData) {
        detailFunctionName.textContent = functionData.name;
        diagramFunctionName.textContent = functionData.name;
        detailNamespace.textContent = functionData.namespace;
        detailImage.textContent = functionData.image;

        // Scaling description
        let scalingDesc = '';
        if (functionData.scalingMetric === 'concurrency') {
            scalingDesc = 'HTTP Concurrency';
        } else if (functionData.scalingMetric === 'requestRate') {
            scalingDesc = 'HTTP Request Rate';
        } else if (functionData.scalingMetric === 'scaledObject') {
            scalingDesc = 'KEDA Triggers';
        }
        detailScaling.textContent = scalingDesc;

        // Networking description
        let networkingDesc = '';
        if (functionData.networkingMethod === 'none') {
            networkingDesc = 'No external access';
        } else if (functionData.networkingMethod === 'gateway') {
            networkingDesc = 'Gateway API';
        } else if (functionData.networkingMethod === 'ingress') {
            networkingDesc = 'Ingress';
        } else if (functionData.networkingMethod === 'route') {
            networkingDesc = 'OpenShift Route';
        }
        detailNetworking.textContent = networkingDesc;

        // Render event sources in diagram
        renderEventSources(functionData);

        // Render sink destinations in diagram
        renderSinkDestinations(functionData);

        // Render event subscriptions summary
        if (!functionData.eventSubscriptions || functionData.eventSubscriptions.length === 0) {
            subscriptionsSummaryText.textContent = 'No event subscriptions configured.';
        } else {
            const count = functionData.eventSubscriptions.length;
            const types = functionData.eventSubscriptions.map(s => s.eventType).join(', ');
            subscriptionsSummaryText.textContent = `${count} subscription${count > 1 ? 's' : ''}: ${types}`;
        }
    }

    /**
     * Render event sources (triggers) in diagram
     */
    function renderEventSources(functionData) {
        eventSourcesList.innerHTML = '';

        if (!functionData.eventSubscriptions || functionData.eventSubscriptions.length === 0) {
            return;
        }

        // Create a source box for each subscription
        functionData.eventSubscriptions.forEach(sub => {
            const sourceBox = document.createElement('div');
            sourceBox.className = 'source-box';

            // Find event sources that produce this event type
            const sources = getEventSources().filter(es =>
                es.eventTypes.includes(sub.eventType)
            );
            const sourceName = sources.length > 0
                ? sources.map(s => `${s.type}: ${s.name}`).join(', ')
                : 'Unknown source';

            sourceBox.innerHTML = `
                <div class="source-icon">⚡</div>
                <div class="source-info">
                    <div class="source-name">${sourceName}</div>
                    <div class="source-details">${sub.eventType}</div>
                </div>
            `;

            eventSourcesList.appendChild(sourceBox);
        });
    }

    /**
     * Render sink destinations in diagram
     */
    function renderSinkDestinations(functionData) {
        destinationsList.innerHTML = '';

        if (!functionData.sinkMethod || functionData.sinkMethod === 'none') {
            return;
        }

        if (functionData.sinkMethod === 'broker' && functionData.sinkConfig && functionData.sinkConfig.broker) {
            const destinationBox = document.createElement('div');
            destinationBox.className = 'destination-box';

            destinationBox.innerHTML = `
                <div class="destination-icon">📨</div>
                <div class="destination-info">
                    <div class="destination-name">${functionData.sinkConfig.broker}</div>
                    <div class="destination-details">Broker (Sink)</div>
                </div>
            `;

            destinationsList.appendChild(destinationBox);
        }
    }

    /**
     * Render resources for detail view
     */
    function renderDetailResources(config) {
        // Generate resources
        const resources = [
            {
                type: 'function',
                name: config.name,
                yaml: generateFunctionYAML(config),
                metadata: RESOURCE_METADATA.function
            }
        ];

        // Add build resource based on selected method
        if (config.buildMethod === 'shipwright') {
            resources.push({
                type: 'shipwrightBuild',
                name: `${config.name}-build`,
                yaml: generateShipwrightBuildYAML(config),
                metadata: RESOURCE_METADATA.shipwrightBuild
            });
        } else if (config.buildMethod === 's2i') {
            resources.push({
                type: 's2iBuildConfig',
                name: `${config.name}-build`,
                yaml: generateS2IBuildConfigYAML(config),
                metadata: RESOURCE_METADATA.s2iBuildConfig
            });
        }

        // Add runtime resources
        resources.push(
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
        );

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
        detailResourceCount.textContent = resources.length;
        const buildPart = config.buildMethod !== 'none' ? `build (${config.buildMethod === 'shipwright' ? 'Shipwright' : 'S2I BuildConfig'}), ` : '';
        const networkingPart = config.networkingMethod !== 'none' ? 'and networking (HTTPRoute/Ingress/Route)' : 'without external networking';
        detailPlatformDescription.innerHTML = `
            The UI composed <strong>${resources.length}</strong> Kubernetes resources from your function configuration.
            <br>
            You created one Function CR, but the platform composed multiple resources: ${buildPart}runtime (Deployment, Service),
            scaling (KEDA), ${networkingPart}.
        `;

        // Render resource cards in detail view
        detailResourceCards.innerHTML = '';
        resources.forEach((resource, index) => {
            const card = createResourceCard(resource, config.name, index);
            detailResourceCards.appendChild(card);
        });
    }

    /**
     * Render event subscriptions list
     */
    function renderEventSubscriptions(functionData) {
        subscriptionsList.innerHTML = '';

        if (!functionData.eventSubscriptions || functionData.eventSubscriptions.length === 0) {
            subscriptionsList.innerHTML = '<div id="emptySubscriptions" class="empty-subscriptions"><p>No event subscriptions configured. Click "Add event subscription" to subscribe to CloudEvents from a Knative Broker.</p></div>';
            return;
        }

        functionData.eventSubscriptions.forEach((sub, index) => {
            // Find event sources that produce this event type
            const sources = getEventSources().filter(es =>
                es.eventTypes.includes(sub.eventType)
            );
            const sourceInfo = sources.length > 0
                ? `Produced by: <strong>${sources.map(s => `${s.type}: ${s.name}`).join(', ')}</strong>`
                : '<em>No known source</em>';

            const subCard = document.createElement('div');
            subCard.className = 'subscription-card';
            subCard.innerHTML = `
                <div class="subscription-info">
                    <div class="subscription-event-type">Event Type: <code>${sub.eventType}</code></div>
                    <div class="subscription-source">${sourceInfo}</div>
                </div>
                <button class="btn-danger btn-small remove-subscription-btn" data-index="${index}">Remove</button>
            `;
            subscriptionsList.appendChild(subCard);
        });

        // Add remove handlers
        document.querySelectorAll('.remove-subscription-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                removeSubscription(index);
            });
        });
    }

    /**
     * Remove event subscription
     */
    function removeSubscription(index) {
        if (confirm('Are you sure you want to remove this event subscription?')) {
            currentDetailFunction.eventSubscriptions.splice(index, 1);
            saveFunction(currentDetailFunction);
            renderEventSubscriptions(currentDetailFunction);
        }
    }

    /**
     * Render destination
     */
    function renderDestination(functionData) {
        destinationDisplay.innerHTML = '';

        if (!functionData.sinkMethod || functionData.sinkMethod === 'none') {
            destinationDisplay.innerHTML = '<div id="emptyDestination" class="empty-subscriptions"><p>No destination configured. Set one below to send output CloudEvents to a Broker.</p></div>';
            return;
        }

        if (functionData.sinkMethod === 'broker' && functionData.sinkConfig && functionData.sinkConfig.broker) {
            const destCard = document.createElement('div');
            destCard.className = 'subscription-card';
            destCard.innerHTML = `
                <div class="subscription-info">
                    <div class="subscription-broker">Broker: <strong>${functionData.sinkConfig.broker}</strong></div>
                </div>
                <button class="btn-danger btn-small remove-destination-btn">Remove</button>
            `;
            destinationDisplay.appendChild(destCard);

            // Add remove handler
            document.querySelector('.remove-destination-btn').addEventListener('click', function() {
                removeDestination();
            });
        }
    }

    /**
     * Remove destination
     */
    function removeDestination() {
        if (confirm('Are you sure you want to remove this destination?')) {
            currentDetailFunction.sinkMethod = 'none';
            currentDetailFunction.sinkConfig = { method: 'none' };
            saveFunction(currentDetailFunction);
            renderDestination(currentDetailFunction);
        }
    }

    /**
     * Render broker detail view content
     */
    function renderBrokerDetailView(brokerData) {
        detailBrokerName.textContent = brokerData.name;
        diagramBrokerName.textContent = brokerData.name;
        detailBrokerNamespace.textContent = brokerData.namespace;
        detailBrokerRetry.textContent = brokerData.deliveryConfig.retry;
        detailBrokerBackoffPolicy.textContent = brokerData.deliveryConfig.backoffPolicy;

        // Get event types from connected event sources
        const eventSources = getEventSources().filter(es => es.broker === brokerData.name);
        const allEventTypes = eventSources.flatMap(es => es.eventTypes);
        const uniqueEventTypes = [...new Set(allEventTypes)];

        if (uniqueEventTypes.length > 0) {
            detailBrokerEventTypes.textContent = uniqueEventTypes.join(', ');
        } else {
            detailBrokerEventTypes.textContent = 'None';
        }

        // Render event sources list
        brokerEventSourcesList.innerHTML = '';
        if (eventSources.length === 0) {
            brokerEventSourcesList.innerHTML = '<p class="empty-list">No event sources connected to this broker.</p>';
        } else {
            eventSources.forEach(source => {
                const sourceBox = document.createElement('div');
                sourceBox.className = 'source-box';
                const typeDisplayName = source.type.charAt(0).toUpperCase() + source.type.slice(1);
                sourceBox.innerHTML = `
                    <div class="source-icon">⚡</div>
                    <div class="source-info">
                        <div class="source-name">${source.name}</div>
                        <div class="source-details">${typeDisplayName} Source</div>
                    </div>
                `;
                brokerEventSourcesList.appendChild(sourceBox);
            });
        }

        // Render subscribed functions list
        brokerFunctionsList.innerHTML = '';
        const functions = getFunctions().filter(f =>
            f.eventSubscriptions && f.eventSubscriptions.some(sub => sub.broker === brokerData.name)
        );

        if (functions.length === 0) {
            brokerFunctionsList.innerHTML = '<p class="empty-list">No functions subscribed to this broker.</p>';
        } else {
            functions.forEach(func => {
                const funcBox = document.createElement('div');
                funcBox.className = 'destination-box';
                funcBox.innerHTML = `
                    <div class="destination-icon">λ</div>
                    <div class="destination-info">
                        <div class="destination-name">${func.name}</div>
                        <div class="destination-details">${func.namespace}</div>
                    </div>
                `;
                brokerFunctionsList.appendChild(funcBox);
            });
        }
    }

    /**
     * Render broker detail resources
     */
    function renderBrokerDetailResources(brokerData) {
        const resource = {
            type: 'broker',
            name: brokerData.name,
            yaml: generateBrokerYAML(brokerData),
            metadata: RESOURCE_METADATA.broker
        };

        brokerDetailResourceCount.textContent = '1';
        brokerDetailPlatformDescription.innerHTML = `
            The UI composed <strong>1</strong> Kubernetes resource from your broker configuration.
            <br>
            This Broker routes CloudEvents from Event Sources to Functions based on event types.
        `;

        brokerDetailResourceCards.innerHTML = '';
        const card = createResourceCard(resource, brokerData.name, 0);
        brokerDetailResourceCards.appendChild(card);
    }

    /**
     * Render event source detail view content
     */
    function renderEventSourceDetailView(eventSourceData) {
        detailEventSourceName.textContent = eventSourceData.name;
        diagramEventSourceName.textContent = eventSourceData.name;
        const typeDisplayName = eventSourceData.type.charAt(0).toUpperCase() + eventSourceData.type.slice(1);
        detailEventSourceType.textContent = typeDisplayName;
        detailEventSourceNamespace.textContent = eventSourceData.namespace;
        detailEventSourceBroker.textContent = eventSourceData.broker;
        detailEventSourceEventTypes.textContent = eventSourceData.eventTypes.join(', ');

        // Render external source
        eventSourceExternalSource.innerHTML = '';
        const externalBox = document.createElement('div');
        externalBox.className = 'source-box';

        let externalSourceName = '';
        if (eventSourceData.type === 'github') {
            externalSourceName = `GitHub: ${eventSourceData.config.repository}`;
        } else if (eventSourceData.type === 'kafka') {
            externalSourceName = `Kafka: ${eventSourceData.config.topics.join(', ')}`;
        } else if (eventSourceData.type === 'slack') {
            externalSourceName = 'Slack Events';
        } else if (eventSourceData.type === 'cron') {
            externalSourceName = `Cron: ${eventSourceData.config.schedule}`;
        }

        externalBox.innerHTML = `
            <div class="source-icon">📡</div>
            <div class="source-info">
                <div class="source-name">${externalSourceName}</div>
                <div class="source-details">External Event Source</div>
            </div>
        `;
        eventSourceExternalSource.appendChild(externalBox);

        // Render target broker
        eventSourceTargetBroker.innerHTML = '';
        const brokerBox = document.createElement('div');
        brokerBox.className = 'destination-box';
        brokerBox.innerHTML = `
            <div class="destination-icon">📨</div>
            <div class="destination-info">
                <div class="destination-name">${eventSourceData.broker}</div>
                <div class="destination-details">Knative Broker</div>
            </div>
        `;
        eventSourceTargetBroker.appendChild(brokerBox);
    }

    /**
     * Render event source detail resources
     */
    function renderEventSourceDetailResources(eventSourceData) {
        const resourceType = `${eventSourceData.type}Source`;
        const resource = {
            type: resourceType,
            name: eventSourceData.name,
            yaml: generateEventSourceYAML(eventSourceData),
            metadata: RESOURCE_METADATA[resourceType] || {
                kind: `${eventSourceData.type.charAt(0).toUpperCase() + eventSourceData.type.slice(1)}Source`,
                apiVersion: 'sources.knative.dev/v1',
                description: `Produces CloudEvents from ${eventSourceData.type} to the ${eventSourceData.broker} Broker.`
            }
        };

        eventSourceDetailResourceCount.textContent = '1';
        const typeDisplayName = eventSourceData.type.charAt(0).toUpperCase() + eventSourceData.type.slice(1);
        eventSourceDetailPlatformDescription.innerHTML = `
            The UI composed <strong>1</strong> Kubernetes resource from your event source configuration.
            <br>
            This ${typeDisplayName} Source produces CloudEvents and sends them to the <strong>${eventSourceData.broker}</strong> Broker.
        `;

        eventSourceDetailResourceCards.innerHTML = '';
        const card = createResourceCard(resource, eventSourceData.name, 0);
        eventSourceDetailResourceCards.appendChild(card);
    }

});
