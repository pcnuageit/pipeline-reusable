# CloudFormation: S3 + CloudFront Static Hosting

Template CloudFormation para hospedar sites estáticos com S3 + CloudFront usando **Origin Access Control (OAC)**.

## 📋 Recursos Provisionados

- ✅ S3 Bucket privado (com versionamento e criptografia)
- ✅ CloudFront Distribution com OAC (método recomendado AWS)
- ✅ HTTPS com certificado ACM
- ✅ Security Headers (HSTS, CSP, X-Frame-Options)
- ✅ CloudFront Function (reescrita de URI para SPAs)
- ✅ Cache otimizado por tipo de arquivo
- ✅ Logs de acesso (opcional)
- ✅ CloudWatch Alarms

---

## 🚀 Quick Start

### 1. Pré-requisitos

- Certificado SSL/TLS no **ACM (us-east-1)**
- Credenciais AWS configuradas
- Domínio próprio

### 2. Configurar Variáveis no GitLab

**Settings > CI/CD > Variables**

O pipeline suporta **dois modelos**:

#### 📌 Modelo 1: Mesma Conta AWS (Simples)

**Credenciais AWS (scope: All):**
```
AWS_ACCESS_KEY_ID = AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG... (Protected + Masked)
```

**Parâmetros por Ambiente:**

Development (scope: `develop`):
```
BUCKET_NAME = myapp-dev-cliente123
ACM_CERTIFICATE_ARN = arn:aws:acm:us-east-1:123456789012:certificate/abc123
CLOUDFRONT_ALIAS = dev.myapp.com
ENABLE_VERSIONING = Enabled
ENABLE_LOGGING = true
```

Staging (scope: `staging`):
```
BUCKET_NAME = myapp-staging-cliente123
ACM_CERTIFICATE_ARN = arn:aws:acm:us-east-1:123456789012:certificate/def456
CLOUDFRONT_ALIAS = staging.myapp.com
```

Production (scope: `main`):
```
BUCKET_NAME = myapp-prod-cliente123
ACM_CERTIFICATE_ARN = arn:aws:acm:us-east-1:123456789012:certificate/ghi789
CLOUDFRONT_ALIAS = www.myapp.com
```

---

#### 📌 Modelo 2: Multi-Account (Contas AWS Diferentes)

