Details of all options available in config.json

When adding a new app to Runtipi, you need to create a config.json file in the app’s folder.
This file contains all the information needed to run the app. Below you can find all the options
available in the config.json file.

Option                Description                                                                 Example value                                                                 Required
------                -----------                                                                 -------------                                                                 --------
name                  Name of the app                                                              Nextcloud                                                                    yes
id                    This should be the same name as the folder                                   nextcloud                                                                    yes
available             If set to false, the app will not be available in the app store              true                                                                         yes
short_desc            Short description of the app                                                 Nextcloud is a suite of client-server software for creating...             yes
author                The GitHub name of the author                                                https://nextcloud.com                                                        yes
port                  Port used by the app. This port will be exposed to the host.                 8100                                                                         yes
categories            One or more categories for the app                                           ["utilities", "network"]                                                    yes
description           Long description of the app                                                  Nextcloud is a suite of client-server software for creating...             yes
tipi_version          Always 1 if you are adding a new app. Increment this for updates             1                                                                            yes
version               The actual version of the app (not the Runtipi version)                      1.25.1                                                                       yes
source                Link for git repository                                                      https://github.com/nextcloud/docker                                          yes
website               Link to the official website                                                 https://nextcloud.com                                                        no
exposable             If true, the app will allow the user to expose it via a domain name          true                                                                         yes
force_expose          If true, the app will require a domain name                                  true                                                                         no
generate_vapid_keys   If true, generates VAPID keys for web push notifications                     true                                                                         no
url_suffix            If set, app will be accessible at https://<your-domain>/<url_suffix>         my-app                                                                       no
https                 If true, the app will be accessible via https only                           true                                                                         no
no_gui                Set to true for apps with no GUI. Hides the open button                      true                                                                         no
supported_architectures If app is only for specific architectures, specify here                   ["arm64", "amd64"]                                                           yes
uid, gid              Permissions for the app’s data folder. Both must be set to apply             1000                                                                         no
form_fields           Prompts the user for input during install (e.g. username, password)          See below                                                                    yes
dynamic               Use new docker-compose.json to dynamically generate compose file             true                                                                         no
deprecated            If deprecated, app won’t appear in app store                                 false                                                                        no
min_tipi_version      Minimum required Runtipi version for extra features                          v3.0.0                                                                       no
created_at            Timestamp of when the app was created                                        1724134938430                                                                no
updated_at            Timestamp of when the app was last updated                                   1724134938430                                                                no

Dynamic Compose Reference

In Runtipi version v3.2.0 we added dynamic compose, a simplified and custom version of the docker-compose.yml file that allows for more control on how apps get deployed. For example, you can choose to only use the reverse proxy or only use ports. It also allows extra features like multiple appstores.

For a step-by-step guide on creating dynamic compose files, see Creating a dynamic compose file.

Try it out
You can validate your dynamic compose configuration using the validator below:

Paste your dynamic compose configuration here to validate it...

Docker Compose to Dynamic Config Converter
Converting an existing docker-compose.yml file to Runtipi’s dynamic compose format can be time-consuming and error-prone. We’ve created a tool to help you automatically convert your Docker Compose files to the dynamic compose format.

Docker Compose YAML
Paste your docker-compose.yml content here to convert it to dynamic compose format...

Dynamic Compose Output
Converted dynamic compose will appear here...

Convert
The converter works for most cases, but please review the converted configuration to ensure it meets your needs. Some advanced features may not be fully supported.

Configuration Options Reference

Basic Configuration
These are the most commonly used options when configuring a service:

Option          Type              Description                                 Example
------          ----              -----------                                 -------
name            string            The name of the service and container       "name": "nginx"
image           string            The Docker image to use                     "image": "nginx:latest"
command         string | string[] The command to run in the container         "command": "/my/app" or "command": ["npm", "start"]
environment     object            Environment variables                       "environment": {"FOO": "bar"}
restart         string            Container restart policy                    "restart": "always"

Port Configuration
Options related to exposing ports:

Option          Type     Description                          Example
------          ----     -----------                          -------
internalPort    number   The main port exposed by the container  "internalPort": 80
addPorts        array    Additional ports to expose              See example below

Example addPorts configuration:
"addPorts": [{
  "containerPort": 8080,
  "hostPort": 8080,
  "tcp": true,
  "udp": false,
  "interface": "127.0.0.1"
}]

Volume Configuration
Options for mounting volumes:

Option     Type   Description               Example
------     ----   -----------               -------
volumes    array  List of volume mappings   See example below

Example volumes configuration:
"volumes": [{
  "hostPath": "/host/path",
  "containerPath": "/container/path",
  "readOnly": false,
  "shared": false,
  "private": false
}]

Network Configuration
Options related to networking:

Option        Type        Description                    Example
------        ----        -----------                    -------
networkMode   string      Custom network mode            "networkMode": "host"
extraHosts    string[]    Additional /etc/hosts entries  "extraHosts": ["host1:ip1"]
hostname      string      Container hostname             "hostname": "mycontainer"

Health Check Configuration
Options for container health monitoring:

Option        Type     Description                      Example
------        ----     -----------                      -------
healthCheck   object   Health check configuration       See example below

Example healthCheck configuration:
"healthCheck": {
  "test": "curl --fail http://localhost",
  "retries": 3,
  "interval": "30s",
  "timeout": "10s",
  "start_interval": "5s",
  "start_period": "30s"
}

Resource Configuration
Options for container resource limits and deployment:

