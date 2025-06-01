
#!/bin/bash

# Azure AD B2C Setup Script
# Usage: ./setup-b2c.sh [tenant-name] [domain-name]

set -e

TENANT_NAME=${1:-eyeofjasperb2c}
DOMAIN_NAME=${2:-eyeofjasper.onmicrosoft.com}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🏢 Setting up Azure AD B2C for Eye of Jasper${NC}"
echo -e "${YELLOW}Tenant Name: $TENANT_NAME${NC}"
echo -e "${YELLOW}Domain: $DOMAIN_NAME${NC}"

# Check if Azure CLI is installed and user is logged in
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed${NC}"
    exit 1
fi

if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Please log in to Azure${NC}"
    az login
fi

echo -e "\n${YELLOW}📋 B2C Setup Instructions:${NC}"
echo -e "Since Azure AD B2C setup requires manual configuration through the portal,"
echo -e "please follow these steps:"
echo ""
echo -e "${GREEN}1. Create B2C Tenant:${NC}"
echo -e "   - Go to https://portal.azure.com"
echo -e "   - Search for 'Azure AD B2C'"
echo -e "   - Click 'Create a B2C tenant'"
echo -e "   - Tenant name: $TENANT_NAME"
echo -e "   - Domain: $DOMAIN_NAME"
echo ""
echo -e "${GREEN}2. Register Application:${NC}"
echo -e "   - In your B2C tenant, go to 'App registrations'"
echo -e "   - Click 'New registration'"
echo -e "   - Name: 'Eye of Jasper Web App'"
echo -e "   - Redirect URIs:"
echo -e "     - https://localhost:3000/auth/callback (for dev)"
echo -e "     - https://app-eyeofjasper-prod.azurewebsites.net/auth/callback (for prod)"
echo ""
echo -e "${GREEN}3. Configure User Flows:${NC}"
echo -e "   - Go to 'User flows'"
echo -e "   - Create 'Sign up and sign in' flow:"
echo -e "     - Name: B2C_1_signupsignin"
echo -e "     - Identity providers: Email signup"
echo -e "     - User attributes: Given Name, Surname, Email, Company Name"
echo -e "     - Application claims: All selected attributes + User ID"
echo ""
echo -e "   - Create 'Password reset' flow:"
echo -e "     - Name: B2C_1_passwordreset"
echo -e "     - Identity providers: Email"
echo ""
echo -e "   - Create 'Profile editing' flow:"
echo -e "     - Name: B2C_1_profileediting"
echo -e "     - User attributes: Given Name, Surname, Company Name"
echo ""
echo -e "${GREEN}4. Configure API Permissions:${NC}"
echo -e "   - In your app registration, go to 'API permissions'"
echo -e "   - Add Microsoft Graph permissions:"
echo -e "     - User.Read"
echo -e "     - offline_access"
echo ""
echo -e "${GREEN}5. Get Configuration Values:${NC}"
echo -e "   - Tenant ID: Available in B2C tenant overview"
echo -e "   - Client ID: Available in app registration overview"
echo -e "   - Create client secret in 'Certificates & secrets'"
echo ""
echo -e "${YELLOW}🔐 After setup, add these values to Key Vault:${NC}"
echo -e "   - b2c-tenant-id"
echo -e "   - b2c-client-id"
echo -e "   - b2c-client-secret"
echo ""
echo -e "${GREEN}✅ Sample B2C Configuration:${NC}"

cat << 'EOF'
{
  "instance": "https://yourtenant.b2clogin.com/",
  "clientId": "your-client-id",
  "authority": "https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/B2C_1_signupsignin",
  "knownAuthorities": ["yourtenant.b2clogin.com"],
  "redirectUri": "https://your-app.azurewebsites.net/auth/callback",
  "postLogoutRedirectUri": "https://your-app.azurewebsites.net/",
  "scopes": ["openid", "profile", "User.Read"]
}
EOF

echo -e "\n${GREEN}🎉 B2C setup guide completed!${NC}"
echo -e "${YELLOW}Next: Configure the values in your application${NC}"
