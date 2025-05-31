
# Azure Infrastructure Setup Guide

## Overview
This document outlines the complete Azure infrastructure setup required for The Eye of Jasper migration from Supabase to Azure cloud services.

## Architecture Diagram

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Azure Front Door  │    │   Azure App Service │    │   Azure Functions   │
│   (Global CDN)      │───►│   (React Frontend)  │───►│   (API Backend)     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
            │                          │                          │
            │                          │                          │
            ▼                          ▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Azure AD B2C      │    │   Azure Cosmos DB   │    │   Azure Key Vault   │
│   (Identity)        │    │   (MongoDB API)     │    │   (Secrets)         │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
            │                          │                          │
            │                          │                          │
            ▼                          ▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│Application Insights │    │   Azure Storage     │    │   Azure Monitor     │
│   (Monitoring)      │    │   (Files/Logs)      │    │   (Alerts)          │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## Resource Requirements

### Subscription and Resource Group
- **Azure Subscription**: Pay-as-you-go or Enterprise
- **Resource Group**: `rg-eye-of-jasper-prod`
- **Region**: Canada Central (for Alberta-based operations)
- **Secondary Region**: Canada East (for disaster recovery)

### Naming Convention
```
{service}-{application}-{environment}-{region}
```

Examples:
- `app-eyeofjasper-prod-cc` (App Service)
- `func-eyeofjasper-prod-cc` (Functions)
- `cosmos-eyeofjasper-prod-cc` (Cosmos DB)

## Step 1: Azure Active Directory B2C Setup

### 1.1 Create Azure AD B2C Tenant
```bash
# Create B2C tenant
az ad b2c tenant create \
  --resource-group rg-eye-of-jasper-prod \
  --tenant-name EyeOfJasperB2C \
  --display-name "Eye of Jasper Identity"
```

### 1.2 Configure User Flows
1. **Sign-up and Sign-in Flow**
   - Flow name: `B2C_1_signupsignin`
   - Identity providers: Email signup
   - User attributes: Given Name, Surname, Email, Company Name
   - Application claims: All selected attributes + User ID

2. **Password Reset Flow**
   - Flow name: `B2C_1_passwordreset`
   - Identity providers: Email
   - Application claims: Email Address, User ID

3. **Profile Editing Flow**
   - Flow name: `B2C_1_profileediting`
   - User attributes: Given Name, Surname, Company Name
   - Application claims: All selected attributes

### 1.3 Register Application
```json
{
  "name": "Eye of Jasper Web App",
  "replyUrls": [
    "https://eye-of-jasper.azurewebsites.net/auth/callback",
    "https://localhost:3000/auth/callback"
  ],
  "implicitGrantSettings": {
    "enableAccessTokenIssuance": true,
    "enableIdTokenIssuance": true
  },
  "apiPermissions": [
    {
      "api": "Microsoft Graph",
      "permissions": ["User.Read"]
    }
  ]
}
```

## Step 2: Azure Cosmos DB Setup

### 2.1 Create Cosmos DB Account
```bash
# Create Cosmos DB account with MongoDB API
az cosmosdb create \
  --resource-group rg-eye-of-jasper-prod \
  --name cosmos-eyeofjasper-prod-cc \
  --kind MongoDB \
  --server-version 4.2 \
  --default-consistency-level Session \
  --locations regionName="Canada Central" failoverPriority=0 isZoneRedundant=False \
  --locations regionName="Canada East" failoverPriority=1 isZoneRedundant=False \
  --enable-automatic-failover true \
  --enable-multiple-write-locations false
```

### 2.2 Database and Collection Setup
```javascript
// Database configuration
const databases = [
  {
    name: 'EyeOfJasperProd',
    collections: [
      {
        name: 'users',
        shardKey: { '_id': 1 },
        throughput: 400
      },
      {
        name: 'reports',
        shardKey: { 'userId': 1 },
        throughput: 1000
      },
      {
        name: 'analysisResults',
        shardKey: { 'reportId': 1 },
        throughput: 400
      },
      {
        name: 'notifications',
        shardKey: { 'userId': 1 },
        throughput: 400
      },
      {
        name: 'auditLogs',
        shardKey: { 'userId': 1 },
        throughput: 400
      }
    ]
  }
];
```

### 2.3 Backup Configuration
```bash
# Configure backup policy
az cosmosdb backup policy create \
  --resource-group rg-eye-of-jasper-prod \
  --account-name cosmos-eyeofjasper-prod-cc \
  --backup-interval 240 \
  --backup-retention 168 \
  --backup-redundancy Geo
```

## Step 3: Azure App Service Setup

