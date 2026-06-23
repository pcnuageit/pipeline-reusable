#!/bin/bash
################################################################################
# Deploy CloudFront + S3 — Dashboards Inttegrar
# Conta: 045312531289 | Domínio: inttegrasocial.com.br
#
# Nomenclatura:
#   Stack:  {project}-{app}-{env}
#   Bucket: {project}-{app}-{env}-{accountId}
#   Logs:   {project}-{app}-{env}-{accountId}-cf-logs
#
# Uso:
#   ./deploy-inttegrar-inttegrasocial.sh                    # Deploy todos
#   ./deploy-inttegrar-inttegrasocial.sh concorrencia       # Deploy 1 cliente
#   ./deploy-inttegrar-inttegrasocial.sh concorrencia-mt    # Deploy 1 cliente
#
# Pré-requisitos:
#   - AWS CLI v2 configurado com credenciais da conta 045312531289
#   - Certificado ACM em us-east-1 para *.inttegrasocial.com.br
################################################################################

set -euo pipefail

# ─── Configuração global ─────────────────────────────────────────────────────

ACCOUNT_ID="385697366782"
TEMPLATE_FILE="cfn-main.yaml"
ENVIRONMENT="production"
COST_CENTER="tecnologia"
OWNER="team-project"

# Certificado ACM — DEVE estar em us-east-1 (requisito CloudFront)
# TODO: Substituir pelo ARN real do certificado *.inttegrasocial.com.br
ACM_CERT_ARN="arn:aws:acm:us-east-1:385697366782:certificate/e22a66fc-6590-4616-8fe2-0ac847fed76b"

# Route 53 Hosted Zone ID para *.inttegrasocial.com.br
# TODO: Substituir pelo ID real da Hosted Zone no Route 53
HOSTED_ZONE_ID="Z09090242MKKGRZH1IKC2"

# CSP padrão para dashboards React
CSP="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self' https:; frame-ancestors 'none';"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── Definição dos clientes ──────────────────────────────────────────────────
# Formato: "nome|project_name|app_name|region|alias"
# Alias vazio = deploy sem domínio customizado (acesso via *.cloudfront.net)
# Após deploy, atualizar alias com subdomínio definitivo

CLIENTS=(
  "seduc|portal|seduc|sa-east-1|seduc.go.inttegrasocial.com.br"
  "secti|portal|secti|sa-east-1|secti.go.inttegrasocial.com.br"
  "seapa|portal|seapa|sa-east-1|seapa.go.inttegrasocial.com.br"
  "seaf|portal|seaf|sa-east-1|seaf.go.inttegrasocial.com.br"
  "retomada|portal|retomada|sa-east-1|retomada.go.inttegrasocial.com.br"
  "pmgo|portal|pmgo|sa-east-1|pmgo.go.inttegrasocial.com.br"
  "itumbiara|portal|itumbiara|sa-east-1|itumbiara.go.inttegrasocial.com.br"
  "itapuranga|portal|itapuranga|sa-east-1|itapuranga.go.inttegrasocial.com.br"
  "itaberai|portal|itaberai|sa-east-1|itaberai.go.inttegrasocial.com.br"
  "goiania|portal|goiania|sa-east-1|goiania.go.inttegrasocial.com.br"
  "firminopolis|portal|firminopolis|sa-east-1|firminopolis.go.inttegrasocial.com.br"
  "corumbaiba|portal|corumbaiba|sa-east-1|corumbaiba.go.inttegrasocial.com.br"
  "aprobank|portal|aprobank|sa-east-1|aprobank.go.inttegrasocial.com.br"
  "amazonbank|portal|amazonbank|sa-east-1|amazonbank.go.inttegrasocial.com.br"
  #"sandbox|portal|sandbox|sa-east-1|sandbox.go.inttegrasocial.com.br"
  #"seds|portal|seds|sa-east-1|seds.go.inttegrasocial.com.br
)

# ─── Função de deploy ────────────────────────────────────────────────────────