Option     Type    Description                                Example
------     ----    -----------                                -------
deploy     object  Resource limits and reservations           See example below
ulimits    object  Resource limits                            See example below
shmSize    string  Size of /dev/shm                           "shmSize": "2gb"

Example deploy configuration:
"deploy": {
  "resources": {
    "limits": {
      "cpus": "0.5",
      "memory": "512M",
      "pids": 100
    }
  }
}

Example ulimits configuration:
"ulimits": {
  "nproc": {"soft": 10, "hard": 20},
  "nofile": {"soft": 20, "hard": 30}
}

Security Configuration
Options related to container security:

Option        Type      Description                                 Example
------        ----      -----------                                 -------
privileged    boolean   Run container with elevated privileges      "privileged": true
capAdd        string[]  Add container capabilities                  "capAdd": ["NET_ADMIN"]
capDrop       string[]  Drop container capabilities                 "capDrop": ["NET_ADMIN"]
securityOpt   string[]  Security options                            "securityOpt": ["no-new-privileges"]
readOnly      boolean   Mount root filesystem as read-only          "readOnly": true
user          string    Username or UID                             "user": "1000:1000"

Advanced Configuration
Additional options for fine-tuning:

Option            Type              Description                         Example
------            ----              -----------                         -------
entrypoint        string | string[] Container entrypoint               "entrypoint": "./entrypoint.sh"
workingDir        string            Working directory inside container "workingDir": "/app"
tty               boolean           Allocate a pseudo-TTY              "tty": true
stdinOpen         boolean           Keep STDIN open                    "stdinOpen": true
stopSignal        string            Signal to stop the container       "stopSignal": "SIGTERM"
stopGracePeriod   string            Time to wait to stop container     "stopGracePeriod": "10s"
pid               string            PID namespace                      "pid": "host"
sysctls           object            Sysctl settings                    "sysctls": {"net.core.somaxconn": 1024}
logging           object            Logging configuration              See example below
devices           string[]          Device mappings                    "devices": ["/dev/ttyUSB0:/dev/ttyUSB0"]

Example logging configuration:
"logging": {
  "driver": "json-file",
  "options": {
    "max-size": "10m"
  }
}

Dependencies
Options for managing service dependencies:

Option      Type              Description                            Example
------      ----              -----------                            -------
dependsOn   object | string   Service dependencies                   See example below
isMain      boolean           Apply traefik labels to this service  "isMain": true

Example dependsOn configuration:
"dependsOn": {
  "db": {
    "condition": "service_healthy"
  }
}

Architecture Overrides
Options for architecture-specific configurations:

Option     Type   Description                                   Example
------     ----   -----------                                   -------
overrides  array  Architecture-specific service configurations  See example below

The overrides option allows you to specify different configurations for specific architectures at the top level of your dynamic compose configuration. This is useful when you need to use different Docker images or settings for different CPU architectures (like arm64 vs amd64).

Example overrides configuration:
"overrides": [
  {
    "architecture": "arm64",
    "services": [
      {
        "name": "app",
        "image": "myapp:arm64-latest",
        "environment": {
          "ARCHITECTURE": "arm64"
        }
      }
    ]
  }
]

How Architecture Overrides Work
When Runtipi starts a container, it automatically detects the current system architecture and applies any matching overrides from the overrides array. The system looks for overrides that match the current architecture, then merges those service-specific settings with the base service configuration.

Important aspects of the override system:
- You must include the name field in each service in the overrides to match with the base service
- Only specify the properties that need to be different for each architecture
- Properties from overrides are deep-merged with the base service configurations
- Array properties (like volumes or ports) in overrides completely replace the base arrays rather than being appended

Supported Architectures
Runtipi supports the following architecture types for overrides:
- amd64: Standard 64-bit x86 architecture (also known as x86_64)
- arm64: 64-bit ARM architecture (also known as aarch64)

Complete Example
Here’s a complete example showing how to use architecture overrides:

{
  "services": [
    {
      "name": "media-server",
      "image": "mediaserver:latest",
      "isMain": true,
      "internalPort": 8096,
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/config",
          "containerPath": "/config"
        },
        {
          "hostPath": "${RUNTIPI_MEDIA_DIR}",
          "containerPath": "/media"
        }
      ]
    }
  ],
  "overrides": [
    {
      "architecture": "arm64",
      "services": [
        {
          "name": "media-server",
          "image": "mediaserver:arm64-latest",
          "environment": {
            "ARM_SPECIFIC_VAR": "enabled"
          }
        }
      ]
    },
    {
      "architecture": "amd64",
      "services": [
        {
          "name": "media-server",
          "image": "mediaserver:amd64-latest",
          "deploy": {
            "resources": {
              "reservations": {
                "devices": [
                  {
                    "capabilities": ["gpu"]
                  }
                ]
              }
            }
          }
        }
      ]
    }
  ]
}

In this example:
- The base configuration defines common settings for the media-server service
- On arm64 systems, the service will use the ARM64-specific image and set an ARM-specific environment variable
- On amd64 systems, the service will use the AMD64-specific image and enable GPU acceleration
- The name “media-server” is included in each override to match with the base service

Note: Some of these options are advanced features that should be used with caution as they can affect container security and stability. Always refer to Docker documentation when using advanced options like privileged, capAdd, or securityOpt.

Tip: For most applications, you’ll only need the Basic Configuration and Port Configuration options. The other options are available for more complex use cases.
