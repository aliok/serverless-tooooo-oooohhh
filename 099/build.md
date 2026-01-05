### Function with externally built image

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  image: registry.example.com/my-function:latest
```

---------------------


### Function built with Tekton build pipeline

- Tekton pipelines can do lots of things. How to get the image out of the pipeline?

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  build:
    pipeline:
      ref:
        name: build-and-deploy
        namespace: default
---
apiVersion: tekton.dev/v1
kind: Pipeline
metadata:
  name: build-and-deploy
spec:
  workspaces:
    - name: shared-workspace
  params:
    - name: deployment-name
      type: string
      description: name of the deployment to be patched
    - name: git-url
      type: string
      description: url of the git repo for the code of deployment
    - name: git-revision
      type: string
      description: revision to be used from repo of the code for deployment
      default: "pipelines-1.20"
    - name: IMAGE
      type: string
      description: image to be built from the code
  tasks:
    - name: fetch-repository
      taskRef:
        resolver: cluster
        params:
          - name: kind
            value: task
          - name: name
            value: git-clone
          - name: namespace
            value: openshift-pipelines
      workspaces:
        - name: output
          workspace: shared-workspace
      params:
        - name: URL
          value: $(params.git-url)
        - name: SUBDIRECTORY
          value: ""
        - name: DELETE_EXISTING
          value: "true"
        - name: REVISION
          value: $(params.git-revision)
    - name: build-image
      taskRef:
        resolver: cluster
        params:
          - name: kind
            value: task
          - name: name
            value: buildah
          - name: namespace
            value: openshift-pipelines
      workspaces:
        - name: source
          workspace: shared-workspace
      params:
        - name: IMAGE
          value: $(params.IMAGE)
      runAfter:
        - fetch-repository
    - name: apply-manifests
      taskRef:
        name: apply-manifests
      workspaces:
        - name: source
          workspace: shared-workspace
      runAfter:
        - build-image
    - name: update-deployment
      taskRef:
        name: update-deployment
      params:
        - name: deployment
          value: $(params.deployment-name)
        - name: IMAGE
          value: $(params.IMAGE)
      runAfter:
        - apply-manifests
```

---------------------


### Function built with Shipwright

- We can get the output image from the spec/status

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  build:
    shipwright:
      ref:
        name: buildah-golang-build
        namespace: default
---
apiVersion: shipwright.io/v1beta1
kind: Build
metadata:
  name: buildah-golang-build
spec:
  source:
    type: Git
    git:
      url: https://github.com/shipwright-io/sample-go
    contextDir: docker-build
  strategy:
    name: buildah
    kind: ClusterBuildStrategy
  paramValues:
    - name: dockerfile
      value: Dockerfile
  output:
    image: image-registry.openshift-image-registry.svc:5000/buildah-example/sample-go-app
```

---------------------

### Function built with S2I

- There's probably a way of getting the output image from the BuildConfig status.

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  build:
    s2i:
      ref:
        name: ruby-sample-build
        namespace: default
---
kind: BuildConfig
apiVersion: build.openshift.io/v1
metadata:
  name: "ruby-sample-build"
spec:
  runPolicy: "Serial"
  triggers:
    -
      type: "GitHub"
      github:
        secret: "secret101"
    - type: "Generic"
      generic:
        secret: "secret101"
    -
      type: "ImageChange"
  source:
    git:
      uri: "https://github.com/openshift/ruby-hello-world"
  strategy:
    sourceStrategy:
      from:
        kind: "ImageStreamTag"
        name: "ruby-20-centos7:latest"
  output:
    to:
      kind: "ImageStreamTag"
      name: "origin-ruby-sample:latest"
  postCommit:
    script: "bundle exec rake test"
```
