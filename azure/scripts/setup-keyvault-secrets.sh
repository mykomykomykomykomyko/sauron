
#!/bin/bash

# Key Vault Secrets Setup Script
# Usage: ./setup-keyvault-secrets.sh [environment] [key-vault-name]

set -e

ENVIRONMENT=${1:-dev}
KEY_VAULT_NAME=${2:-kv-eyeofjasper-$ENVIRONMENT}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 Setting up Key Vault secrets for Eye of Jasper${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Key Vault: $KEY_VAULT_NAME${NC}"

# Check if Key Vault exists
if ! az keyvault show --name $KEY_VAULT_NAME &> /dev/null; then
    echo -e "${RED}❌ Key Vault $KEY_VAULT_NAME not found${NC}"
    exit 1
fi

# Function to set secret with prompt
set_secret() {
    local secret_name=$1
    local secret_description=$2
    local secret_example=$3
    
    echo -e "\n${YELLOW}Setting up: $secret_name${NC}"
    echo -e "Description: $secret_description"
    echo -e "Example: $secret_example"
    
    read -s -p "Enter value for $secret_name: " secret_value
    echo
    
    if [ -n "$secret_value" ]; then
        az keyvault secret set \
            --vault-name $KEY_VAULT_NAME \
            --name $secret_name \
            --value "$secret_value" \
            --output none
        echo -e "${GREEN}✅ $secret_name set successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipping $secret_name (empty value)${NC}"
    fi
}

# Set up secrets
echo -e "\n${YELLOW}📝 Please provide the following secrets:${NC}"

set_secret "gemini-api-key" \
    "Google Gemini API key for AI analysis" \
    "AIzaSyC..."

set_secret "jwt-secret" \
    "JWT signing secret (generate a strong random string)" \
    "your-super-secure-jwt-secret-here"

set_secret "b2c-tenant-id" \
    "Azure AD B2C Tenant ID" \
    "12345678-1234-1234-1234-123456789012"

set_secret "b2c-client-id" \
    "Azure AD B2C Application Client ID" \
    "87654321-4321-4321-4321-210987654321"

set_secret "b2c-client-secret" \
    "Azure AD B2C Application Client Secret" \
    "abc123..."

set_secret "smtp-connection-string" \
    "SMTP connection string for email notifications" \
    "smtp://username:password@smtp.gmail.com:587"

echo -e "\n${GREEN}🎉 Key Vault setup completed!${NC}"
echo -e "${YELLOW}📋 Secrets configured in $KEY_VAULT_NAME:${NC}"

# List all secrets
az keyvault secret list --vault-name $KEY_VAULT_NAME --query "[].name" -o table

echo -e "\n${GREEN}✅ Next Steps:${NC}"
echo -e "  1. Configure Function App to access these secrets"
echo -e "  2. Set up Azure AD B2C tenant"
echo -e "  3. Deploy application code"