### 3.1 Create App Service Plan
```bash
# Create App Service Plan
az appservice plan create \
  --resource-group rg-eye-of-jasper-prod \
  --name plan-eyeofjasper-prod-cc \
  --sku P1V3 \
  --is-linux true \
  --location "Canada Central"
```

### 3.2 Create Web App
```bash
# Create Web App for React frontend
az webapp create \
  --resource-group rg-eye-of-jasper-prod \
  --plan plan-eyeofjasper-prod-cc \
  --name app-eyeofjasper-prod-cc \
  --runtime "NODE:18-lts" \
  --startup-file "serve -s build -l 8080"
```

### 3.3 Configure App Settings
```bash
# Configure application settings
az webapp config appsettings set \
  --resource-group rg-eye-of-jasper-prod \
  --name app-eyeofjasper-prod-cc \
  --settings \
    WEBSITE_NODE_DEFAULT_VERSION="18.17.0" \
    REACT_APP_API_URL="https://func-eyeofjasper-prod-cc.azurewebsites.net" \
    REACT_APP_B2C_CLIENT_ID="your-b2c-client-id" \
    REACT_APP_B2C_AUTHORITY="https://eyeofjasperb2c.b2clogin.com/eyeofjasperb2c.onmicrosoft.com/B2C_1_signupsignin" \
    REACT_APP_APPLICATION_INSIGHTS_KEY="your-app-insights-key"
```

## Step 4: Azure Functions Setup

### 4.1 Create Function App
```bash
# Create Function App for API backend
az functionapp create \
  --resource-group rg-eye-of-jasper-prod \
  --consumption-plan-location "Canada Central" \
  --name func-eyeofjasper-prod-cc \
  --storage-account storeyeofjasperprodcc \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4
```

### 4.2 Configure Function App Settings
```bash
# Configure Function App settings
az functionapp config appsettings set \
  --resource-group rg-eye-of-jasper-prod \
  --name func-eyeofjasper-prod-cc \
  --settings \
    COSMOS_DB_CONNECTION_STRING="your-cosmos-connection-string" \
    GEMINI_API_KEY="@Microsoft.KeyVault(VaultName=kv-eyeofjasper-prod-cc;SecretName=gemini-api-key)" \
    JWT_SECRET="@Microsoft.KeyVault(VaultName=kv-eyeofjasper-prod-cc;SecretName=jwt-secret)" \
    B2C_TENANT_ID="your-b2c-tenant-id" \
    APPLICATION_INSIGHTS_CONNECTION_STRING="your-app-insights-connection"
```

## Step 5: Azure Key Vault Setup

### 5.1 Create Key Vault
```bash
# Create Key Vault
az keyvault create \
  --resource-group rg-eye-of-jasper-prod \
  --name kv-eyeofjasper-prod-cc \
  --location "Canada Central" \
  --sku standard \
  --enable-soft-delete true \
  --retention-days 90
```

### 5.2 Add Secrets
```bash
# Add secrets to Key Vault
az keyvault secret set \
  --vault-name kv-eyeofjasper-prod-cc \
  --name "gemini-api-key" \
  --value "your-gemini-api-key"

az keyvault secret set \
  --vault-name kv-eyeofjasper-prod-cc \
  --name "jwt-secret" \
  --value "your-super-secure-jwt-secret"

az keyvault secret set \
  --vault-name kv-eyeofjasper-prod-cc \
  --name "cosmos-connection-string" \
  --value "your-cosmos-connection-string"
```

### 5.3 Configure Access Policies
```bash
# Grant Function App access to Key Vault
az keyvault set-policy \
  --vault-name kv-eyeofjasper-prod-cc \
  --object-id $(az functionapp identity show --name func-eyeofjasper-prod-cc --resource-group rg-eye-of-jasper-prod --query principalId -o tsv) \
  --secret-permissions get list
```

## Step 6: Storage Account Setup

### 6.1 Create Storage Account
```bash
# Create Storage Account
az storage account create \
  --resource-group rg-eye-of-jasper-prod \
  --name storeyeofjasperprodcc \
  --location "Canada Central" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --access-tier Hot
```

### 6.2 Create Containers
```bash
# Create blob containers
az storage container create \
  --account-name storeyeofjasperprodcc \
  --name reports \
  --public-access off

az storage container create \
  --account-name storeyeofjasperprodcc \
  --name exports \
  --public-access off

az storage container create \
  --account-name storeyeofjasperprodcc \
  --name logs \
  --public-access off
```

## Step 7: Application Insights Setup

### 7.1 Create Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --resource-group rg-eye-of-jasper-prod \
  --app insights-eyeofjasper-prod-cc \
  --location "Canada Central" \
  --kind web \
  --application-type web
