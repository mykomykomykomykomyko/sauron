
#!/bin/bash

# Azure Infrastructure Deployment Script for Eye of Jasper
# Usage: ./deploy.sh [environment] [resource-group-name]

set -e

# Default values
ENVIRONMENT=${1:-dev}
RESOURCE_GROUP=${2:-rg-eye-of-jasper-$ENVIRONMENT}
LOCATION="Canada Central"
SUBSCRIPTION_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Azure Infrastructure Deployment for Eye of Jasper${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Resource Group: $RESOURCE_GROUP${NC}"
echo -e "${YELLOW}Location: $LOCATION${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure. Please log in.${NC}"
    az login
fi

# Get current subscription
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo -e "${GREEN}✅ Using subscription: $SUBSCRIPTION_ID${NC}"

# Create resource group if it doesn't exist
echo -e "${YELLOW}📦 Creating resource group...${NC}"
az group create \
    --name $RESOURCE_GROUP \
    --location "$LOCATION" \
    --output table

# Validate ARM template
echo -e "${YELLOW}🔍 Validating ARM template...${NC}"
az deployment group validate \
    --resource-group $RESOURCE_GROUP \
    --template-file azure/templates/main.json \
    --parameters azure/templates/parameters/$ENVIRONMENT.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Template validation successful${NC}"
else
    echo -e "${RED}❌ Template validation failed${NC}"
    exit 1
fi

# Deploy infrastructure
echo -e "${YELLOW}🏗️  Deploying infrastructure...${NC}"
DEPLOYMENT_NAME="eye-of-jasper-deployment-$(date +%Y%m%d-%H%M%S)"

az deployment group create \
    --resource-group $RESOURCE_GROUP \
    --template-file azure/templates/main.json \
    --parameters azure/templates/parameters/$ENVIRONMENT.json \
    --name $DEPLOYMENT_NAME \
    --output table

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Infrastructure deployment successful${NC}"
else
    echo -e "${RED}❌ Infrastructure deployment failed${NC}"
    exit 1
fi

# Get deployment outputs
echo -e "${YELLOW}📋 Retrieving deployment outputs...${NC}"
COSMOS_CONNECTION=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name $DEPLOYMENT_NAME \
    --query properties.outputs.cosmosDbConnectionString.value -o tsv)

WEB_APP_URL=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name $DEPLOYMENT_NAME \
    --query properties.outputs.webAppUrl.value -o tsv)

FUNCTION_APP_URL=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name $DEPLOYMENT_NAME \
    --query properties.outputs.functionAppUrl.value -o tsv)

KEY_VAULT_URI=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name $DEPLOYMENT_NAME \
    --query properties.outputs.keyVaultUri.value -o tsv)

INSTRUMENTATION_KEY=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name $DEPLOYMENT_NAME \
    --query properties.outputs.applicationInsightsInstrumentationKey.value -o tsv)

# Display results
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📊 Deployment Summary:${NC}"
echo -e "  Resource Group: $RESOURCE_GROUP"
echo -e "  Web App URL: $WEB_APP_URL"
echo -e "  Function App URL: $FUNCTION_APP_URL"
echo -e "  Key Vault URI: $KEY_VAULT_URI"
echo ""
echo -e "${YELLOW}🔐 Connection Strings (store these securely):${NC}"
echo -e "  Cosmos DB: $COSMOS_CONNECTION"
echo -e "  Application Insights Key: $INSTRUMENTATION_KEY"
echo ""
echo -e "${GREEN}✅ Next Steps:${NC}"
echo -e "  1. Configure Azure AD B2C tenant"
echo -e "  2. Add secrets to Key Vault"
echo -e "  3. Deploy application code"
echo -e "  4. Configure custom domain and SSL"