**Development** (Conta AWS #1, scope: `develop`):
```
DEV_AWS_ACCESS_KEY_ID = AKIAI...DEV (Protected + Masked)
DEV_AWS_SECRET_ACCESS_KEY = wJalr...DEV (Protected + Masked)
DEV_AWS_REGION = us-east-1

BUCKET_NAME = myapp-dev-123
ACM_CERTIFICATE_ARN = arn:aws:acm:us-east-1:111111111111:certificate/abc-dev
CLOUDFRONT_ALIAS = dev.myapp.com
```

**Staging** (Conta AWS #2, scope: `staging`):
```
STAGING_AWS_ACCESS_KEY_ID = AKIAI...STAGING (Protected + Masked)
STAGING_AWS_SECRET_ACCESS_KEY = wJalr...STAGING (Protected + Masked)
STAGING_AWS_REGION = us-east-1

BUCKET_NAME = myapp-staging-456
ACM_CERTIFICATE_ARN = arn:aws:acm:us-east-1:222222222222:certificate/def-staging
CLOUDFRONT_ALIAS = staging.myapp.com
```

**Production** (Conta AWS #3, scope: `main`):
```
PROD_AWS_ACCESS_KEY_ID = AKIAI...PROD (Protected + Masked)
PROD_AWS_SECRET_ACCESS_KEY = wJalr...PROD (Protected + Masked)
PROD_AWS_REGION = us-east-1

BUCKET_NAME = myapp-prod-789
ACM_CERTIFICATE_ARN = arn:aws:acm:us-east-1:333333333333:certificate/ghi-prod
CLOUDFRONT_ALIAS = www.myapp.com
```

> 💡 **Veja `variables.example` para mais cenários e exemplos**

### 3. Estrutura de Arquivos

```
projeto/
├── src/              ← Arquivos estáticos (HTML, CSS, JS)
│   ├── index.html
│   ├── 404.html
│   └── assets/
├── cfn-main.yaml     ← Template CloudFormation
└── .gitlab-ci.yml    ← Pipeline CI/CD
```

### 4. Fazer Deploy

#### Via GitLab CI/CD (Recomendado):

**Development:**
```bash
git checkout develop
git add .
git commit -m "Deploy to dev"
git push origin develop
```
→ Pipeline roda automaticamente

**Staging/Production:**
```bash
git checkout staging  # ou main
git push origin staging
```
→ Pipeline aguarda aprovação manual

#### Via AWS CLI:

```bash
aws cloudformation deploy \
  --template-file cfn-main.yaml \
  --stack-name myapp-dev \
  --parameter-overrides \
    BucketName=myapp-dev-123 \
    AcmCertificateArn=arn:aws:acm:us-east-1:xxx:certificate/xxx \
    CloudFrontAlias=dev.myapp.com \
    EnableVersioning=Enabled \
    Environment=development \
    EnableLogging=true \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

### 5. Upload de Arquivos

Após o deploy da stack:

```bash
# Obter nome do bucket
BUCKET=$(aws cloudformation describe-stacks \
  --stack-name myapp-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketNameOutput`].OutputValue' \
  --output text)

# Sincronizar arquivos
aws s3 sync ./src s3://${BUCKET}/ --delete

# Invalidar cache CloudFront
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name myapp-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/*"
```

### 6. Configurar DNS

Após o deploy, obtenha o domain do CloudFront:

```bash
aws cloudformation describe-stacks \
  --stack-name myapp-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionDomainName`].OutputValue' \
  --output text
```

Configure um registro CNAME no seu DNS:

```
Type: CNAME
Name: dev.myapp.com
Value: d111111abcdef8.cloudfront.net
TTL: 300
```

---

## ⚙️ Parâmetros do Template

| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `BucketName` | String | - | Nome único do bucket S3 |
| `AcmCertificateArn` | String | - | ARN do certificado ACM **(us-east-1)** |
| `CloudFrontAlias` | String | - | Domínio personalizado |
| `EnableVersioning` | String | `Enabled` | Versionamento do S3 |
| `Environment` | String | `production` | Ambiente (development/staging/production) |
| `EnableLogging` | String | `true` | Habilitar logs do CloudFront |

---

## 📊 Pipeline GitLab CI/CD

### Características:

- ✅ **Multi-Account**: Suporta ambientes em contas AWS diferentes
- ✅ **Idempotente**: Cria ou atualiza stack automaticamente
- ✅ **Agnóstico**: Funciona em qualquer conta AWS
- ✅ **Completo**: Deploy + sync em um único job

### Stages:

1. **validate** - Valida o template CloudFormation
2. **deploy** - Provisiona/atualiza stack + sync arquivos + invalidação cache
3. **teardown** - Remove a stack (manual)

### Ambientes:

| Branch | Ambiente | Deploy | Credenciais |
|--------|----------|--------|-------------|
| `develop` | Development | Automático | `DEV_AWS_*` ou global |
| `staging` | Staging | Manual | `STAGING_AWS_*` ou global |
| `main`/`master` | Production | Manual | `PROD_AWS_*` ou global |

### Comportamento Idempotente:

```bash
# Pipeline verifica automaticamente:

if stack não existe:
  ✅ CRIA stack CloudFormation completa
  ✅ Cria S3, CloudFront, OAC, etc.
  ✅ Faz sync dos arquivos
  ✅ Invalida cache
else:
  ✅ ATUALIZA stack existente
  ✅ Faz sync dos arquivos
  ✅ Invalida cache
```

### Fluxo Completo:

```mermaid
graph TD
    A[Push Code] --> B[Validate Template]
    B --> C{Stack Existe?}
    C -->|Não| D[CREATE Stack]
    C -->|Sim| E[UPDATE Stack]
    D --> F[Aguardar Stack Ready]
    E --> F
    F --> G[Sync Files S3]
    G --> H[Invalidate Cache]
    H --> I[✅ Site Online]
```

### Multi-Account:

O pipeline detecta automaticamente qual conta usar:

```bash
# Development
if DEV_AWS_ACCESS_KEY_ID existe:
  usa credenciais DEV → Conta AWS #1
else:
  usa credenciais globais

# Staging
if STAGING_AWS_ACCESS_KEY_ID existe:
  usa credenciais STAGING → Conta AWS #2
else:
  usa credenciais globais

# Production
if PROD_AWS_ACCESS_KEY_ID existe:
  usa credenciais PROD → Conta AWS #3
else:
  usa credenciais globais
```

---

## 🔐 Segurança

### Implementado:

- ✅ S3 Bucket 100% privado
- ✅ Origin Access Control (OAC) com AWS SigV4
- ✅ HTTPS forçado (TLS 1.2+)
- ✅ Security Headers:
  - `Strict-Transport-Security`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Content-Security-Policy`
- ✅ Criptografia AES-256 no S3
- ✅ Deny insecure connections

---

## ⚡ Performance

### Cache Behaviors Otimizados:

| Tipo de Arquivo | Compress | Cache TTL | Por quê? |
|-----------------|----------|-----------|----------|
| HTML | ✅ Sim | Moderado | Conteúdo dinâmico, atualiza frequentemente |
| CSS/JS | ✅ Sim | Longo (1 ano) | Reduz 70-80% do tamanho, muda pouco |
| PNG/JPG | ❌ Não | Longo (1 ano) | Já comprimidos, não adianta comprimir |

### Resultado:

- **70-80% menor** transferência de dados (CSS/JS)
- **3-5x mais rápido** carregamento (cache otimizado)
- **Economia de banda** CloudFront e usuários

---

## 📝 Outputs da Stack

| Output | Descrição |
|--------|-----------|
| `DistributionId` | ID da distribuição CloudFront |
| `DistributionDomainName` | Domain do CloudFront (para DNS) |
| `BucketNameOutput` | Nome do bucket S3 criado |
| `BucketArn` | ARN do bucket |
| `CloudFrontURL` | URL completa (https://seu-dominio.com) |
| `OACId` | ID do Origin Access Control |
| `LogsBucketName` | Bucket de logs (se habilitado) |

---

## 🧪 Validação e Testes

### Validar Template:

```bash
aws cloudformation validate-template \
  --template-body file://cfn-main.yaml \
  --region us-east-1
```

### Testar Site:

```bash
# Teste básico
curl -I https://dev.myapp.com/

# Verificar security headers
curl -I https://dev.myapp.com/ | grep -i "strict-transport-security\|x-frame-options"

# Verificar compressão
curl -I -H "Accept-Encoding: gzip" https://dev.myapp.com/styles.css | grep "content-encoding"
```

---

## 🆘 Troubleshooting

### Erro 502 - CloudFront Function

**Causa**: CloudFront Function tentando adicionar headers não permitidos

**Solução**: Já corrigido no template atual (removido `x-forwarded-proto`)

### Erro 403 Forbidden

**Causa**: BucketPolicy ou OAC não configurados corretamente

**Solução**: 
```bash
# Verificar se OAC existe
aws cloudformation describe-stack-resources \
  --stack-name myapp-dev \
  --logical-resource-id CloudFrontOAC

# Verificar BucketPolicy
aws s3api get-bucket-policy --bucket myapp-dev-123
```

### Certificado não encontrado

**Causa**: Certificado não está em us-east-1

**Solução**: CloudFront exige certificado em **us-east-1**
```bash
aws acm list-certificates --region us-east-1
```

### DNS não resolve

**Causa**: Propagação DNS em andamento

**Solução**: Aguardar até 48h (geralmente < 1h)
```bash
dig dev.myapp.com
nslookup dev.myapp.com
```

---

## 💰 Custos Estimados

Site pequeno/médio (10 GB transferência/mês):

| Serviço | Custo Mensal (USD) |
|---------|-------------------|
| S3 Storage (10 GB) | $0.23 |
| S3 Requests (1M) | $0.40 |
| CloudFront (10 GB) | $0.85 |
| CloudFront Requests (1M) | $0.75 |
| CloudWatch Logs | $0.50 |
| **Total** | **~$3-5/mês** |

**Nota**: CloudFront oferece 1 TB grátis no primeiro ano (Free Tier).

---

## 🔄 Atualização de Stack Existente

```bash
aws cloudformation update-stack \
  --stack-name myapp-dev \
  --template-body file://cfn-main.yaml \
  --parameters ParameterKey=BucketName,UsePreviousValue=true \
               ParameterKey=AcmCertificateArn,UsePreviousValue=true \
               ParameterKey=CloudFrontAlias,UsePreviousValue=true \
  --capabilities CAPABILITY_IAM
```

---

## 🗑️ Remover Stack

### Via GitLab CI/CD:

Na pipeline, clique em **"destroy:dev"** (ou staging/production)

### Via AWS CLI:

```bash
# Esvaziar bucket primeiro
aws s3 rm s3://myapp-dev-123 --recursive
aws s3 rm s3://myapp-dev-123-cloudfront-logs --recursive

# Deletar stack
aws cloudformation delete-stack --stack-name myapp-dev
aws cloudformation wait stack-delete-complete --stack-name myapp-dev
```

---

## 📚 Documentação Adicional

- [AWS CloudFormation](https://docs.aws.amazon.com/cloudformation/)
- [Amazon CloudFront](https://docs.aws.amazon.com/cloudfront/)
- [Origin Access Control](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- [CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html)

---

## 📄 Licença

MIT

---

## 👤 Autor

Paulo Cesar Nunes

---

**✅ Template pronto para uso!** 🚀