```

### 7.2 Configure Monitoring
```bash
# Get instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --resource-group rg-eye-of-jasper-prod \
  --app insights-eyeofjasper-prod-cc \
  --query instrumentationKey -o tsv)
```

## Step 8: Networking and Security

### 8.1 Create Virtual Network
```bash
# Create VNet for secure communication
az network vnet create \
  --resource-group rg-eye-of-jasper-prod \
  --name vnet-eyeofjasper-prod-cc \
  --address-prefix 10.0.0.0/16 \
  --subnet-name subnet-app \
  --subnet-prefix 10.0.1.0/24
```

### 8.2 Configure Network Security Groups
```bash
# Create NSG for App Service
az network nsg create \
  --resource-group rg-eye-of-jasper-prod \
  --name nsg-app-eyeofjasper-prod-cc

# Allow HTTPS traffic
az network nsg rule create \
  --resource-group rg-eye-of-jasper-prod \
  --nsg-name nsg-app-eyeofjasper-prod-cc \
  --name AllowHTTPS \
  --protocol tcp \
  --priority 1000 \
  --destination-port-range 443 \
  --access allow
```

## Step 9: Backup and Disaster Recovery

### 9.1 Configure App Service Backup
```bash
# Configure automatic backup
az webapp config backup create \
  --resource-group rg-eye-of-jasper-prod \
  --webapp-name app-eyeofjasper-prod-cc \
  --backup-name daily-backup \
  --storage-account-url "https://storeyeofjasperprodcc.blob.core.windows.net/backups" \
  --frequency 1440 \
  --retain-one true
```

### 9.2 Set Up Traffic Manager (for DR)
```bash
# Create Traffic Manager profile
az network traffic-manager profile create \
  --resource-group rg-eye-of-jasper-prod \
  --name tm-eyeofjasper-prod \
  --routing-method priority \
  --unique-dns-name eye-of-jasper-tm
```

## Step 10: DevOps and CI/CD

### 10.1 Create Azure DevOps Pipeline
```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  azureSubscription: 'Eye of Jasper Production'
  resourceGroupName: 'rg-eye-of-jasper-prod'
  webAppName: 'app-eyeofjasper-prod-cc'
  functionAppName: 'func-eyeofjasper-prod-cc'

stages:
- stage: Build
  jobs:
  - job: BuildReact
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
    - script: |
        npm install
        npm run build
      displayName: 'Build React App'
    - task: PublishBuildArtifacts@1
      inputs:
        pathToPublish: 'build'
        artifactName: 'react-app'

  - job: BuildFunctions
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
    - script: |
        cd functions
        npm install
        npm run build
      displayName: 'Build Functions'
    - task: PublishBuildArtifacts@1
      inputs:
        pathToPublish: 'functions'
        artifactName: 'function-app'

- stage: Deploy
  jobs:
  - deployment: DeployReact
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: $(azureSubscription)
              appType: 'webApp'
              appName: $(webAppName)
              package: '$(Pipeline.Workspace)/react-app'

  - deployment: DeployFunctions
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureFunctionApp@1
            inputs:
              azureSubscription: $(azureSubscription)
              appType: 'functionApp'
              appName: $(functionAppName)
              package: '$(Pipeline.Workspace)/function-app'
```

## Cost Estimation

### Monthly Costs (CAD)
- **App Service (P1V3)**: ~$75
- **Function App (Consumption)**: ~$10-50 (depending on usage)
- **Cosmos DB**: ~$100-300 (depending on throughput)
- **Storage Account**: ~$5-15
- **Application Insights**: ~$10-30
- **Key Vault**: ~$5
- **B2C**: ~$0-10 (first 50k MAU free)
- **Traffic Manager**: ~$5

**Total Estimated**: $210-490 CAD/month

### Cost Optimization
1. Use reserved instances for predictable workloads
2. Implement auto-scaling for App Service
3. Use consumption plan for Functions
4. Regular cost analysis and optimization

## Security Checklist

- [ ] All secrets stored in Key Vault
- [ ] HTTPS enforced on all endpoints
- [ ] Network security groups configured
- [ ] Managed identities enabled
- [ ] Backup policies configured
- [ ] Monitoring and alerting set up
- [ ] Access policies reviewed and minimal
- [ ] SSL certificates configured
- [ ] DDoS protection enabled
- [ ] Audit logging enabled

---

**Document Version**: 1.0  
**Estimated Setup Time**: 2-3 days  
**Prerequisites**: Azure subscription, domain name, SSL certificates  
**Next Steps**: Deploy ARM templates and begin application migration
