#!/bin/bash
set -e

# Configuration
DOCKER_USERNAME="zimengxiong"
IMAGE_NAME="excalidash"
VERSION=${1:-$(node -e "try { console.log(require('fs').readFileSync('VERSION', 'utf8').trim() + '-dev') } catch { console.log('pre-release') }")}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}ExcaliDash Pre-Release Docker Builder${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo -e "${YELLOW}This will publish images with tag: ${VERSION}${NC}"
echo -e "${YELLOW}Pre-release images will NOT update 'latest' tag${NC}"
echo ""

# Confirm before proceeding
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted.${NC}"
    exit 1
fi

# Check if logged in to Docker Hub
echo -e "${YELLOW}Checking Docker Hub authentication...${NC}"
if ! docker info | grep -q "Username: $DOCKER_USERNAME"; then
    echo -e "${YELLOW}Not logged in. Please login to Docker Hub:${NC}"
    docker login
else
    echo -e "${GREEN}✓ Already logged in as $DOCKER_USERNAME${NC}"
fi

# Create buildx builder if it doesn't exist
echo -e "${YELLOW}Setting up buildx builder...${NC}"
if ! docker buildx inspect excalidash-builder > /dev/null 2>&1; then
    echo -e "${YELLOW}Creating new buildx builder...${NC}"
    docker buildx create --name excalidash-builder --use --bootstrap
else
    echo -e "${GREEN}✓ Using existing buildx builder${NC}"
    docker buildx use excalidash-builder
fi

# Build and push backend image (pre-release only, no latest tag)
echo ""
echo -e "${BLUE}Building and pushing backend pre-release image...${NC}"
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag $DOCKER_USERNAME/$IMAGE_NAME-backend:$VERSION \
    --file backend/Dockerfile \
    --push \
    backend/

echo -e "${GREEN}✓ Backend pre-release image pushed successfully${NC}"

# Build and push frontend image (pre-release only, no latest tag)
echo ""
echo -e "${BLUE}Building and pushing frontend pre-release image...${NC}"
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag $DOCKER_USERNAME/$IMAGE_NAME-frontend:$VERSION \
    --file frontend/Dockerfile \
    --push \
    frontend/

echo -e "${GREEN}✓ Frontend pre-release image pushed successfully${NC}"

echo ""
echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}✓ Pre-release images published!${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""
echo -e "${YELLOW}Images published:${NC}"
echo -e "  • $DOCKER_USERNAME/$IMAGE_NAME-backend:$VERSION"
echo -e "  • $DOCKER_USERNAME/$IMAGE_NAME-frontend:$VERSION"
echo ""