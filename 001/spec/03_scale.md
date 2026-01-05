### Auto scaling

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
    name: my-function
    namespace: default
spec:
    scaling:
        minReplicas: 2
        maxReplicas: 10
        metric:
          # ONE OF
          requestRate:
            granularity: 1s
            targetValue: 100
            window: 1m
          # OR
          concurrency:
            targetValue: 100
          # OR
          trigger:
            type: kafka
            metadata:
              topic: my-topic
              bootstrapServers: kafka-broker:9092
              consumerGroup: my-consumer-group
          
      # TODO: scaling based on traffic (requests per second)
```

This would result in a KEDA [HTTPScaledObject](https://github.com/kedacore/http-add-on/blob/main/docs/ref/v0.11.1/http_scaled_object.md) 
or a KEDA [ScaledObject](https://keda.sh/docs/2.18/reference/scaledobject-spec/).

TODO: 
- scaling based on metrics, such as CPU / Memory
- scaling based on custom metrics
