# Lar da Criança Fermino Magnani

Protótipo institucional em React com identidade derivada do perfil público atual do Lar. Inclui história, apoio, parcerias empresariais, formulário em modal, eventos com fontes, transparência e contato.

## Desenvolvimento

Requer Node.js 22.13 ou superior e npm.

```
npm run install:ci
npm run dev
npm run build
```

## Conteúdo e configuração

Os contatos e links estão centralizados em `lib/lar.ts`. A lista de fontes e as decisões de conteúdo estão em `CONTENT_SOURCES.md`.

WhatsApp, Pix e e-mail são provisórios. Seus botões não executam contato ou pagamento. O formulário abre e permite preencher os campos; o envio está desativado até a definição do destinatário e integração. Não armazena ou transmite os dados preenchidos e não exibe sucesso fictício.

As imagens públicas estão limitadas ao protótipo privado. Nenhuma criança fotografada é exibida. Confirmar permissões de uso e dados oficiais antes de divulgação pública.

A página é responsiva. Menu, formulário e seções expansíveis usam componentes Radix/shadcn. A adaptação do FadeContent de React Bits respeita movimento reduzido e mantém conteúdo visível sem JavaScript.
