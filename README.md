# OrderFlow API

API REST em Node.js + TypeScript para processamento e normalização de arquivos de pedidos do sistema legado.
O objetivo desta API é receber um arquivo .txt de um sistema legado via endpoint, com estrutura desnormalizada, realizar um parse e normalizar para uma estrutura aninhada em formato json, ou seja, adequado para comunicar com outros sistemas disponibilizando isto também via API.

---

## :rocket: **Como rodar o projeto**

1. **Instale as dependências:**
```bash
npm install
```

2. **Para realizar o build e start:**
```bash
npm run build
npm start
```

O servidor sobe em http://localhost:3000/

3. **Para rodar testes:**
```bash
npm test
```

:paperclip: Formato do arquivo de entrada
Cada linha do arquivo deve conter:

| Campo         | Tamanho | Tipo                      |
| ------------- | ------- | ------------------------- |
| id usuário    | 10      | numérico |
| nome          | 45      | texto    |
| id pedido     | 10      | numérico |
| id produto    | 10      | numérico |
| valor produto | 12      | decimal  |
| data compra   | 8       | numérico (Formato yyyymmdd)|

### Exemplo de uma linha do arquivo
```
0000000002Medeiros                                   00000123450000000111256.2420201201
```

## :gear: Endpoints
### POST /upload
* Faz upload do arquivo de pedidos (campo file via multipart/form-data).

* Retorna todos os pedidos normalizados.

Exemplo:

```bash
curl -F 'file=@assets/pedidos.txt' http://localhost:3000/upload
```

### GET /orders
* Retorna todos os pedidos já processados.

* Suporta filtros via query:

* * orderId (ex: 12345)

* * startDate e/ou endDate (formato: yyyy-mm-dd)

Exemplo:

#### Filtra todos os pedidos
```bash
curl "http://localhost:3000/orders"
```

#### Filtro por pedido
```bash
curl "http://localhost:3000/orders?orderId=753"
```

#### Filtro por intervalo de data inicial e final
```bash
curl "http://localhost:3000/orders?startDate=2020-12-01&endDate=2021-12-31"
```

#### Filtro por intervalo de pedido, data inicial e final
```bash
curl "http://localhost:3000/orders?orderId=673&startDate=2020-12-01&endDate=2021-12-31"
```

## :bookmark_tabs: Exemplo de resposta parseada e normalizada

```json
[
  {
    "user_id": 2,
    "name": "Medeiros",
    "orders": [
      {
        "order_id": 12345,
        "total": "512.48",
        "date": "2020-12-01",
        "products": [
          { "product_id": 111, "value": "256.24" },
          { "product_id": 112, "value": "256.24" }
        ]
      }
    ]
  }
]
```

## :test_tube: Testes e cobertura

* Testes automatizados cobrem parser, normalização e endpoints REST.

* Para rodar cobertura:

```bash
npm test -- --coverage
```

## :bulb: Decisões arquiteturais e SOLID

* Separação de responsabilidades: parser, normalizador e API REST.

* Uso intenso de interfaces TypeScript.

* Testes automatizados desde a base.

* Lógica desacoplada para facilitar manutenção e extensão.

## :rocket: Automação (Build, Coverage e Qualidade de Código)
Este projeto está totalmente automatizado com integração contínua via GitHub Actions.
A cada push ou pull request, o pipeline executa automaticamente:

* Build do projeto

* Execução dos testes automatizados

* Geração de relatório de cobertura de testes

* Análise de qualidade de código via SonarCloud, incluindo verificação do Quality Gate e acompanhamento de bugs, code smells e cobertura mínima de testes.

Isso garante que todo o fluxo de build, testes e análise de qualidade seja realizado de forma automática, atendendo o item de automação exigido no desafio técnico.


**Desafio resolvido por Pio Lima, aplicando Clean Code, SOLID e foco em simplicidade.**