deploy_client() {
  local CLIENT_DEF="$1"
  IFS='|' read -r NAME PROJECT_NAME APP_NAME REGION ALIAS <<< "$CLIENT_DEF"

  local STACK_NAME="${PROJECT_NAME}-${APP_NAME}-prod"

  echo ""
  echo "============================================================"
  echo " Deploying: ${NAME}"
  echo " Stack:     ${STACK_NAME}"
  echo " Region:    ${REGION}"
  echo " Alias:     ${ALIAS:-'(sem alias)'}"
  echo "============================================================"

  # Monta parâmetros base
  local PARAMS=(
    "ProjectName=${PROJECT_NAME}"
    "ApplicationName=${APP_NAME}"
    "Environment=${ENVIRONMENT}"
    "CostCenter=${COST_CENTER}"
    "Owner=${OWNER}"
    "CreateNewBucket=true"
    "EnableVersioning=Enabled"
    "EnableLifecycleRules=true"
    "NoncurrentVersionExpirationDays=30"
    "AcmCertificateArn=${ACM_CERT_ARN}"
    "HostedZoneId=${HOSTED_ZONE_ID}"
    "PriceClass=PriceClass_100"
    "DefaultRootObject=index.html"
    "HttpVersion=http2and3"
    "EnableIPv6=true"
    "MinimumTLSVersion=TLSv1.2_2021"
    "EnableGeoRestriction=false"
    "GeoRestrictionType=whitelist"
    "GeoRestrictionLocations=BR,US"
    "WebACLId="
    "DefaultTTL=86400"
    "MaxTTL=31536000"
    "MinTTL=0"
    "EnableCompression=true"
    "EnableCloudFrontLogging=true"
    "EnableCloudWatchAlarms=true"
    "EnableDashboard=false"
    "LogRetentionDays=90"
    "AlarmSNSTopicArn="
    "EnableSecurityHeaders=true"
    "FrameOption=DENY"
    "ContentSecurityPolicy=${CSP}"
  )

  # Alias (se definido)
  if [ -n "$ALIAS" ]; then
    PARAMS+=("CloudFrontAliases=${ALIAS}")
  else
    PARAMS+=("CloudFrontAliases=placeholder.example.com")
  fi

  aws cloudformation deploy \
    --template-file "${SCRIPT_DIR}/${TEMPLATE_FILE}" \
    --stack-name "${STACK_NAME}" \
    --region "${REGION}" \
    --no-fail-on-empty-changeset \
    --parameter-overrides "${PARAMS[@]}" \
    --tags \
      "cost-allocation:project=${PROJECT_NAME}" \
      "operational-support:application=${APP_NAME}" \
      "operational-support:environment=${ENVIRONMENT}" \
      "cost-allocation:cost-center=${COST_CENTER}" \
      "operational-support:team=${OWNER}" \
      "metadata:managed-by=CloudFormation"

  echo ""
  echo "✅ ${NAME} deployed successfully"
  echo ""

  # Mostra outputs
  echo "📋 Outputs:"
  aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --region "${REGION}" \
    --query 'Stacks[0].Outputs[?OutputKey==`BucketName` || OutputKey==`DistributionId` || OutputKey==`DistributionDomainName`].{Key:OutputKey,Value:OutputValue}' \
    --output table
  echo ""
}

# ─── Main ─────────────────────────────────────────────────────────────────────

TARGET="${1:-all}"

if [ "$TARGET" = "all" ]; then
  echo "🚀 Deploying ALL dashboard clients..."
  for CLIENT in "${CLIENTS[@]}"; do
    deploy_client "$CLIENT"
  done
else
  FOUND=false
  for CLIENT in "${CLIENTS[@]}"; do
    IFS='|' read -r NAME _ <<< "$CLIENT"
    if [ "$NAME" = "$TARGET" ]; then
      deploy_client "$CLIENT"
      FOUND=true
      break
    fi
  done

  if [ "$FOUND" = false ]; then
    echo "❌ Cliente '${TARGET}' não encontrado."
    echo ""
    echo "Clientes disponíveis:"
    for CLIENT in "${CLIENTS[@]}"; do
      IFS='|' read -r NAME _ <<< "$CLIENT"
      echo "  - ${NAME}"
    done
    exit 1
  fi
fi

echo "============================================================"
echo " Deploy concluído!"
echo "============================================================"
echo ""
echo "Próximos passos:"
echo "  1. Anotar BucketName e DistributionId dos outputs acima"
echo "  2. Configurar DNS (CNAME) apontando para o CloudFront Domain"
echo "  3. Criar/atualizar caller workflow no repo da aplicação"
echo "     com o bucket e CloudFront ID corretos"
echo ""
