
# Azure Infrastructure for Eye of Jasper

This directory contains all Azure infrastructure-as-code templates and deployment scripts for migrating Eye of Jasper from Supabase to Azure.

## Directory Structure

```
azure/
├── templates/
│   ├── main.json              # Main ARM template
│   └── parameters/
│       ├── dev.json          # Development environment parameters
│       └── prod.json         # Production environment parameters
├── scripts/
│   ├── deploy.sh             # Main deployment script
│   ├── setup-keyvault-secrets.sh  # Key Vault configuration
│   ├── setup-b2c.sh         # Azure AD B2C setup guide
│   └── deploy-functions.sh   # Function deployment script
├── functions/                # Azure Functions source code (to be created)
└── README.md                # This file
```

## Prerequisites

1. **Azure CLI** - Install from [Azure CLI documentation](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
2. **Azure Subscription** - Active Azure subscription with contributor access
3. **Azure Functions Core Tools** - For function deployment: `npm install -g azure-functions-core-tools@4`

## Quick Start

### 1. Deploy Infrastructure

```bash
# Make scripts executable
chmod +x azure/scripts/*.sh

# Deploy development environment
./azure/scripts/deploy.sh dev

# Deploy production environment
./azure/scripts/deploy.sh prod rg-eye-of-jasper-prod
```

### 2. Configure Secrets

```bash
# Set up Key Vault secrets for development
./azure/scripts/setup-keyvault-secrets.sh dev

# Set up Key Vault secrets for production
./azure/scripts/setup-keyvault-secrets.sh prod
```

### 3. Configure Azure AD B2C

```bash
# Get B2C setup instructions
./azure/scripts/setup-b2c.sh eyeofjasperb2c
```

### 4. Deploy Functions (after creating function code)

```bash
# Deploy Azure Functions
./azure/scripts/deploy-functions.sh dev
```

## Infrastructure Components

### Core Services

- **Azure Cosmos DB** (MongoDB API) - Document database
- **Azure App Service** - React frontend hosting
- **Azure Functions** - Serverless API backend
- **Azure Key Vault** - Secrets management
- **Azure Storage Account** - File storage and function storage
- **Application Insights** - Monitoring and logging

### Security & Identity

- **Azure AD B2C** - Single Sign-On and identity management
- **Managed Identity** - Secure service-to-service authentication
- **Network Security Groups** - Network-level security

### Monitoring & Management

- **Application Insights** - Performance monitoring
- **Azure Monitor** - Infrastructure monitoring
- **Log Analytics** - Centralized logging

## Environment Configuration

### Development Environment

- **Resource Group**: `rg-eye-of-jasper-dev`
- **Location**: Canada Central
- **Cosmos DB**: Lower throughput (400 RU/s per collection)
- **App Service Plan**: Basic tier for cost optimization

### Production Environment

- **Resource Group**: `rg-eye-of-jasper-prod`
- **Location**: Canada Central with Canada East failover
- **Cosmos DB**: Production throughput (1000 RU/s for reports)
- **App Service Plan**: Premium V3 for performance
- **Backup**: Automated backups enabled
- **SSL**: Custom domain with SSL certificate

## Cost Optimization

### Development
- Use consumption plans where possible
- Lower Cosmos DB throughput
- Basic tier App Service Plan
- Estimated cost: $50-100 CAD/month

### Production
- Reserved instances for predictable workloads
- Auto-scaling enabled
- Premium features for reliability
- Estimated cost: $200-500 CAD/month

## Security Configuration

### Network Security
- All services use HTTPS/TLS 1.2+
- Storage accounts disable public blob access
- Key Vault uses RBAC authorization
- Function apps require authentication

### Data Protection
- Cosmos DB automatic encryption at rest
- Key Vault for secrets management
- Application Insights data retention: 90 days
- Storage account secure transfer required

## Monitoring & Alerting

### Health Checks
- Function app health endpoints
- Cosmos DB monitoring
- App Service availability tests
- Key Vault access monitoring

### Alerts
- High error rates
- Performance degradation
- Cost threshold breaches
- Security events

## Troubleshooting

### Common Issues

1. **Deployment Failures**
   - Check Azure CLI version
   - Verify subscription permissions
   - Review ARM template validation errors

2. **Function App Issues**
   - Check application settings
   - Verify Key Vault access
   - Review function logs in Application Insights

3. **Authentication Problems**
   - Verify B2C configuration
   - Check redirect URIs
   - Validate client ID and secrets

### Getting Help

1. **Azure CLI Help**: `az --help`
2. **Template Validation**: `az deployment group validate`
3. **Resource Logs**: Check Application Insights
4. **Azure Status**: [Azure Status Page](https://status.azure.com/)

## Next Steps

After infrastructure deployment:

1. **Configure B2C** - Set up identity provider
2. **Deploy Application Code** - Frontend and backend deployment
3. **Data Migration** - Migrate from Supabase to Cosmos DB
4. **DNS Configuration** - Set up custom domain
5. **SSL Certificate** - Configure HTTPS
6. **Monitoring Setup** - Configure alerts and dashboards

## Support

For infrastructure issues:
- Review deployment logs
- Check Azure Resource Health
- Validate template parameters
- Verify service quotas and limits
