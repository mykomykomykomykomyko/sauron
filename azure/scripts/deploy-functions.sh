
#!/bin/bash

# Azure Functions Deployment Script
# Usage: ./deploy-functions.sh [environment] [function-app-name]

set -e

ENVIRONMENT=${1:-dev}
FUNCTION_APP_NAME=${2:-func-eyeofjasper-$ENVIRONMENT}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}⚡ Deploying Azure Functions for Eye of Jasper${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Function App: $FUNCTION_APP_NAME${NC}"

# Check if Function App exists
if ! az functionapp show --name $FUNCTION_APP_NAME --resource-group rg-eye-of-jasper-$ENVIRONMENT &> /dev/null; then
    echo -e "${RED}❌ Function App $FUNCTION_APP_NAME not found${NC}"
    exit 1
fi

# Create functions directory if it doesn't exist
if [ ! -d "azure/functions" ]; then
    mkdir -p azure/functions
    echo -e "${GREEN}📁 Created azure/functions directory${NC}"
fi

# Build and deploy functions
echo -e "${YELLOW}🔨 Building Azure Functions...${NC}"

# Initialize function app if needed
cd azure/functions
if [ ! -f "host.json" ]; then
    echo -e "${YELLOW}🚀 Initializing function app...${NC}"
    func init . --worker-runtime node --language typescript
fi

# Deploy to Azure
echo -e "${YELLOW}📤 Deploying to Azure...${NC}"
func azure functionapp publish $FUNCTION_APP_NAME --typescript

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Function deployment successful${NC}"
else
    echo -e "${RED}❌ Function deployment failed${NC}"
    exit 1
fi

cd ../..

echo -e "\n${GREEN}🎉 Azure Functions deployed successfully!${NC}"
echo -e "${YELLOW}📋 Available endpoints:${NC}"
echo -e "  - https://$FUNCTION_APP_NAME.azurewebsites.net/api/analyze-report"
echo -e "  - https://$FUNCTION_APP_NAME.azurewebsites.net/api/create-account"
echo -e "  - https://$FUNCTION_APP_NAME.azurewebsites.net/api/health"
