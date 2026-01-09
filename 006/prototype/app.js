/**
 * Application logic for Function composition UI
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');

    // Views
    const overviewView = document.getElementById('overviewView');
    const listView = document.getElementById('listView');
    const formView = document.getElementById('formView');
    const detailView = document.getElementById('detailView');
    const subscriptionsView = document.getElementById('subscriptionsView');
    const brokerDetailView = document.getElementById('brokerDetailView');
    const eventSourceDetailView = document.getElementById('eventSourceDetailView');
    const brokersListView = document.getElementById('brokersListView');
    const eventSourcesListView = document.getElementById('eventSourcesListView');

    // List elements - Functions
    const functionsTableBody = document.getElementById('functionsTableBody');
    const emptyTableState = document.getElementById('emptyTableState');
    const functionCountSpan = document.getElementById('functionCount');
    const searchInput = document.getElementById('searchInput');
    const selectAllCheckbox = document.getElementById('selectAll');
    const createNewBtn = document.getElementById('createNewBtn');
    const backToListBtn = document.getElementById('backToListBtn');

    // List elements - Brokers
    const brokersTableBody = document.getElementById('brokersTableBody');
    const emptyBrokersState = document.getElementById('emptyBrokersState');
    const brokerCountSpan = document.getElementById('brokerCount');
    const createNewBrokerBtn = document.getElementById('createNewBrokerBtn');

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
    const brokerFormView = document.getElementById('brokerFormView');
    const brokerForm = document.getElementById('brokerForm');
    const brokerFormTitle = document.getElementById('brokerFormTitle');
    const backToBrokersListBtn = document.getElementById('backToBrokersListBtn');
    const saveBrokerBtn = document.getElementById('saveBrokerBtn');
    const brokerPlatformView = document.getElementById('brokerPlatformView');
    const brokerPlatformDescription = document.getElementById('brokerPlatformDescription');
    const brokerResourceCards = document.getElementById('brokerResourceCards');

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

    // Destinations removed - functions only receive events from brokers

    // Broker detail view elements
    const backToBrokersListFromDetailBtn = document.getElementById('backToBrokersListFromDetailBtn');
    const editBrokerFromDetailBtn = document.getElementById('editBrokerFromDetailBtn');
    const detailBrokerName = document.getElementById('detailBrokerName');
    const diagramBrokerName = document.getElementById('diagramBrokerName');
    const detailBrokerNamespace = document.getElementById('detailBrokerNamespace');
    const detailBrokerRetry = document.getElementById('detailBrokerRetry');
    const detailBrokerBackoffPolicy = document.getElementById('detailBrokerBackoffPolicy');
    const detailBrokerEventTypes = document.getElementById('detailBrokerEventTypes');
    const brokerEventSourcesList = document.getElementById('brokerEventSourcesList');
    const brokerFunctionsList = document.getElementById('brokerFunctionsList');
    const brokerDetailResourceCount = document.getElementById('brokerDetailResourceCount');
    const brokerDetailPlatformDescription = document.getElementById('brokerDetailPlatformDescription');
    const brokerDetailResourceCards = document.getElementById('brokerDetailResourceCards');

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
            if (view === 'overview') {
                showOverview();
            } else if (view === 'functions') {
                showFunctionsList();
            } else if (view === 'brokers') {
                showBrokersList();
            } else if (view === 'eventSources') {
                showEventSourcesList();
            } else if (view === 'eventSinks') {
                showEventSinksList();
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

    // Broker navigation handlers
    createNewBrokerBtn.addEventListener('click', function() {
        clearCurrentEditingBroker();
        showBrokerFormView('create');
    });

    backToBrokersListBtn.addEventListener('click', function() {
        showBrokersList();
    });

    saveBrokerBtn.addEventListener('click', function() {
        const brokerData = collectBrokerFormData();

        // Validate
        if (!brokerData.name || !brokerData.namespace) {
            alert('Please fill in all required fields');
            return;
        }

        // Save and show list
        saveBroker(brokerData);
        showBrokersList();
    });

    // Event Source navigation handlers
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

    if (addTriggerBtn) {
        addTriggerBtn.addEventListener('click', function() {
            if (currentDetailFunction) {
                showSubscriptionsView(currentDetailFunction);
            }
        });
    }

    // Broker detail view navigation handlers
    backToBrokersListFromDetailBtn.addEventListener('click', function() {
        showBrokersList();
    });

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

    // Handle event source sink method change
    const eventSourceSinkMethod = document.getElementById('eventSourceSinkMethod');
    const eventSourceBrokerFields = document.getElementById('eventSourceBrokerFields');
    const eventSourceSinkFields = document.getElementById('eventSourceSinkFields');
    const eventSourceFunctionFields = document.getElementById('eventSourceFunctionFields');

    if (eventSourceSinkMethod) {
        eventSourceSinkMethod.addEventListener('change', function() {
            if (this.value === 'broker') {
                eventSourceBrokerFields.style.display = 'block';
                eventSourceSinkFields.style.display = 'none';
                eventSourceFunctionFields.style.display = 'none';
            } else if (this.value === 'sink') {
                eventSourceBrokerFields.style.display = 'none';
                eventSourceSinkFields.style.display = 'block';
                eventSourceFunctionFields.style.display = 'none';
                populateEventSourceSinkDropdown();
            } else if (this.value === 'function') {
                eventSourceBrokerFields.style.display = 'none';
                eventSourceSinkFields.style.display = 'none';
                eventSourceFunctionFields.style.display = 'block';
                populateEventSourceFunctionDropdown();
            }
            updateEventSourceResourcePreview();
        });
    }

    // Handle subscription broker dropdown change
    const subscriptionBroker = document.getElementById('subscriptionBroker');
    if (subscriptionBroker) {
        subscriptionBroker.addEventListener('change', function() {
            populateSubscriptionEventTypeDropdown(this.value);
        });
    }

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

        const broker = document.getElementById('subscriptionBroker').value.trim();
        let eventType = subscriptionEventType.value;

        if (eventType === 'custom') {
            eventType = document.getElementById('customEventType').value.trim();
        }

        if (!broker || !eventType || eventType === '') {
            alert('Please fill in all fields');
            return;
        }

        // Check if this subscription already exists
        const existing = currentDetailFunction.eventSubscriptions.find(
            sub => sub.broker === broker && sub.eventType === eventType
        );

        if (existing) {
            alert('This event subscription already exists');
            return;
        }

        // Add subscription
        currentDetailFunction.eventSubscriptions.push({
            broker: broker,
            eventType: eventType
        });

        // Save to state
        saveFunction(currentDetailFunction);

        // Refresh subscriptions view
        renderEventSubscriptions(currentDetailFunction);

        // Refresh network graph to show new connections
        renderNetworkGraph();

        // Reset form
        subscriptionForm.reset();
        customEventTypeField.style.display = 'none';
    });

    // Destination management removed - functions only receive events from brokers

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

        // If editing, preserve the ID
        const currentEditing = getCurrentEditingFunction();
        if (currentEditing && currentEditing.id) {
            formData.id = currentEditing.id;
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
     * Show overview/network graph view
     */
    function showOverview() {
        hideAllViews();
        overviewView.style.display = 'block';
        renderNetworkGraph();
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
        hideAllViews();
        listView.style.display = 'block';
        renderFunctionsList();
        resetForm();
    }

    /**
     * Show brokers list view
     */
    function showBrokersList() {
        hideAllViews();
        brokersListView.style.display = 'block';
        renderBrokersList();
    }

    /**
     * Show event sources list view
     */
    function showEventSourcesList() {
        hideAllViews();
        eventSourcesListView.style.display = 'block';
        renderEventSourcesList();
    }

    /**
     * Show event source form view
     */
    function showEventSourceFormView(mode) {
        hideAllViews();
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

    // Event source sink/function dropdowns removed - event sources can only send to brokers

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

        // Event sources can only send to brokers
        const broker = document.getElementById('eventSourceBroker').value;
        const sinkMethod = 'broker';
        const sinkConfig = {
            method: 'broker',
            broker: broker
        };

        const formData = {
            name: document.getElementById('eventSourceName').value.trim(),
            namespace: document.getElementById('eventSourceNamespace').value.trim(),
            type: eventSourceType,
            sinkMethod: sinkMethod,
            sinkConfig: sinkConfig,
            broker: broker, // For backward compatibility
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

        // Event sources can only send to brokers
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

        // Event sources can only send to brokers
        document.getElementById('eventSourceBroker').value = eventSourceData.sinkConfig?.broker || eventSourceData.broker || '';

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
        // Event sources can only send to brokers
        const targetValid = formData.sinkConfig.broker;

        if (!formData.name || !formData.namespace || !targetValid) {
            eventSourcePlatformView.style.display = 'none';
            return;
        }

        // Show platform view
        eventSourcePlatformView.style.display = 'block';

        // Generate resource (will use type-specific YAML generators)
        const resourceType = `${formData.type}Source`;

        // Event sources can only send to brokers
        const targetDescription = `<strong>${formData.sinkConfig.broker}</strong> Broker`;

        const resource = {
            type: resourceType,
            name: formData.name,
            yaml: generateEventSourceYAML(formData),
            metadata: RESOURCE_METADATA[resourceType] || {
                kind: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}Source`,
                apiVersion: 'sources.knative.dev/v1',
                description: `Produces CloudEvents from ${formData.type} to ${targetDescription}.`
            }
        };

        // Update platform description
        const typeDisplayName = formData.type.charAt(0).toUpperCase() + formData.type.slice(1);
        eventSourcePlatformDescription.innerHTML = `
            The UI composed <strong>1</strong> Kubernetes resource from your event source configuration.
            <br>
            You created a <strong>${typeDisplayName} Source</strong> that will send CloudEvents to ${targetDescription}.
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
        hideAllViews();
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
        hideAllViews();
        formView.style.display = 'block';

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

    // Store node positions for drag and drop
    let nodePositions = {};

    /**
     * =====================================================================
     * Shared SVG Graph Utilities
     * =====================================================================
     */

    /**
     * Create SVG arrowhead marker definitions
     * @param {string} id - Marker ID
     * @param {string} color - Arrow color
     * @returns {string} SVG marker definition
     */
    function createArrowheadMarker(id, color) {
        return `
            <marker id="${id}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="${color}" />
            </marker>
        `;
    }

    /**
     * Get color scheme for node type
     * @param {string} type - Node type
     * @returns {object} Color configuration
     */
    function getNodeColors(type) {
        const colors = {
            source: { fill: '#E8F5E9', stroke: '#4CAF50', strokeWidth: 2 },
            broker: { fill: '#FFF3E0', stroke: '#FF9800', strokeWidth: 3 },
            function: { fill: '#E3F2FD', stroke: '#2196F3', strokeWidth: 2 },
            sink: { fill: '#F3E5F5', stroke: '#9C27B0', strokeWidth: 2 },
            external: { fill: '#F5F5F5', stroke: '#9E9E9E', strokeWidth: 2 }
        };
        return colors[type] || colors.external;
    }

    /**
     * Get icon for node
     * @param {object} node - Node data
     * @returns {string} Icon character
     */
    function getNodeIcon(node) {
        if (node.type === 'source') return '⚡';
        if (node.type === 'broker') return '📨';
        if (node.type === 'function') return 'λ';
        if (node.type === 'sink') {
            const sinkIcons = {
                'http': '🌐',
                'kafka': '📬',
                'sns': '📡',
                'pubsub': '☁️',
                'eventgrid': '⚡',
                'database': '💾'
            };
            return sinkIcons[node.sinkType] || '📤';
        }
        if (node.type === 'external') {
            if (node.externalType === 'github') return '🐙';
            if (node.externalType === 'kafka') return '📬';
            if (node.externalType === 'slack') return '💬';
            if (node.externalType === 'cron') return '⏰';
            return '🔌';
        }
        return '📦';
    }

    /**
     * Generate SVG path for edge
     * @param {object} edge - Edge data
     * @param {number} arrowPadding - Padding before arrowhead
     * @param {string} graphId - Unique graph ID for marker references
     * @returns {string} SVG path element
     */
    function generateEdgePath(edge, arrowPadding, graphId) {
        const path = edge.curved
            ? `M ${edge.from.x} ${edge.from.y} Q ${edge.from.x + 50} ${edge.from.y - 60}, ${edge.to.x} ${edge.to.y}`
            : `M ${edge.from.x} ${edge.from.y} L ${edge.to.x} ${edge.to.y}`;

        const strokeColor = edge.color || '#999';
        const markerSuffix = graphId ? `-${graphId}` : '';

        // Select appropriate arrowhead based on color
        let markerEnd;
        if (edge.color === '#2196F3') {
            markerEnd = `url(#arrowhead-blue${markerSuffix})`;
        } else if (edge.color === '#4CAF50') {
            markerEnd = `url(#arrowhead-green${markerSuffix})`;
        } else {
            markerEnd = `url(#arrowhead${markerSuffix})`;
        }

        return `<path d="${path}" stroke="${strokeColor}" stroke-width="2" fill="none" marker-end="${markerEnd}" />`;
    }

    /**
     * Generate SVG edge label
     * @param {object} edge - Edge data
     * @param {number} midX - Label X position
     * @param {number} midY - Label Y position
     * @returns {string} SVG text element
     */
    function generateEdgeLabel(edge, midX, midY) {
        if (!edge.label) return '';

        // Split event types by comma and render vertically if needed
        const eventTypes = edge.label.split(', ');
        if (eventTypes.length === 1) {
            return `<text x="${midX}" y="${midY}" class="edge-label" text-anchor="middle">${edge.label}</text>`;
        } else {
            let svg = `<text x="${midX}" y="${midY - (eventTypes.length - 1) * 6}" class="edge-label" text-anchor="middle">`;
            eventTypes.forEach((type, i) => {
                const dy = i === 0 ? 0 : 12;
                svg += `<tspan x="${midX}" dy="${dy}">${type}</tspan>`;
            });
            svg += `</text>`;
            return svg;
        }
    }

    /**
     * Generate SVG node (box with icon, name, type)
     * @param {object} node - Node data
     * @param {number} nodeWidth - Node width
     * @param {number} nodeHeight - Node height
     * @param {string} clickHandler - JavaScript click handler code
     * @returns {string} SVG group element
     */
    function generateNodeSVG(node, nodeWidth, nodeHeight, clickHandler) {
        const color = getNodeColors(node.type);
        const icon = getNodeIcon(node);
        const cursor = clickHandler ? 'pointer' : 'default';
        const clickableClass = clickHandler ? 'clickable' : '';

        let svg = `<g class="graph-node ${clickableClass}" data-node-id="${node.nodeId}" style="cursor: ${cursor};"`;
        if (clickHandler) {
            svg += ` onclick="${clickHandler}"`;
        }
        svg += `>`;

        // Node box
        svg += `
            <rect class="node-rect" x="${node.x}" y="${node.y}" width="${nodeWidth}" height="${nodeHeight}"
                  fill="${color.fill}" stroke="${color.stroke}" stroke-width="${color.strokeWidth}"
                  rx="8" />
        `;

        // Icon
        svg += `
            <text x="${node.x + nodeWidth / 2}" y="${node.y + 35}"
                  class="node-icon" text-anchor="middle" font-size="24">${icon}</text>
        `;

        // Node name
        const name = node.name.length > 20 ? node.name.substring(0, 18) + '...' : node.name;
        svg += `
            <text x="${node.x + nodeWidth / 2}" y="${node.y + 60}"
                  class="node-text" text-anchor="middle" font-size="14" font-weight="500" fill="#333">
                ${name}
            </text>
        `;

        // Node type label
        svg += `
            <text x="${node.x + nodeWidth / 2}" y="${node.y + 75}"
                  class="node-type-text" text-anchor="middle" font-size="11" fill="#666" text-transform="uppercase">
                ${node.type}
            </text>
        `;

        svg += `</g>`;
        return svg;
    }

    /**
     * Consolidate edges between same source and target
     * @param {Array} edges - Raw edge list
     * @returns {Array} Consolidated edges with merged labels
     */
    function consolidateEdges(edges) {
        const edgeMap = new Map();

        edges.forEach(edge => {
            const key = `${edge.fromId}-${edge.toId}`;

            if (edgeMap.has(key)) {
                // Merge labels
                const existing = edgeMap.get(key);
                if (edge.label && !existing.labels.includes(edge.label)) {
                    existing.labels.push(edge.label);
                }
            } else {
                edgeMap.set(key, {
                    ...edge,
                    labels: edge.label ? [edge.label] : []
                });
            }
        });

        // Convert back to array with comma-separated labels
        return Array.from(edgeMap.values()).map(edge => ({
            ...edge,
            label: edge.labels.join(', ')
        }));
    }

    /**
     * Setup drag-and-drop for SVG graph
     * @param {string} svgId - SVG element ID
     * @param {function} onDragEnd - Callback after drag completes
     */
    function setupGraphDragAndDrop(svgId, onDragEnd) {
        const svg = document.getElementById(svgId);
        if (!svg) return;

        let selectedNode = null;
        let offset = { x: 0, y: 0 };
        let textOffsets = [];
        let dragStartPos = { x: 0, y: 0 };
        let hasDragged = false;

        svg.addEventListener('click', function(e) {
            const target = e.target.closest('.graph-node');
            if (target) {
                // Prevent default click behavior - we'll handle it in mouseup
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);

        svg.addEventListener('mousedown', function(e) {
            const target = e.target.closest('.graph-node');
            if (!target) return;

            e.preventDefault();
            selectedNode = target;
            hasDragged = false;

            // Get SVG coordinates
            const svgRect = svg.getBoundingClientRect();
            const svgX = e.clientX - svgRect.left;
            const svgY = e.clientY - svgRect.top;

            dragStartPos = { x: svgX, y: svgY };

            // Get current node position from the rect element
            const rect = target.querySelector('.node-rect');
            const nodeX = parseFloat(rect.getAttribute('x'));
            const nodeY = parseFloat(rect.getAttribute('y'));

            offset.x = svgX - nodeX;
            offset.y = svgY - nodeY;

            // Store text element offsets
            const texts = target.querySelectorAll('text');
            textOffsets = Array.from(texts).map(text => ({
                x: parseFloat(text.getAttribute('x')) - nodeX,
                y: parseFloat(text.getAttribute('y')) - nodeY
            }));

            selectedNode.style.opacity = '0.7';
        });

        svg.addEventListener('mousemove', function(e) {
            if (!selectedNode) return;

            e.preventDefault();

            // Get SVG coordinates
            const svgRect = svg.getBoundingClientRect();
            const svgX = e.clientX - svgRect.left;
            const svgY = e.clientY - svgRect.top;

            // Check if moved more than 5px (disambiguate click vs drag)
            const dx = svgX - dragStartPos.x;
            const dy = svgY - dragStartPos.y;
            if (Math.sqrt(dx * dx + dy * dy) > 5) {
                hasDragged = true;
            }

            const newX = svgX - offset.x;
            const newY = svgY - offset.y;

            // Update position in nodePositions for final render
            const nodeId = selectedNode.getAttribute('data-node-id');
            nodePositions[nodeId] = { x: newX, y: newY };

            // Update node position directly in DOM (without re-rendering)
            const rect = selectedNode.querySelector('.node-rect');
            if (!rect) return;

            rect.setAttribute('x', newX);
            rect.setAttribute('y', newY);

            // Update text positions
            const texts = selectedNode.querySelectorAll('text');
            texts.forEach((text, i) => {
                if (textOffsets[i]) {
                    text.setAttribute('x', newX + textOffsets[i].x);
                    text.setAttribute('y', newY + textOffsets[i].y);
                }
            });
        });

        svg.addEventListener('mouseup', function(e) {
            if (!selectedNode) return;

            e.preventDefault();
            e.stopPropagation();

            const nodeId = selectedNode.getAttribute('data-node-id');

            // If this was just a click (not a drag), trigger the onclick handler
            if (!hasDragged) {
                const onclickAttr = selectedNode.getAttribute('onclick');
                if (onclickAttr) {
                    // Execute the onclick handler
                    try {
                        eval(onclickAttr);
                    } catch (err) {
                        console.error('Error executing onclick:', err);
                    }
                }
            }

            // Position already stored in nodePositions during mousemove
            selectedNode.style.opacity = '1';
            selectedNode = null;

            // Final render to ensure everything is clean (opacity restored, etc.)
            if (hasDragged && onDragEnd) {
                onDragEnd();
            }
            hasDragged = false;
        });

        svg.addEventListener('mouseleave', function(e) {
            if (selectedNode) {
                selectedNode.style.opacity = '1';
                selectedNode = null;

                // Final render if we were dragging
                if (hasDragged && onDragEnd) {
                    onDragEnd();
                }
                hasDragged = false;
            }
        });
    }

    /**
     * Render network graph showing event flow using SVG
     */
    function renderNetworkGraph() {
        const graphContainer = document.getElementById('networkGraph');
        if (!graphContainer) return;

        const eventSources = getEventSources();
        const brokers = getBrokers();
        const functions = getFunctions();
        const eventSinks = getEventSinks();

        // Calculate dimensions
        const nodeWidth = 160;
        const nodeHeight = 90;
        const horizontalGap = 250;
        const verticalGap = 120;
        const padding = 60;

        // Calculate total height needed for each column
        const sourcesHeight = eventSources.length * (nodeHeight + verticalGap);
        const brokersHeight = brokers.length * (nodeHeight + verticalGap);
        const functionsHeight = functions.length * (nodeHeight + verticalGap);
        const sinksHeight = eventSinks.length * (nodeHeight + verticalGap);

        const totalHeight = Math.max(sourcesHeight, brokersHeight, functionsHeight, sinksHeight, 500);
        const svgHeight = totalHeight + 2 * padding;

        // Broker is centerpiece - calculate its position first
        const brokerX = padding + nodeWidth + horizontalGap; // Center column
        const brokerStartY = (svgHeight - brokersHeight) / 2;

        // Position nodes in columns with broker as center
        const columns = {
            sources: { x: padding, nodes: [] },
            brokers: { x: brokerX, nodes: [] },
            functions: { x: brokerX + nodeWidth + horizontalGap, nodes: [] },
            sinks: { x: brokerX + 2 * (nodeWidth + horizontalGap), nodes: [] }
        };

        // Calculate width: ensure we include the rightmost sink node
        const sinksX = columns.sinks.x;
        const svgWidth = sinksX + nodeWidth + padding;

        // Position brokers (centerpiece) - centered vertically
        brokers.forEach((broker, i) => {
            const defaultX = columns.brokers.x;
            const defaultY = brokerStartY + i * (nodeHeight + verticalGap);
            const nodeId = `broker-${broker.id}`;

            columns.brokers.nodes.push({
                ...broker,
                nodeId: nodeId,
                x: nodePositions[nodeId]?.x ?? defaultX,
                y: nodePositions[nodeId]?.y ?? defaultY,
                type: 'broker'
            });
        });

        // Position event sources (left) - centered vertically
        const sourcesStartY = (svgHeight - sourcesHeight) / 2;
        eventSources.forEach((source, i) => {
            const defaultX = columns.sources.x;
            const defaultY = sourcesStartY + i * (nodeHeight + verticalGap);
            const nodeId = `source-${source.id}`;

            columns.sources.nodes.push({
                ...source,
                nodeId: nodeId,
                x: nodePositions[nodeId]?.x ?? defaultX,
                y: nodePositions[nodeId]?.y ?? defaultY,
                type: 'source',
                sourceType: source.type
            });
        });

        // Position functions (right of broker) - centered vertically
        const functionsStartY = (svgHeight - functionsHeight) / 2;
        functions.forEach((func, i) => {
            const defaultX = columns.functions.x;
            const defaultY = functionsStartY + i * (nodeHeight + verticalGap);
            const nodeId = `function-${func.id}`;

            columns.functions.nodes.push({
                ...func,
                nodeId: nodeId,
                x: nodePositions[nodeId]?.x ?? defaultX,
                y: nodePositions[nodeId]?.y ?? defaultY,
                type: 'function'
            });
        });

        // Position event sinks (far right) - centered vertically
        const sinksStartY = (svgHeight - sinksHeight) / 2;
        eventSinks.forEach((sink, i) => {
            const defaultX = columns.sinks.x;
            const defaultY = sinksStartY + i * (nodeHeight + verticalGap);
            const nodeId = `sink-${sink.id}`;

            columns.sinks.nodes.push({
                ...sink,
                nodeId: nodeId,
                x: nodePositions[nodeId]?.x ?? defaultX,
                y: nodePositions[nodeId]?.y ?? defaultY,
                type: 'sink',
                sinkType: sink.type
            });
        });

        // Create SVG with viewBox for proper scaling
        let svg = `<svg id="networkGraphSvg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Add arrowhead marker definitions
        svg += `
            <defs>
                <marker id="arrowhead-network" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#999" />
                </marker>
                <marker id="arrowhead-blue-network" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#2196F3" />
                </marker>
                <marker id="arrowhead-green-network" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#4CAF50" />
                </marker>
            </defs>
        `;

        // Draw edges first (so they appear behind nodes)
        const edges = [];
        const arrowPadding = 15; // Space to leave before node edge for arrowhead visibility

        // Source → Broker edges (left-to-right, incoming to broker)
        columns.sources.nodes.forEach(source => {
            if (source.sinkMethod === 'broker' && source.sinkConfig) {
                const targetBroker = columns.brokers.nodes.find(b => b.name === source.sinkConfig.broker);
                if (targetBroker) {
                    edges.push({
                        from: { x: source.x + nodeWidth, y: source.y + nodeHeight / 2 },
                        to: { x: targetBroker.x - arrowPadding, y: targetBroker.y + nodeHeight / 2 },
                        label: source.eventTypes ? source.eventTypes.join(', ') : '',
                        direction: 'outgoing' // left-to-right
                    });
                }
            }
        });

        // Broker → Function edges (subscriptions, left-to-right, incoming to function)
        columns.functions.nodes.forEach(func => {
            if (func.eventSubscriptions) {
                func.eventSubscriptions.forEach(sub => {
                    const sourceBroker = columns.brokers.nodes.find(b => b.name === sub.broker);
                    if (sourceBroker) {
                        edges.push({
                            from: { x: sourceBroker.x + nodeWidth, y: sourceBroker.y + nodeHeight / 2 },
                            to: { x: func.x - arrowPadding, y: func.y + nodeHeight / 2 },
                            label: sub.eventType,
                            direction: 'outgoing' // left-to-right
                        });
                    }
                });
            }
        });

        // Broker → Event Sink edges (subscriptions, left-to-right, incoming to sink)
        columns.sinks.nodes.forEach(sink => {
            if (sink.eventSubscriptions) {
                sink.eventSubscriptions.forEach(sub => {
                    const sourceBroker = columns.brokers.nodes.find(b => b.name === sub.broker);
                    if (sourceBroker) {
                        edges.push({
                            from: { x: sourceBroker.x + nodeWidth, y: sourceBroker.y + nodeHeight / 2 },
                            to: { x: sink.x - arrowPadding, y: sink.y + nodeHeight / 2 },
                            label: sub.eventType,
                            direction: 'outgoing' // left-to-right
                        });
                    }
                });
            }
        });

        // Function → Broker reply edges (right-to-left, reply CloudEvents)
        // Offset vertically to avoid collision with incoming edges
        const verticalOffset = 20;
        columns.functions.nodes.forEach(func => {
            if (func.eventSubscriptions) {
                func.eventSubscriptions.forEach(sub => {
                    if (sub.replyEventType) {
                        const targetBroker = columns.brokers.nodes.find(b => b.name === sub.broker);
                        if (targetBroker) {
                            edges.push({
                                from: { x: func.x, y: func.y + nodeHeight / 2 + verticalOffset },
                                to: { x: targetBroker.x + nodeWidth + arrowPadding, y: targetBroker.y + nodeHeight / 2 + verticalOffset },
                                label: sub.replyEventType,
                                direction: 'incoming', // right-to-left
                                color: '#4CAF50' // Green for replies
                            });
                        }
                    }
                });
            }
        });

        // Draw edges
        edges.forEach(edge => {
            const path = edge.curved
                ? `M ${edge.from.x} ${edge.from.y} Q ${edge.from.x + 50} ${edge.from.y - 60}, ${edge.to.x} ${edge.to.y}`
                : `M ${edge.from.x} ${edge.from.y} L ${edge.to.x} ${edge.to.y}`;

            const strokeColor = edge.color || '#999';
            // Select appropriate arrowhead based on color
            let markerEnd;
            if (edge.color === '#2196F3') {
                markerEnd = 'url(#arrowhead-blue-network)';
            } else if (edge.color === '#4CAF50') {
                markerEnd = 'url(#arrowhead-green-network)';
            } else {
                markerEnd = 'url(#arrowhead-network)';
            }
            svg += `<path d="${path}" stroke="${strokeColor}" stroke-width="2" fill="none" marker-end="${markerEnd}" />`;

            // Add label with different offsets for outgoing vs incoming
            if (edge.label) {
                const midX = (edge.from.x + edge.to.x) / 2;
                // Outgoing (left-to-right): label above the line (negative offset)
                // Incoming (right-to-left): label below the line (positive offset)
                const verticalOffset = edge.direction === 'incoming' ? 15 : -10;
                const midY = (edge.from.y + edge.to.y) / 2 + verticalOffset;

                // Split event types by comma and render vertically
                const eventTypes = edge.label.split(', ');
                if (eventTypes.length === 1) {
                    svg += `<text x="${midX}" y="${midY}" class="edge-label" text-anchor="middle">${edge.label}</text>`;
                } else {
                    // Multiple event types - render vertically
                    svg += `<text x="${midX}" y="${midY - (eventTypes.length - 1) * 6}" class="edge-label" text-anchor="middle">`;
                    eventTypes.forEach((type, i) => {
                        const dy = i === 0 ? 0 : 12;
                        svg += `<tspan x="${midX}" dy="${dy}">${type}</tspan>`;
                    });
                    svg += `</text>`;
                }
            }
        });

        // Draw nodes
        const allNodes = [
            ...columns.sources.nodes,
            ...columns.brokers.nodes,
            ...columns.functions.nodes,
            ...columns.sinks.nodes
        ];

        allNodes.forEach(node => {
            const colors = {
                source: { fill: '#E8F5E9', stroke: '#4CAF50', strokeWidth: 2 },
                broker: { fill: '#FFF3E0', stroke: '#FF9800', strokeWidth: 3 }, // Thicker stroke for broker
                function: { fill: '#E3F2FD', stroke: '#2196F3', strokeWidth: 2 },
                sink: { fill: '#F3E5F5', stroke: '#9C27B0', strokeWidth: 2 }
            };

            const color = colors[node.type];
            const isBroker = node.type === 'broker';

            // Get icon based on node type
            let icon = '📦';
            if (node.type === 'source') {
                icon = node.sourceType === 'github' ? '🐙' :
                       node.sourceType === 'kafka' ? '📨' :
                       node.sourceType === 'slack' ? '💬' :
                       node.sourceType === 'cron' ? '⏰' : '📡';
            } else if (node.type === 'broker') {
                icon = '🔀';
            } else if (node.type === 'function') {
                icon = 'λ';
            } else if (node.type === 'sink') {
                icon = node.sinkType === 'http' ? '🌐' :
                       node.sinkType === 'kafka' ? '📨' :
                       node.sinkType === 's3' ? '🪣' : '📦';
            }

            const clickHandler = node.type === 'source' ? `window.viewEventSourceDetails('${node.id}')` :
                               node.type === 'broker' ? `window.viewBrokerDetails('${node.id}')` :
                               node.type === 'function' ? `window.viewFunctionDetails('${node.id}')` :
                               `window.viewEventSinkDetails('${node.id}')`;

            // Add drop shadow for broker (centerpiece)
            const shadow = isBroker ? 'filter="drop-shadow(0 4px 8px rgba(255, 152, 0, 0.3))"' : '';

            svg += `
                <g class="graph-node draggable-node" data-node-id="${node.nodeId}" ${shadow} style="cursor: move;">
                    <rect class="node-rect" x="${node.x}" y="${node.y}" width="${nodeWidth}" height="${nodeHeight}"
                          rx="8" fill="${color.fill}" stroke="${color.stroke}" stroke-width="${color.strokeWidth}"/>
                    <text x="${node.x + nodeWidth/2}" y="${node.y + 35}" class="node-icon" text-anchor="middle">${icon}</text>
                    <text x="${node.x + nodeWidth/2}" y="${node.y + 58}" class="node-text" text-anchor="middle">${node.name}</text>
                    <text x="${node.x + nodeWidth/2}" y="${node.y + 75}" class="node-type-text" text-anchor="middle">${node.type}</text>
                </g>
            `;
        });

        svg += '</svg>';

        // Add legend
        svg += `
            <div class="graph-legend">
                <div class="legend-item">
                    <div class="legend-icon event-source"></div>
                    <div class="legend-label">Event Source</div>
                </div>
                <div class="legend-item">
                    <div class="legend-icon broker"></div>
                    <div class="legend-label">Broker</div>
                </div>
                <div class="legend-item">
                    <div class="legend-icon function"></div>
                    <div class="legend-label">Function</div>
                </div>
                <div class="legend-item">
                    <div class="legend-icon event-sink"></div>
                    <div class="legend-label">Event Sink</div>
                </div>
            </div>
        `;

        graphContainer.innerHTML = svg;

        // Add drag and drop functionality
        setupGraphDragAndDrop('networkGraphSvg', renderNetworkGraph);
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
        hideAllViews();
        detailView.style.display = 'block';

        currentDetailFunction = functionData;
        renderDetailView(functionData);

        // Auto-render resources
        renderDetailResources(functionData);
    }

    /**
     * Show subscriptions management view
     */
    function showSubscriptionsView(functionData) {
        hideAllViews();
        subscriptionsView.style.display = 'block';

        currentDetailFunction = functionData;
        subscriptionsViewFunctionName.textContent = `Function: ${functionData.name}`;

        // Populate broker dropdown in subscription form
        populateSubscriptionBrokerDropdown();

        // Initialize event type dropdown to disabled state
        populateSubscriptionEventTypeDropdown(null);

        renderEventSubscriptions(functionData);
    }

    /**
     * Show destinations management view
     */
    // showDestinationsView() removed - functions only receive events from brokers

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
     * Populate event type dropdown based on selected broker
     */
    function populateSubscriptionEventTypeDropdown(brokerName) {
        const dropdown = document.getElementById('subscriptionEventType');

        if (!brokerName) {
            dropdown.innerHTML = '<option value="">Select a broker first...</option>';
            dropdown.disabled = true;
            return;
        }

        // Get all event sources connected to this broker
        const eventSources = getEventSources().filter(es => es.broker === brokerName);

        // Collect all event types from these sources
        const eventTypesSet = new Set();
        eventSources.forEach(es => {
            es.eventTypes.forEach(type => eventTypesSet.add(type));
        });

        const eventTypes = Array.from(eventTypesSet).sort();

        // Clear and populate dropdown
        dropdown.innerHTML = '<option value="">Select an event type...</option>';

        if (eventTypes.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No event types available from this broker';
            option.disabled = true;
            dropdown.appendChild(option);
            dropdown.disabled = true;
        } else {
            eventTypes.forEach(eventType => {
                const option = document.createElement('option');
                option.value = eventType;
                option.textContent = eventType;
                dropdown.appendChild(option);
            });

            // Add "custom" option for advanced users
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Custom event type...';
            dropdown.appendChild(customOption);

            dropdown.disabled = false;
        }
    }

    // populateDestinationBrokerDropdown() removed - functions only receive events from brokers

    /**
     * Show broker detail view
     */
    function showBrokerDetailView(brokerData) {
        hideAllViews();
        brokerDetailView.style.display = 'block';

        // Set current editing broker so edit button works
        setCurrentEditingBroker(brokerData);

        renderBrokerDetailView(brokerData);
        renderBrokerDetailResources(brokerData);
    }

    /**
     * Show event source detail view
     */
    function showEventSourceDetailView(eventSourceData) {
        hideAllViews();
        eventSourceDetailView.style.display = 'block';

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

        // Render interactive graph
        renderFunctionDetailGraph(functionData);

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
     * =====================================================================
     * Detail View SVG Graph Renderers
     * =====================================================================
     */

    /**
     * Render function detail view diagram as interactive SVG
     * Layout: [Brokers] → [Function]
     */
    function renderFunctionDetailGraph(functionData) {
        const container = document.getElementById('functionDetailGraphContainer');
        if (!container) return;

        const config = {
            nodeWidth: 180,
            nodeHeight: 100,
            horizontalGap: 200,
            verticalGap: 120,
            padding: 40
        };

        // Extract broker nodes from subscriptions
        const brokerMap = new Map();
        if (functionData.eventSubscriptions) {
            functionData.eventSubscriptions.forEach(sub => {
                if (!brokerMap.has(sub.broker)) {
                    const broker = getBrokers().find(b => b.name === sub.broker);
                    if (broker) {
                        brokerMap.set(sub.broker, {
                            ...broker,
                            eventTypes: [],
                            replyEventTypes: []
                        });
                    }
                }
                if (brokerMap.has(sub.broker)) {
                    brokerMap.get(sub.broker).eventTypes.push(sub.eventType);
                    if (sub.replyEventType) {
                        brokerMap.get(sub.broker).replyEventTypes.push(sub.replyEventType);
                    }
                }
            });
        }

        const brokers = Array.from(brokerMap.values());

        // Calculate dimensions
        const brokersHeight = brokers.length * (config.nodeHeight + config.verticalGap);
        const svgHeight = Math.max(brokersHeight, 400) + 2 * config.padding;
        const svgWidth = config.padding + config.nodeWidth + config.horizontalGap + config.nodeWidth + config.padding;

        // Position nodes
        const brokerX = config.padding;
        const functionX = config.padding + config.nodeWidth + config.horizontalGap;
        const brokerStartY = (svgHeight - brokersHeight) / 2;
        const functionY = svgHeight / 2 - config.nodeHeight / 2;

        const nodes = [];
        const edges = [];
        const arrowPadding = 15;

        // Calculate function position FIRST (so edges can use it)
        const functionNodeId = `function-detail-${functionData.id}-center`;
        const functionPos = nodePositions[functionNodeId] || { x: functionX, y: functionY };

        // Position brokers (left)
        brokers.forEach((broker, i) => {
            const defaultY = brokerStartY + i * (config.nodeHeight + config.verticalGap);
            const nodeId = `function-detail-${functionData.id}-broker-${broker.id}`;
            const pos = nodePositions[nodeId] || { x: brokerX, y: defaultY };

            nodes.push({
                ...broker,
                nodeId: nodeId,
                x: pos.x,
                y: pos.y,
                type: 'broker'
            });

            // Create edge from broker to function (using functionPos from nodePositions)
            edges.push({
                fromId: nodeId,
                toId: `function-detail-${functionData.id}-center`,
                from: { x: pos.x + config.nodeWidth, y: pos.y + config.nodeHeight / 2 },
                to: { x: functionPos.x - arrowPadding, y: functionPos.y + config.nodeHeight / 2 },
                label: broker.eventTypes.join(', '),
                direction: 'incoming'
            });

            // Create reply edge from function to broker (if function sends replies)
            // Offset vertically to avoid collision with incoming edge
            if (broker.replyEventTypes && broker.replyEventTypes.length > 0) {
                const verticalOffset = 20;
                edges.push({
                    fromId: `function-detail-${functionData.id}-center`,
                    toId: nodeId,
                    from: { x: functionPos.x, y: functionPos.y + config.nodeHeight / 2 + verticalOffset },
                    to: { x: pos.x + config.nodeWidth + arrowPadding, y: pos.y + config.nodeHeight / 2 + verticalOffset },
                    label: broker.replyEventTypes.join(', '),
                    direction: 'outgoing',
                    color: '#4CAF50'  // Green color for reply edges
                });
            }
        });

        // Position function (right)
        nodes.push({
            ...functionData,
            nodeId: functionNodeId,
            x: functionPos.x,
            y: functionPos.y,
            type: 'function'
        });

        // Consolidate edges
        const consolidatedEdges = consolidateEdges(edges);

        // Generate SVG
        let svg = `<svg id="functionDetailGraphSvg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Add marker definitions
        svg += '<defs>';
        svg += createArrowheadMarker('arrowhead-function-detail', '#999');
        svg += createArrowheadMarker('arrowhead-blue-function-detail', '#2196F3');
        svg += createArrowheadMarker('arrowhead-green-function-detail', '#4CAF50');
        svg += '</defs>';

        // Draw edges
        consolidatedEdges.forEach(edge => {
            svg += generateEdgePath(edge, arrowPadding, 'function-detail');
            const midX = (edge.from.x + edge.to.x) / 2;
            const midY = (edge.from.y + edge.to.y) / 2 - 10;
            svg += generateEdgeLabel(edge, midX, midY);
        });

        // Draw nodes
        nodes.forEach(node => {
            let clickHandler = '';
            if (node.type === 'broker') {
                clickHandler = `showBrokerDetailView(getBroker('${node.id}'))`;
            }
            svg += generateNodeSVG(node, config.nodeWidth, config.nodeHeight, clickHandler);
        });

        svg += '</svg>';

        container.innerHTML = svg;

        // Setup drag-and-drop
        setupGraphDragAndDrop('functionDetailGraphSvg', () => renderFunctionDetailGraph(functionData));
    }

    /**
     * Render event source detail view diagram as interactive SVG
     * Layout: [External Source] → [Event Source] → [Broker]
     */
    function renderEventSourceDetailGraph(eventSourceData) {
        const container = document.getElementById('eventSourceDetailGraphContainer');
        if (!container) return;

        const config = {
            nodeWidth: 180,
            nodeHeight: 100,
            horizontalGap: 200,
            padding: 40
        };

        // Calculate dimensions for 3-column layout
        const svgHeight = config.nodeHeight + 2 * config.padding;
        const svgWidth = config.padding + (config.nodeWidth + config.horizontalGap) * 2 + config.nodeWidth + config.padding;

        // Position nodes in 3 columns
        const externalX = config.padding;
        const eventSourceX = config.padding + config.nodeWidth + config.horizontalGap;
        const brokerX = eventSourceX + config.nodeWidth + config.horizontalGap;
        const centerY = config.padding;

        const nodes = [];
        const edges = [];
        const arrowPadding = 15;

        // External source node (left, synthetic node)
        const externalSourceType = eventSourceData.type;
        const externalNodeId = `eventsource-detail-${eventSourceData.id}-external`;
        const externalPos = nodePositions[externalNodeId] || { x: externalX, y: centerY };

        let externalName = '';
        if (eventSourceData.type === 'github') {
            externalName = eventSourceData.config.repository;
        } else if (eventSourceData.type === 'kafka') {
            externalName = eventSourceData.config.topics;
        } else if (eventSourceData.type === 'slack') {
            externalName = 'Slack Webhook';
        } else if (eventSourceData.type === 'cron') {
            externalName = eventSourceData.config.schedule;
        } else {
            externalName = eventSourceData.type;
        }

        nodes.push({
            name: externalName,
            nodeId: externalNodeId,
            x: externalPos.x,
            y: externalPos.y,
            type: 'external',
            externalType: externalSourceType
        });

        // Event source node (center)
        const eventSourceNodeId = `eventsource-detail-${eventSourceData.id}-center`;
        const eventSourcePos = nodePositions[eventSourceNodeId] || { x: eventSourceX, y: centerY };
        nodes.push({
            ...eventSourceData,
            nodeId: eventSourceNodeId,
            x: eventSourcePos.x,
            y: eventSourcePos.y,
            type: 'source'
        });

        // Broker node (right)
        const broker = getBrokers().find(b => b.name === eventSourceData.sinkConfig.broker);
        if (broker) {
            const brokerNodeId = `eventsource-detail-${eventSourceData.id}-broker-${broker.id}`;
            const brokerPos = nodePositions[brokerNodeId] || { x: brokerX, y: centerY };
            nodes.push({
                ...broker,
                nodeId: brokerNodeId,
                x: brokerPos.x,
                y: brokerPos.y,
                type: 'broker'
            });

            // Edge: Event Source → Broker
            edges.push({
                fromId: eventSourceNodeId,
                toId: brokerNodeId,
                from: { x: eventSourcePos.x + config.nodeWidth, y: eventSourcePos.y + config.nodeHeight / 2 },
                to: { x: brokerPos.x - arrowPadding, y: brokerPos.y + config.nodeHeight / 2 },
                label: eventSourceData.eventTypes ? eventSourceData.eventTypes.join(', ') : '',
                direction: 'outgoing'
            });
        }

        // Edge: External → Event Source (no label)
        edges.push({
            fromId: externalNodeId,
            toId: eventSourceNodeId,
            from: { x: externalPos.x + config.nodeWidth, y: externalPos.y + config.nodeHeight / 2 },
            to: { x: eventSourcePos.x - arrowPadding, y: eventSourcePos.y + config.nodeHeight / 2 },
            label: '',
            direction: 'outgoing'
        });

        // Generate SVG
        let svg = `<svg id="eventSourceDetailGraphSvg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

        svg += '<defs>';
        svg += createArrowheadMarker('arrowhead-eventsource-detail', '#999');
        svg += createArrowheadMarker('arrowhead-blue-eventsource-detail', '#2196F3');
        svg += '</defs>';

        // Draw edges
        edges.forEach(edge => {
            svg += generateEdgePath(edge, arrowPadding, 'eventsource-detail');
            if (edge.label) {
                const midX = (edge.from.x + edge.to.x) / 2;
                const midY = (edge.from.y + edge.to.y) / 2 - 10;
                svg += generateEdgeLabel(edge, midX, midY);
            }
        });

        // Draw nodes
        nodes.forEach(node => {
            let clickHandler = '';
            if (node.type === 'broker') {
                clickHandler = `showBrokerDetailView(getBroker('${node.id}'))`;
            }
            svg += generateNodeSVG(node, config.nodeWidth, config.nodeHeight, clickHandler);
        });

        svg += '</svg>';
        container.innerHTML = svg;

        // Setup drag-and-drop
        setupGraphDragAndDrop('eventSourceDetailGraphSvg', () => renderEventSourceDetailGraph(eventSourceData));
    }

    /**
     * Render event sink detail view diagram as interactive SVG
     * Layout: [Brokers] → [Event Sink] → [External Destination]
     */
    function renderEventSinkDetailGraph(eventSinkData) {
        const container = document.getElementById('eventSinkDetailGraphContainer');
        if (!container) return;

        const config = {
            nodeWidth: 180,
            nodeHeight: 100,
            horizontalGap: 200,
            verticalGap: 120,
            padding: 40
        };

        // Extract broker nodes from subscriptions
        const brokerMap = new Map();
        if (eventSinkData.eventSubscriptions) {
            eventSinkData.eventSubscriptions.forEach(sub => {
                if (!brokerMap.has(sub.broker)) {
                    const broker = getBrokers().find(b => b.name === sub.broker);
                    if (broker) {
                        brokerMap.set(sub.broker, {
                            ...broker,
                            eventTypes: []
                        });
                    }
                }
                if (brokerMap.has(sub.broker)) {
                    brokerMap.get(sub.broker).eventTypes.push(sub.eventType);
                }
            });
        }

        const brokers = Array.from(brokerMap.values());

        // Calculate dimensions
        const brokersHeight = brokers.length * (config.nodeHeight + config.verticalGap);
        const svgHeight = Math.max(brokersHeight, 400) + 2 * config.padding;
        const svgWidth = config.padding + (config.nodeWidth + config.horizontalGap) * 2 + config.nodeWidth + config.padding;

        // Position nodes
        const brokerX = config.padding;
        const sinkX = config.padding + config.nodeWidth + config.horizontalGap;
        const externalX = sinkX + config.nodeWidth + config.horizontalGap;
        const brokerStartY = (svgHeight - brokersHeight) / 2;
        const sinkY = svgHeight / 2 - config.nodeHeight / 2;

        const nodes = [];
        const edges = [];
        const arrowPadding = 15;

        // Calculate sink position FIRST (so edges can use it)
        const sinkNodeId = `eventsink-detail-${eventSinkData.id}-center`;
        const sinkPos = nodePositions[sinkNodeId] || { x: sinkX, y: sinkY };

        // Position brokers (left)
        brokers.forEach((broker, i) => {
            const defaultY = brokerStartY + i * (config.nodeHeight + config.verticalGap);
            const nodeId = `eventsink-detail-${eventSinkData.id}-broker-${broker.id}`;
            const pos = nodePositions[nodeId] || { x: brokerX, y: defaultY };

            nodes.push({
                ...broker,
                nodeId: nodeId,
                x: pos.x,
                y: pos.y,
                type: 'broker'
            });

            // Create edge from broker to sink (using sinkPos from nodePositions)
            edges.push({
                fromId: nodeId,
                toId: `eventsink-detail-${eventSinkData.id}-center`,
                from: { x: pos.x + config.nodeWidth, y: pos.y + config.nodeHeight / 2 },
                to: { x: sinkPos.x - arrowPadding, y: sinkPos.y + config.nodeHeight / 2 },
                label: broker.eventTypes.join(', '),
                direction: 'outgoing'
            });
        });

        // Position event sink (center)
        nodes.push({
            ...eventSinkData,
            nodeId: sinkNodeId,
            x: sinkPos.x,
            y: sinkPos.y,
            type: 'sink',
            sinkType: eventSinkData.type
        });

        // External destination node (right, synthetic)
        const externalNodeId = `eventsink-detail-${eventSinkData.id}-external`;
        const externalPos = nodePositions[externalNodeId] || { x: externalX, y: sinkPos.y };

        let externalName = '';
        if (eventSinkData.type === 'http') {
            externalName = new URL(eventSinkData.config.url).hostname;
        } else if (eventSinkData.type === 'kafka') {
            externalName = eventSinkData.config.topic;
        } else {
            externalName = eventSinkData.type.toUpperCase();
        }

        nodes.push({
            name: externalName,
            nodeId: externalNodeId,
            x: externalPos.x,
            y: externalPos.y,
            type: 'external'
        });

        // Edge: Sink → External
        edges.push({
            fromId: sinkNodeId,
            toId: externalNodeId,
            from: { x: sinkPos.x + config.nodeWidth, y: sinkPos.y + config.nodeHeight / 2 },
            to: { x: externalPos.x - arrowPadding, y: externalPos.y + config.nodeHeight / 2 },
            label: '',
            direction: 'outgoing'
        });

        // Consolidate edges
        const consolidatedEdges = consolidateEdges(edges);

        // Generate SVG
        let svg = `<svg id="eventSinkDetailGraphSvg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

        svg += '<defs>';
        svg += createArrowheadMarker('arrowhead-eventsink-detail', '#999');
        svg += createArrowheadMarker('arrowhead-blue-eventsink-detail', '#2196F3');
        svg += '</defs>';

        // Draw edges
        consolidatedEdges.forEach(edge => {
            svg += generateEdgePath(edge, arrowPadding, 'eventsink-detail');
            if (edge.label) {
                const midX = (edge.from.x + edge.to.x) / 2;
                const midY = (edge.from.y + edge.to.y) / 2 - 10;
                svg += generateEdgeLabel(edge, midX, midY);
            }
        });

        // Draw nodes
        nodes.forEach(node => {
            let clickHandler = '';
            if (node.type === 'broker') {
                clickHandler = `showBrokerDetailView(getBroker('${node.id}'))`;
            }
            svg += generateNodeSVG(node, config.nodeWidth, config.nodeHeight, clickHandler);
        });

        svg += '</svg>';
        container.innerHTML = svg;

        // Setup drag-and-drop
        setupGraphDragAndDrop('eventSinkDetailGraphSvg', () => renderEventSinkDetailGraph(eventSinkData));
    }

    /**
     * Render broker detail view diagram as interactive SVG
     * Layout: [Event Sources] → [Broker] → [Subscribers (Functions + Sinks)]
     */
    function renderBrokerDetailGraph(brokerData) {
        const container = document.getElementById('brokerDetailGraphContainer');
        if (!container) return;

        const config = {
            nodeWidth: 180,
            nodeHeight: 100,
            horizontalGap: 200,
            verticalGap: 120,
            padding: 40
        };

        // Get event sources sending to this broker
        const eventSources = getEventSources().filter(es => es.sinkConfig?.broker === brokerData.name);

        // Get subscribers (functions and sinks)
        const subscribedFunctions = getFunctions().filter(f =>
            f.eventSubscriptions?.some(sub => sub.broker === brokerData.name)
        );
        const subscribedSinks = getEventSinks().filter(s =>
            s.eventSubscriptions?.some(sub => sub.broker === brokerData.name)
        );
        const subscribers = [...subscribedFunctions, ...subscribedSinks];

        // Calculate dimensions
        const sourcesHeight = eventSources.length * (config.nodeHeight + config.verticalGap);
        const subscribersHeight = subscribers.length * (config.nodeHeight + config.verticalGap);
        const svgHeight = Math.max(sourcesHeight, subscribersHeight, 400) + 2 * config.padding;
        const svgWidth = config.padding + (config.nodeWidth + config.horizontalGap) * 2 + config.nodeWidth + config.padding;

        // Position nodes
        const sourceX = config.padding;
        const brokerX = config.padding + config.nodeWidth + config.horizontalGap;
        const subscriberX = brokerX + config.nodeWidth + config.horizontalGap;
        const sourceStartY = (svgHeight - sourcesHeight) / 2;
        const brokerY = svgHeight / 2 - config.nodeHeight / 2;
        const subscriberStartY = (svgHeight - subscribersHeight) / 2;

        const nodes = [];
        const edges = [];
        const arrowPadding = 15;

        // Calculate broker position FIRST (so edges can use it)
        const brokerNodeId = `broker-detail-${brokerData.id}-center`;
        const brokerPos = nodePositions[brokerNodeId] || { x: brokerX, y: brokerY };

        // Position event sources (left)
        eventSources.forEach((source, i) => {
            const defaultY = sourceStartY + i * (config.nodeHeight + config.verticalGap);
            const nodeId = `broker-detail-${brokerData.id}-source-${source.id}`;
            const pos = nodePositions[nodeId] || { x: sourceX, y: defaultY };

            nodes.push({
                ...source,
                nodeId: nodeId,
                x: pos.x,
                y: pos.y,
                type: 'source'
            });

            // Edge: Source → Broker (using brokerPos from nodePositions)
            edges.push({
                fromId: nodeId,
                toId: `broker-detail-${brokerData.id}-center`,
                from: { x: pos.x + config.nodeWidth, y: pos.y + config.nodeHeight / 2 },
                to: { x: brokerPos.x - arrowPadding, y: brokerPos.y + config.nodeHeight / 2 },
                label: source.eventTypes ? source.eventTypes.join(', ') : '',
                direction: 'outgoing'
            });
        });

        // Position broker (center)
        nodes.push({
            ...brokerData,
            nodeId: brokerNodeId,
            x: brokerPos.x,
            y: brokerPos.y,
            type: 'broker'
        });

        // Position subscribers (right)
        subscribers.forEach((subscriber, i) => {
            const defaultY = subscriberStartY + i * (config.nodeHeight + config.verticalGap);
            const subscriberType = subscriber.containerPort ? 'function' : 'sink';
            const nodeId = `broker-detail-${brokerData.id}-subscriber-${subscriber.id}`;
            const pos = nodePositions[nodeId] || { x: subscriberX, y: defaultY };

            nodes.push({
                ...subscriber,
                nodeId: nodeId,
                x: pos.x,
                y: pos.y,
                type: subscriberType,
                sinkType: subscriber.type
            });

            // Get event types for this subscriber
            const eventTypes = subscriber.eventSubscriptions
                ?.filter(sub => sub.broker === brokerData.name)
                .map(sub => sub.eventType) || [];

            // Edge: Broker → Subscriber
            edges.push({
                fromId: brokerNodeId,
                toId: nodeId,
                from: { x: brokerPos.x + config.nodeWidth, y: brokerPos.y + config.nodeHeight / 2 },
                to: { x: pos.x - arrowPadding, y: pos.y + config.nodeHeight / 2 },
                label: eventTypes.join(', '),
                direction: 'outgoing'
            });
        });

        // Consolidate edges
        const consolidatedEdges = consolidateEdges(edges);

        // Generate SVG
        let svg = `<svg id="brokerDetailGraphSvg" width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

        svg += '<defs>';
        svg += createArrowheadMarker('arrowhead-broker-detail', '#999');
        svg += createArrowheadMarker('arrowhead-blue-broker-detail', '#2196F3');
        svg += '</defs>';

        // Draw edges
        consolidatedEdges.forEach(edge => {
            svg += generateEdgePath(edge, arrowPadding, 'broker-detail');
            if (edge.label) {
                const midX = (edge.from.x + edge.to.x) / 2;
                const midY = (edge.from.y + edge.to.y) / 2 - 10;
                svg += generateEdgeLabel(edge, midX, midY);
            }
        });

        // Draw nodes
        nodes.forEach(node => {
            let clickHandler = '';
            if (node.type === 'function') {
                clickHandler = `showDetailView(getFunction('${node.id}'))`;
            } else if (node.type === 'sink') {
                clickHandler = `showEventSinkDetailView(getEventSink('${node.id}'))`;
            } else if (node.type === 'source') {
                clickHandler = `showEventSourceDetailView(getEventSource('${node.id}'))`;
            }
            svg += generateNodeSVG(node, config.nodeWidth, config.nodeHeight, clickHandler);
        });

        svg += '</svg>';
        container.innerHTML = svg;

        // Setup drag-and-drop
        setupGraphDragAndDrop('brokerDetailGraphSvg', () => renderBrokerDetailGraph(brokerData));
    }

    /**
     * Render event sources (triggers) in diagram (deprecated - use renderFunctionDetailGraph)
     */
    function renderEventSources(functionData) {
        if (!eventSourcesList) return;
        eventSourcesList.innerHTML = '';

        if (!functionData.eventSubscriptions || functionData.eventSubscriptions.length === 0) {
            return;
        }

        // Create a source box for each subscription
        functionData.eventSubscriptions.forEach(sub => {
            const sourceBox = document.createElement('div');
            sourceBox.className = 'source-box';

            sourceBox.innerHTML = `
                <div class="source-icon">📨</div>
                <div class="source-info">
                    <div class="source-name">${sub.broker}</div>
                    <div class="source-details">${sub.eventType}</div>
                </div>
            `;

            eventSourcesList.appendChild(sourceBox);
        });
    }

    // renderSinkDestinations() removed - functions only receive events from brokers

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
            const subCard = document.createElement('div');
            subCard.className = 'subscription-card';
            subCard.innerHTML = `
                <div class="subscription-info">
                    <div class="subscription-broker">Broker: <strong>${sub.broker}</strong></div>
                    <div class="subscription-event-type">Event Type: <code>${sub.eventType}</code></div>
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
            renderNetworkGraph();
        }
    }

    /**
     * Render destination
     */
    // renderDestination() and removeDestination() removed - functions only receive events from brokers

    /**
     * Render broker detail view content
     */
    function renderBrokerDetailView(brokerData) {
        detailBrokerName.textContent = brokerData.name;
        diagramBrokerName.textContent = brokerData.name;
        detailBrokerNamespace.textContent = brokerData.namespace;
        detailBrokerRetry.textContent = brokerData.deliveryConfig.retry;
        detailBrokerBackoffPolicy.textContent = brokerData.deliveryConfig.backoffPolicy;

        // Render interactive graph
        renderBrokerDetailGraph(brokerData);

        // Get event types from connected event sources
        const eventSources = getEventSources().filter(es => es.broker === brokerData.name);
        const allEventTypes = eventSources.flatMap(es => es.eventTypes);
        const uniqueEventTypes = [...new Set(allEventTypes)];

        if (uniqueEventTypes.length > 0) {
            detailBrokerEventTypes.textContent = uniqueEventTypes.join(', ');
        } else {
            detailBrokerEventTypes.textContent = 'None';
        }

        // Render event sources list (deprecated - now shown in graph)
        // brokerEventSourcesList removed from HTML

        // Render subscribers list (functions and event sinks) (deprecated - now shown in graph)
        if (brokerFunctionsList) {
            brokerFunctionsList.innerHTML = '';

        // Get functions subscribed to this broker
        const functions = getFunctions().filter(f =>
            f.eventSubscriptions && f.eventSubscriptions.some(sub => sub.broker === brokerData.name)
        );

        // Get event sinks subscribed to this broker
        const sinks = getEventSinks().filter(s =>
            s.eventSubscriptions && s.eventSubscriptions.some(sub => sub.broker === brokerData.name)
        );

        const totalSubscribers = functions.length + sinks.length;

        if (totalSubscribers === 0) {
            brokerFunctionsList.innerHTML = '<p class="empty-list">No subscribers for this broker.</p>';
        } else {
            // Render functions
            functions.forEach(func => {
                const funcBox = document.createElement('div');
                funcBox.className = 'destination-box';
                funcBox.innerHTML = `
                    <div class="destination-icon">λ</div>
                    <div class="destination-info">
                        <div class="destination-name">${func.name}</div>
                        <div class="destination-details">Function</div>
                    </div>
                `;
                brokerFunctionsList.appendChild(funcBox);
            });

            // Render event sinks
            sinks.forEach(sink => {
                const sinkBox = document.createElement('div');
                sinkBox.className = 'destination-box';
                const sinkIcon = getSinkIcon(sink.type);
                const typeDisplayName = sink.type.charAt(0).toUpperCase() + sink.type.slice(1);
                sinkBox.innerHTML = `
                    <div class="destination-icon">${sinkIcon}</div>
                    <div class="destination-info">
                        <div class="destination-name">${sink.name}</div>
                        <div class="destination-details">Event Sink (${typeDisplayName})</div>
                    </div>
                `;
                brokerFunctionsList.appendChild(sinkBox);
            });
        }
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

        // Render interactive graph
        renderEventSourceDetailGraph(eventSourceData);

        // Determine target details
        const sinkMethod = eventSourceData.sinkMethod || 'broker';
        const sinkConfig = eventSourceData.sinkConfig || {};
        let targetName = '';
        let targetType = '';

        if (sinkMethod === 'broker') {
            targetName = sinkConfig.broker || eventSourceData.broker || '';
            targetType = 'Broker';
        } else if (sinkMethod === 'sink') {
            targetName = sinkConfig.sinkName || '';
            targetType = `Event Sink (${sinkConfig.sinkType || ''})`;
        } else if (sinkMethod === 'function') {
            targetName = sinkConfig.functionName || '';
            targetType = 'Function';
        }

        detailEventSourceBroker.textContent = targetName;
        detailEventSourceEventTypes.textContent = eventSourceData.eventTypes.join(', ');

        // Render external source (deprecated - now shown in graph)
        if (!eventSourceExternalSource) return;
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

        // Render target (broker, sink, or function) (deprecated - now shown in graph)
        if (!eventSourceTargetBroker) return;
        eventSourceTargetBroker.innerHTML = '';
        const targetBox = document.createElement('div');
        targetBox.className = 'destination-box';

        let targetIcon = '📨';  // Default broker icon
        if (sinkMethod === 'sink') {
            targetIcon = getSinkIcon(sinkConfig.sinkType);
        } else if (sinkMethod === 'function') {
            targetIcon = 'λ';
        }

        targetBox.innerHTML = `
            <div class="destination-icon">${targetIcon}</div>
            <div class="destination-info">
                <div class="destination-name">${targetName}</div>
                <div class="destination-details">${targetType}</div>
            </div>
        `;
        eventSourceTargetBroker.appendChild(targetBox);
    }

    /**
     * Render event source detail resources
     */
    function renderEventSourceDetailResources(eventSourceData) {
        // Determine target description
        const sinkMethod = eventSourceData.sinkMethod || 'broker';
        const sinkConfig = eventSourceData.sinkConfig || {};
        let targetDescription = '';

        if (sinkMethod === 'broker') {
            const broker = sinkConfig.broker || eventSourceData.broker || '';
            targetDescription = `<strong>${broker}</strong> Broker`;
        } else if (sinkMethod === 'sink') {
            targetDescription = `<strong>${sinkConfig.sinkName}</strong> Event Sink`;
        } else if (sinkMethod === 'function') {
            targetDescription = `<strong>${sinkConfig.functionName}</strong> Function`;
        }

        const resourceType = `${eventSourceData.type}Source`;
        const resource = {
            type: resourceType,
            name: eventSourceData.name,
            yaml: generateEventSourceYAML(eventSourceData),
            metadata: RESOURCE_METADATA[resourceType] || {
                kind: `${eventSourceData.type.charAt(0).toUpperCase() + eventSourceData.type.slice(1)}Source`,
                apiVersion: 'sources.knative.dev/v1',
                description: `Produces CloudEvents from ${eventSourceData.type} to ${targetDescription}.`
            }
        };

        eventSourceDetailResourceCount.textContent = '1';
        const typeDisplayName = eventSourceData.type.charAt(0).toUpperCase() + eventSourceData.type.slice(1);
        eventSourceDetailPlatformDescription.innerHTML = `
            The UI composed <strong>1</strong> Kubernetes resource from your event source configuration.
            <br>
            This ${typeDisplayName} Source produces CloudEvents and sends them to ${targetDescription}.
        `;

        eventSourceDetailResourceCards.innerHTML = '';
        const card = createResourceCard(resource, eventSourceData.name, 0);
        eventSourceDetailResourceCards.appendChild(card);
    }

    // ==================== Event Sinks Functions ====================

    // Get DOM elements for event sinks
    const eventSinksListView = document.getElementById('eventSinksListView');
    const eventSinkFormView = document.getElementById('eventSinkFormView');
    const eventSinkDetailView = document.getElementById('eventSinkDetailView');
    const eventSinksTableBody = document.getElementById('eventSinksTableBody');
    const emptyEventSinksState = document.getElementById('emptyEventSinksState');
    const eventSinkCountSpan = document.getElementById('eventSinkCount');
    const createNewEventSinkBtn = document.getElementById('createNewEventSinkBtn');
    const backToEventSinksListBtn = document.getElementById('backToEventSinksListBtn');
    const saveEventSinkBtn = document.getElementById('saveEventSinkBtn');
    const eventSinkForm = document.getElementById('eventSinkForm');
    const eventSinkFormTitle = document.getElementById('eventSinkFormTitle');
    const eventSinkTypeRadios = document.querySelectorAll('input[name="eventSinkType"]');
    const eventSinkPlatformView = document.getElementById('eventSinkPlatformView');
    const eventSinkPlatformDescription = document.getElementById('eventSinkPlatformDescription');
    const eventSinkResourceCards = document.getElementById('eventSinkResourceCards');
    const backToEventSinksListFromDetailBtn = document.getElementById('backToEventSinksListFromDetailBtn');
    const editEventSinkFromDetailBtn = document.getElementById('editEventSinkFromDetailBtn');

    /**
     * Show event sinks list view
     */
    function showEventSinksList() {
        hideAllViews();
        eventSinksListView.style.display = 'block';
        renderEventSinksList();
    }

    /**
     * Show event sink form view
     */
    function showEventSinkFormView(mode) {
        hideAllViews();
        eventSinkFormView.style.display = 'block';

        if (mode === 'create') {
            eventSinkFormTitle.textContent = 'Create Event Sink';
            saveEventSinkBtn.textContent = 'Create Event Sink';
            resetEventSinkForm();
        } else if (mode === 'edit') {
            eventSinkFormTitle.textContent = 'Edit Event Sink';
            saveEventSinkBtn.textContent = 'Save Event Sink';
            loadEventSinkIntoForm(getCurrentEditingEventSink());
        }

        // Populate broker dropdown for standalone mode
        populateEventSinkBrokerDropdown();

        // Trigger initial resource preview
        setTimeout(() => {
            updateEventSinkResourcePreview();
        }, 100);
    }

    /**
     * Show event sink detail view
     */
    function showEventSinkDetailView(sinkData) {
        hideAllViews();
        eventSinkDetailView.style.display = 'block';
        setCurrentEditingEventSink(sinkData);
        renderEventSinkDetailView(sinkData);
    }

    /**
     * Collect event sink form data
     */
    function collectEventSinkFormData() {
        const currentSink = getCurrentEditingEventSink();
        const eventSinkType = document.querySelector('input[name="eventSinkType"]:checked').value;
        let config = {};

        // Collect type-specific config
        if (eventSinkType === 'http') {
            config = {
                url: document.getElementById('httpSinkURL').value.trim()
            };
        } else if (eventSinkType === 'kafka') {
            config = {
                topic: document.getElementById('kafkaSinkTopic').value.trim(),
                bootstrapServers: document.getElementById('kafkaSinkBootstrapServers').value.trim()
            };
        } else if (eventSinkType === 'sns') {
            config = {
                topicArn: document.getElementById('snsTopicArn').value.trim(),
                credentialsSecret: document.getElementById('snsCredentialsSecret').value.trim()
            };
        } else if (eventSinkType === 'pubsub') {
            config = {
                topic: document.getElementById('pubsubTopic').value.trim(),
                credentialsSecret: document.getElementById('pubsubCredentialsSecret').value.trim()
            };
        } else if (eventSinkType === 'eventgrid') {
            config = {
                endpoint: document.getElementById('eventgridEndpoint').value.trim(),
                keySecret: document.getElementById('eventgridKeySecret').value.trim()
            };
        } else if (eventSinkType === 'database') {
            config = {
                databaseType: document.getElementById('databaseType').value,
                connectionSecret: document.getElementById('databaseConnectionSecret').value.trim(),
                table: document.getElementById('databaseTable').value.trim()
            };
        }

        const formData = {
            id: currentSink ? currentSink.id : null,
            name: document.getElementById('eventSinkName').value.trim(),
            namespace: document.getElementById('eventSinkNamespace').value.trim(),
            type: eventSinkType,
            config: config
        };

        // Preserve event subscriptions if editing
        if (currentSink && currentSink.eventSubscriptions) {
            formData.eventSubscriptions = currentSink.eventSubscriptions;
        } else {
            formData.eventSubscriptions = [];
        }

        return formData;
    }

    /**
     * Reset event sink form
     */
    function resetEventSinkForm() {
        eventSinkForm.reset();
        clearCurrentEditingEventSink();

        // Reset to default panel (HTTP)
        document.querySelectorAll('.metric-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById('httpSinkPanel').classList.add('active');
    }

    /**
     * Load event sink into form
     */
    function loadEventSinkIntoForm(sinkData) {
        if (!sinkData) return;

        document.getElementById('eventSinkName').value = sinkData.name;
        document.getElementById('eventSinkNamespace').value = sinkData.namespace;

        // Note: broker and eventTypes are managed separately in subscription view

        // Set sink type radio and show corresponding panel
        document.querySelectorAll('input[name="eventSinkType"]').forEach(radio => {
            if (radio.value === sinkData.type) {
                radio.checked = true;
            }
        });

        // Show the appropriate panel
        document.querySelectorAll('.metric-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${sinkData.type}SinkPanel`).classList.add('active');

        // Load type-specific config
        if (sinkData.type === 'http') {
            document.getElementById('httpSinkURL').value = sinkData.config.url || '';
        } else if (sinkData.type === 'kafka') {
            document.getElementById('kafkaSinkTopic').value = sinkData.config.topic || '';
            document.getElementById('kafkaSinkBootstrapServers').value = sinkData.config.bootstrapServers || '';
        } else if (sinkData.type === 'sns') {
            document.getElementById('snsTopicArn').value = sinkData.config.topicArn || '';
            document.getElementById('snsCredentialsSecret').value = sinkData.config.credentialsSecret || '';
        } else if (sinkData.type === 'pubsub') {
            document.getElementById('pubsubTopic').value = sinkData.config.topic || '';
            document.getElementById('pubsubCredentialsSecret').value = sinkData.config.credentialsSecret || '';
        } else if (sinkData.type === 'eventgrid') {
            document.getElementById('eventgridEndpoint').value = sinkData.config.endpoint || '';
            document.getElementById('eventgridKeySecret').value = sinkData.config.keySecret || '';
        } else if (sinkData.type === 'database') {
            document.getElementById('databaseType').value = sinkData.config.databaseType || 'postgresql';
            document.getElementById('databaseConnectionSecret').value = sinkData.config.connectionSecret || '';
            document.getElementById('databaseTable').value = sinkData.config.table || '';
        }
    }

    /**
     * Update event sink resource preview
     */
    function updateEventSinkResourcePreview() {
        const formData = collectEventSinkFormData();

        // Don't show preview if basic fields are missing
        if (!formData.name || !formData.type) {
            eventSinkPlatformView.style.display = 'none';
            return;
        }

        const resources = [];

        // Always add the sink resource
        const sinkResourceType = `${formData.type}Sink`;
        resources.push({
            type: sinkResourceType,
            name: formData.name,
            yaml: generateEventSinkYAML(formData),
            metadata: RESOURCE_METADATA[sinkResourceType] || {
                kind: getSinkKind(formData.type),
                apiVersion: 'sinks.knative.dev/v1alpha1',
                description: `Sends CloudEvents to ${formData.type} destination.`
            }
        });

        // Generate a Trigger for each subscription (when editing)
        if (formData.eventSubscriptions && formData.eventSubscriptions.length > 0) {
            formData.eventSubscriptions.forEach((sub, index) => {
                const triggerName = formData.eventSubscriptions.length === 1
                    ? `${formData.name}-trigger`
                    : `${formData.name}-trigger-${index + 1}`;

                resources.push({
                    type: 'trigger',
                    name: triggerName,
                    yaml: generateSinkSubscriptionTriggerYAML(formData, sub),
                    metadata: RESOURCE_METADATA.trigger
                });
            });
        }

        // Update UI
        eventSinkPlatformView.style.display = 'block';

        const subscriptionCount = formData.eventSubscriptions ? formData.eventSubscriptions.length : 0;
        const subscriptionDesc = subscriptionCount > 0
            ? `<br>This sink has <strong>${subscriptionCount}</strong> event subscription${subscriptionCount > 1 ? 's' : ''}. Triggers will be created for each subscription.`
            : `<br>This sink has no event subscriptions yet. After creating the sink, use "Manage Event Subscriptions" to subscribe to CloudEvents from brokers.`;

        eventSinkPlatformDescription.innerHTML = `
            The UI will compose <strong>${resources.length}</strong> Kubernetes resource${resources.length > 1 ? 's' : ''} from your event sink configuration.
            ${subscriptionDesc}
        `;

        eventSinkResourceCards.innerHTML = '';
        resources.forEach((resource, index) => {
            const card = createResourceCard(resource, formData.name, index);
            eventSinkResourceCards.appendChild(card);
        });
    }


    /**
     * Render event sinks list
     */
    function renderEventSinksList() {
        const sinks = getEventSinks();
        eventSinkCountSpan.textContent = sinks.length;

        if (sinks.length === 0) {
            eventSinksTableBody.innerHTML = '';
            emptyEventSinksState.style.display = 'block';
            return;
        }

        emptyEventSinksState.style.display = 'none';
        eventSinksTableBody.innerHTML = '';

        sinks.forEach(sink => {
            const row = document.createElement('tr');

            // Get type display name (capitalize first letter)
            const typeDisplayName = sink.type.charAt(0).toUpperCase() + sink.type.slice(1);

            // Show subscription count and brokers
            const subscriptionCount = sink.eventSubscriptions ? sink.eventSubscriptions.length : 0;
            const brokers = sink.eventSubscriptions && sink.eventSubscriptions.length > 0
                ? [...new Set(sink.eventSubscriptions.map(sub => sub.broker))].join(', ')
                : 'None';
            const eventTypes = sink.eventSubscriptions && sink.eventSubscriptions.length > 0
                ? sink.eventSubscriptions.map(sub => sub.eventType).join(', ')
                : 'None';

            row.innerHTML = `
                <td>
                    <a href="#" class="event-sink-name-link" data-id="${sink.id}">${sink.name}</a>
                </td>
                <td>${typeDisplayName}</td>
                <td>${brokers}</td>
                <td><code style="font-size: 0.85em">${eventTypes}</code></td>
                <td class="actions-column">
                    <div class="table-actions">
                        <button class="btn-secondary btn-small edit-sink-btn" data-id="${sink.id}">Edit</button>
                        <button class="btn-danger btn-small delete-sink-btn" data-id="${sink.id}">Delete</button>
                    </div>
                </td>
            `;
            eventSinksTableBody.appendChild(row);
        });

        // Add event listeners for edit/delete buttons and event sink name links
        document.querySelectorAll('.edit-sink-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const sink = getEventSink(this.dataset.id);
                if (sink) {
                    setCurrentEditingEventSink(sink);
                    showEventSinkFormView('edit');
                }
            });
        });

        document.querySelectorAll('.delete-sink-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const sink = getEventSink(this.dataset.id);
                if (confirm(`Are you sure you want to delete event sink "${sink.name}"?`)) {
                    deleteEventSink(this.dataset.id);
                    renderEventSinksList();
                }
            });
        });

        document.querySelectorAll('.event-sink-name-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sink = getEventSink(this.dataset.id);
                if (sink) showEventSinkDetailView(sink);
            });
        });
    }

    /**
     * Get destination display string for sink
     */
    function getDestinationDisplay(type, config) {
        if (type === 'http') return config.url;
        if (type === 'kafka') return `Kafka: ${config.topic}`;
        if (type === 'sns') return config.topicArn;
        if (type === 'pubsub') return config.topic;
        if (type === 'eventgrid') return config.endpoint;
        if (type === 'database') return `${config.databaseType}: ${config.table}`;
        return 'Unknown';
    }

    /**
     * Render event sink detail view
     */
    function renderEventSinkDetailView(sinkData) {
        // Set title and metadata
        document.getElementById('detailEventSinkName').textContent = sinkData.name;
        document.getElementById('diagramEventSinkName').textContent = sinkData.name;
        document.getElementById('detailEventSinkType').textContent = sinkData.type;
        document.getElementById('detailEventSinkNamespace').textContent = sinkData.namespace;

        // Render interactive graph
        renderEventSinkDetailGraph(sinkData);

        // Render event subscriptions summary
        const eventSinkSubscriptionsSummaryText = document.getElementById('eventSinkSubscriptionsSummaryText');
        if (!sinkData.eventSubscriptions || sinkData.eventSubscriptions.length === 0) {
            eventSinkSubscriptionsSummaryText.textContent = 'No event subscriptions configured.';
        } else {
            const count = sinkData.eventSubscriptions.length;
            const types = sinkData.eventSubscriptions.map(s => s.eventType).join(', ');
            eventSinkSubscriptionsSummaryText.textContent = `${count} subscription${count > 1 ? 's' : ''}: ${types}`;
        }

        // Render sources (brokers from subscriptions) (deprecated - now shown in graph)
        const eventSinkSourcesList = document.getElementById('eventSinkSourcesList');
        const eventSinkSourceTitle = document.getElementById('eventSinkSourceTitle');
        if (!eventSinkSourcesList || !eventSinkSourceTitle) return;
        eventSinkSourcesList.innerHTML = '';
        eventSinkSourceTitle.textContent = 'Event Sources';

        if (!sinkData.eventSubscriptions || sinkData.eventSubscriptions.length === 0) {
            const emptyBox = document.createElement('div');
            emptyBox.className = 'source-box empty';
            emptyBox.innerHTML = '<div class="source-info"><div class="source-name">No event subscriptions configured</div></div>';
            eventSinkSourcesList.appendChild(emptyBox);
        } else {
            // Group subscriptions by broker
            const brokerSubscriptions = {};
            sinkData.eventSubscriptions.forEach(sub => {
                if (!brokerSubscriptions[sub.broker]) {
                    brokerSubscriptions[sub.broker] = [];
                }
                brokerSubscriptions[sub.broker].push(sub.eventType);
            });

            // Display a box for each broker
            Object.keys(brokerSubscriptions).forEach(brokerName => {
                const eventTypes = brokerSubscriptions[brokerName];
                const sourceBox = document.createElement('div');
                sourceBox.className = 'source-box';
                sourceBox.innerHTML = `
                    <div class="source-icon">📨</div>
                    <div class="source-info">
                        <div class="source-name">${brokerName}</div>
                        <div class="source-details">Broker</div>
                        <div class="source-details">Event Types: ${eventTypes.join(', ')}</div>
                    </div>
                `;
                eventSinkSourcesList.appendChild(sourceBox);
            });
        }

        // Render external destination (deprecated - now shown in graph)
        const eventSinkExternalDestination = document.getElementById('eventSinkExternalDestination');
        if (!eventSinkExternalDestination) return;
        eventSinkExternalDestination.innerHTML = '';
        const destBox = document.createElement('div');
        destBox.className = 'destination-box';
        const destIcon = getSinkIcon(sinkData.type);
        const destDisplay = getDestinationDisplay(sinkData.type, sinkData.config);
        destBox.innerHTML = `
            <div class="destination-icon">${destIcon}</div>
            <div class="destination-info">
                <div class="destination-name">${destDisplay}</div>
                <div class="destination-details">${sinkData.type.toUpperCase()}</div>
            </div>
        `;
        eventSinkExternalDestination.appendChild(destBox);

        // Render resources
        renderEventSinkDetailResources(sinkData);
    }

    /**
     * Get icon for sink type
     */
    function getSinkIcon(type) {
        const icons = {
            'http': '🌐',
            'kafka': '📊',
            'sns': '📧',
            'pubsub': '📬',
            'eventgrid': '⚡',
            'database': '💾'
        };
        return icons[type] || '📤';
    }

    /**
     * Render event sink detail resources
     */
    function renderEventSinkDetailResources(sinkData) {
        const resources = [];
        const sinkResourceType = `${sinkData.type}Sink`;

        resources.push({
            type: sinkResourceType,
            name: sinkData.name,
            yaml: generateEventSinkYAML(sinkData),
            metadata: RESOURCE_METADATA[sinkResourceType]
        });

        // Generate a Trigger for each subscription
        if (sinkData.eventSubscriptions && sinkData.eventSubscriptions.length > 0) {
            sinkData.eventSubscriptions.forEach((sub, index) => {
                const triggerName = sinkData.eventSubscriptions.length === 1
                    ? `${sinkData.name}-trigger`
                    : `${sinkData.name}-trigger-${index + 1}`;

                resources.push({
                    type: 'trigger',
                    name: triggerName,
                    yaml: generateSinkSubscriptionTriggerYAML(sinkData, sub),
                    metadata: RESOURCE_METADATA.trigger
                });
            });
        }

        const eventSinkDetailResourceCount = document.getElementById('eventSinkDetailResourceCount');
        const eventSinkDetailPlatformDescription = document.getElementById('eventSinkDetailPlatformDescription');
        const eventSinkDetailResourceCards = document.getElementById('eventSinkDetailResourceCards');

        eventSinkDetailResourceCount.textContent = resources.length;
        const subscriptionCount = sinkData.eventSubscriptions ? sinkData.eventSubscriptions.length : 0;
        const subscriptionDesc = subscriptionCount > 0
            ? `<br>This sink has <strong>${subscriptionCount}</strong> event subscription${subscriptionCount > 1 ? 's' : ''} and sends events to ${getDestinationDisplay(sinkData.type, sinkData.config)}.`
            : `<br>This sink has no event subscriptions yet. Use "Manage Event Subscriptions" to subscribe to CloudEvents from brokers.`;

        eventSinkDetailPlatformDescription.innerHTML = `
            The UI composed <strong>${resources.length}</strong> Kubernetes resource${resources.length > 1 ? 's' : ''} from your event sink configuration.
            ${subscriptionDesc}
        `;

        eventSinkDetailResourceCards.innerHTML = '';
        resources.forEach((resource, index) => {
            const card = createResourceCard(resource, sinkData.name, index);
            eventSinkDetailResourceCards.appendChild(card);
        });
    }

    /**
     * Show event sink subscriptions management view
     */
    function showEventSinkSubscriptionsView(sinkData) {
        hideAllViews();
        const eventSinkSubscriptionsView = document.getElementById('eventSinkSubscriptionsView');
        eventSinkSubscriptionsView.style.display = 'block';

        setCurrentEditingEventSink(sinkData);
        const eventSinkSubscriptionsViewName = document.getElementById('eventSinkSubscriptionsViewName');
        eventSinkSubscriptionsViewName.textContent = `Event Sink: ${sinkData.name}`;

        // Populate broker dropdown in subscription form
        populateEventSinkSubscriptionBrokerDropdown();

        // Initialize event type dropdown to disabled state
        populateEventSinkSubscriptionEventTypeDropdown(null);

        renderEventSinkSubscriptions(sinkData);
    }

    /**
     * Populate event sink subscription broker dropdown with existing brokers
     */
    function populateEventSinkSubscriptionBrokerDropdown() {
        const dropdown = document.getElementById('eventSinkSubscriptionBroker');
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
     * Populate event sink subscription event type dropdown based on selected broker
     */
    function populateEventSinkSubscriptionEventTypeDropdown(brokerName) {
        const dropdown = document.getElementById('eventSinkSubscriptionEventType');

        if (!brokerName) {
            dropdown.innerHTML = '<option value="">Select a broker first...</option>';
            dropdown.disabled = true;
            return;
        }

        // Get all event sources connected to this broker
        const eventSources = getEventSources().filter(es =>
            (es.sinkMethod === 'broker' && es.sinkConfig && es.sinkConfig.broker === brokerName) ||
            es.broker === brokerName
        );

        // Collect all event types from these sources
        const eventTypesSet = new Set();
        eventSources.forEach(es => {
            if (es.eventTypes) {
                es.eventTypes.forEach(type => eventTypesSet.add(type));
            }
        });

        const eventTypes = Array.from(eventTypesSet).sort();

        // Clear and populate dropdown
        dropdown.innerHTML = '<option value="">Select an event type...</option>';

        if (eventTypes.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No event types available from this broker';
            option.disabled = true;
            dropdown.appendChild(option);
            dropdown.disabled = true;
        } else {
            eventTypes.forEach(eventType => {
                const option = document.createElement('option');
                option.value = eventType;
                option.textContent = eventType;
                dropdown.appendChild(option);
            });

            // Add "custom" option for advanced users
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Custom event type...';
            dropdown.appendChild(customOption);

            dropdown.disabled = false;
        }
    }

    /**
     * Render event sink subscriptions list
     */
    function renderEventSinkSubscriptions(sinkData) {
        const eventSinkSubscriptionsList = document.getElementById('eventSinkSubscriptionsList');
        eventSinkSubscriptionsList.innerHTML = '';

        if (!sinkData.eventSubscriptions || sinkData.eventSubscriptions.length === 0) {
            eventSinkSubscriptionsList.innerHTML = '<div id="emptyEventSinkSubscriptions" class="empty-subscriptions"><p>No event subscriptions configured. Add one below.</p></div>';
            return;
        }

        sinkData.eventSubscriptions.forEach((sub, index) => {
            const subCard = document.createElement('div');
            subCard.className = 'subscription-card';
            subCard.innerHTML = `
                <div class="subscription-info">
                    <div class="subscription-broker">Broker: <strong>${sub.broker}</strong></div>
                    <div class="subscription-event-type">Event Type: <code>${sub.eventType}</code></div>
                </div>
                <button class="btn-danger btn-small remove-event-sink-subscription-btn" data-index="${index}">Remove</button>
            `;
            eventSinkSubscriptionsList.appendChild(subCard);
        });

        // Add remove handlers
        document.querySelectorAll('.remove-event-sink-subscription-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                removeEventSinkSubscription(index);
            });
        });
    }

    /**
     * Remove event sink subscription
     */
    function removeEventSinkSubscription(index) {
        const currentSink = getCurrentEditingEventSink();
        if (!currentSink) return;

        if (confirm('Are you sure you want to remove this event subscription?')) {
            currentSink.eventSubscriptions.splice(index, 1);
            saveEventSink(currentSink);
            renderEventSinkSubscriptions(currentSink);
            renderNetworkGraph();
        }
    }

    /**
     * Helper function to hide all views
     */
    function hideAllViews() {
        overviewView.style.display = 'none';
        listView.style.display = 'none';
        formView.style.display = 'none';
        detailView.style.display = 'none';
        subscriptionsView.style.display = 'none';
        destinationsView.style.display = 'none';
        brokerDetailView.style.display = 'none';
        eventSourceDetailView.style.display = 'none';
        brokersListView.style.display = 'none';
        brokerFormView.style.display = 'none';
        eventSourcesListView.style.display = 'none';
        eventSourceFormView.style.display = 'none';
        eventSinksListView.style.display = 'none';
        eventSinkFormView.style.display = 'none';
        eventSinkDetailView.style.display = 'none';
        eventSinkSubscriptionsView.style.display = 'none';
    }

    // Event Sink button handlers
    if (createNewEventSinkBtn) {
        createNewEventSinkBtn.addEventListener('click', function() {
            clearCurrentEditingEventSink();
            showEventSinkFormView('create');
        });
    }

    if (backToEventSinksListBtn) {
        backToEventSinksListBtn.addEventListener('click', showEventSinksList);
    }

    if (backToEventSinksListFromDetailBtn) {
        backToEventSinksListFromDetailBtn.addEventListener('click', showEventSinksList);
    }

    if (editEventSinkFromDetailBtn) {
        editEventSinkFromDetailBtn.addEventListener('click', function() {
            showEventSinkFormView('edit');
        });
    }

    if (saveEventSinkBtn) {
        saveEventSinkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const formData = collectEventSinkFormData();
            saveEventSink(formData);
            showEventSinksList();
        });
    }

    // Event Sink subscription management handlers
    const manageEventSinkSubscriptionsBtn = document.getElementById('manageEventSinkSubscriptionsBtn');
    const backToEventSinkDetailFromSubscriptionsBtn = document.getElementById('backToEventSinkDetailFromSubscriptionsBtn');
    const eventSinkSubscriptionForm = document.getElementById('eventSinkSubscriptionForm');
    const eventSinkSubscriptionBroker = document.getElementById('eventSinkSubscriptionBroker');
    const eventSinkSubscriptionEventType = document.getElementById('eventSinkSubscriptionEventType');

    if (manageEventSinkSubscriptionsBtn) {
        manageEventSinkSubscriptionsBtn.addEventListener('click', function() {
            const currentSink = getCurrentEditingEventSink();
            if (currentSink) {
                showEventSinkSubscriptionsView(currentSink);
            }
        });
    }

    if (backToEventSinkDetailFromSubscriptionsBtn) {
        backToEventSinkDetailFromSubscriptionsBtn.addEventListener('click', function() {
            const currentSink = getCurrentEditingEventSink();
            if (currentSink) {
                showEventSinkDetailView(currentSink);
            }
        });
    }

    // Handle event sink subscription broker dropdown change
    if (eventSinkSubscriptionBroker) {
        eventSinkSubscriptionBroker.addEventListener('change', function() {
            populateEventSinkSubscriptionEventTypeDropdown(this.value);
        });
    }

    // Handle event sink subscription event type dropdown change
    if (eventSinkSubscriptionEventType) {
        eventSinkSubscriptionEventType.addEventListener('change', function() {
            const customField = document.getElementById('customEventSinkEventTypeField');
            if (this.value === 'custom') {
                customField.style.display = 'block';
            } else {
                customField.style.display = 'none';
            }
        });
    }

    // Handle event sink subscription form submission
    if (eventSinkSubscriptionForm) {
        eventSinkSubscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const currentSink = getCurrentEditingEventSink();
            if (!currentSink) return;

            const broker = document.getElementById('eventSinkSubscriptionBroker').value.trim();
            let eventType = eventSinkSubscriptionEventType.value;

            if (eventType === 'custom') {
                eventType = document.getElementById('customEventSinkEventType').value.trim();
            }

            if (!broker || !eventType || eventType === '') {
                alert('Please fill in all fields');
                return;
            }

            // Initialize eventSubscriptions if needed
            if (!currentSink.eventSubscriptions) {
                currentSink.eventSubscriptions = [];
            }

            // Check if this subscription already exists
            const existing = currentSink.eventSubscriptions.find(
                sub => sub.broker === broker && sub.eventType === eventType
            );

            if (existing) {
                alert('This event subscription already exists');
                return;
            }

            // Add subscription
            currentSink.eventSubscriptions.push({
                broker: broker,
                eventType: eventType
            });

            // Save to state
            saveEventSink(currentSink);

            // Refresh subscriptions view
            renderEventSinkSubscriptions(currentSink);

            // Refresh network graph to show new connections
            renderNetworkGraph();

            // Reset form
            eventSinkSubscriptionForm.reset();
            document.getElementById('customEventSinkEventTypeField').style.display = 'none';
        });
    }

    // Event sink mode removed - all sinks subscribe to brokers via Triggers

    // Event sink type panel toggle
    eventSinkTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all panels
            document.querySelectorAll('#eventSinkForm .metric-panel').forEach(panel => {
                panel.classList.remove('active');
            });

            // Show selected panel
            const panelId = `${this.value}SinkPanel`;
            const targetPanel = document.getElementById(panelId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Update preview
            updateEventSinkResourcePreview();
        });
    });

    // Event sink form field listeners for live preview
    if (eventSinkForm) {
        eventSinkForm.addEventListener('input', function() {
            updateEventSinkResourcePreview();
        });
    }

    // Add global functions for network graph node clicks
    window.viewEventSourceDetails = function(id) {
        const source = getEventSource(id);
        if (source) {
            setCurrentEditingEventSource(source);
            showEventSourceDetailView();
        }
    };

    window.viewBrokerDetails = function(id) {
        const broker = getBroker(id);
        if (broker) {
            setCurrentEditingBroker(broker);
            showBrokerDetailView();
        }
    };

    window.viewFunctionDetails = function(id) {
        const func = getFunction(id);
        if (func) {
            showDetailView(func);
        }
    };

    window.viewEventSinkDetails = function(id) {
        const sink = getEventSink(id);
        if (sink) {
            setCurrentEditingEventSink(sink);
            showEventSinkDetailView();
        }
    };

    // Initialize with overview page
    showOverview();

});
