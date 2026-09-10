# Lar da Criança Fermino Magnani — base da primeira versão

Verificação: 9 de setembro de 2026. Protótipo privado, sem coleta de dados ou pagamentos.

## Decisões do usuário

- Preservar a marca atual e não usar a paleta do briefing antigo.
- Manter Facebook mesmo após constatar o rótulo da plataforma “Página não oficial”. O site apresenta apenas “Facebook”, sem atribuir administração ao Lar.
- Omitir quantidades, faixas etárias e horários de atendimento divergentes.
- WhatsApp (14) 99999-9999, Pix XXX.XXX.XXX-XX e contato@exemplo.com permanecem provisórios, sem links ou ações. Telefone fixo (14) 3372-1836 mantido.
- Formulário de parceria com campos e validações básicas. Envio desativado; destinatário e integração ficam para depois. Por solicitação do usuário, sem aviso explicativo no formulário e sem confirmação fictícia de envio.

## Fontes institucionais

- `Respostas Entrevista.docx`: fundação em 1960, início das atividades em 1963, origem ligada às necessidades das famílias, alimentação e cuidados, ampliação do berçário, formação dos profissionais, prioridade de captação e parceria empresarial. Não converter reformulações do briefing em missão, visão ou valores oficiais.
- `briefing_lar_da_crianca_fermino_magnani.docx` e `Briefing Lar da Crianca.docx`: contexto de comunicação; propostas e identidade antiga não prevalecem sobre a entrevista e as instruções atuais.
- Prefeitura: https://www.santacruzdoriopardo.sp.gov.br/terceiro-setor/detalhes/22/159 — consulta de documentos públicos. Links levam ao portal da fonte, não a documentos fictícios.
- Perfil indicado pelo usuário: https://www.instagram.com/lar.fermino2018.magnani/ — nome público “Creche Fermino Magnani anexa EMEI Diva Zacura”.
- Facebook mantido por instrução: https://www.facebook.com/pages/Lar-da-Crian%C3%A7a-Fermino-Magnani/111212248963868 — endereço e telefone visíveis; publicações de visitantes não tomadas como comunicados oficiais.

## Eventos

1. Palestra Mário Sérgio Cortella. Cartaz visível em https://www.instagram.com/lar.fermino2018.magnani/reel/Da356sTpV5f/ — publicação em 16/07/2026. Anuncia 11/09/2026, sexta-feira, 20h, Palácio da Cultura, Rua Conselheiro Antônio Prado 560, Centro, ingresso R$100. Tema: O sentimento de quem educa nos dias de hoje e a relação escola–família. Renda em benefício do Lar. Não há afirmação de disponibilidade atual de ingressos. Após a data, o anúncio passa a histórico sem presumir que o evento efetivamente aconteceu.
2. Formação Lei Lucas: https://www.instagram.com/lar.fermino2018.magnani/reel/DbJBT7zOIPW/ — publicação de 23/07/2026, imagem pública menciona parceria com Prefeitura. Data exibida como publicação, não data inferida do encontro.
3. Festa Junina 2025: https://www.instagram.com/stories/highlights/18131425075427754/ — destaque oficial “festa junina 25”. Exibir somente ano indicado, sem inferir dia, preço ou programação.
4. Festa Junina 2024: https://www.instagram.com/stories/highlights/17995835453487190/ — destaque oficial “festa junina 24”. Mesmo cuidado.

## Imagens e identidade

- `public/images/logo-lar.jpg`: imagem de perfil observada no Instagram oficial. Preservada sem redesenho. Verde, sol amarelo e duas figuras infantis ilustradas. Versão pública de 150×150; aplicação pequena para evitar ampliação excessiva.
- `public/images/cortella-cartaz.jpg`: miniatura do cartaz oficial acima. Uso somente no protótipo privado. Não contém crianças fotografadas. O cartaz original inclui informações próprias de contato; os contatos editáveis do site continuam sendo os placeholders solicitados.
- Cores digitais derivadas visualmente da marca pública; não constituem um novo manual de identidade. Tipografia web de sistema, sem alegação de ser a fonte oficial.
- Nenhuma imagem identificável de criança incorporada. Nenhum feed embutido que possa passar a expor novas fotos automaticamente.
- Foto candidata de prédio em matéria do Jornal Debate descartada porque não foi possível inspecionar a imagem.
- Antes da divulgação pública, confirmar autorização de uso das imagens e contatos oficiais.

## Componentes

- React Bits FadeContent: https://reactbits.dev/animations/fade-content e https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Animations/FadeContent/FadeContent.tsx. Adaptação curta para animação nativa de opacidade, sem GSAP, blur ou ocultação no servidor. Respeita movimento reduzido e mantém conteúdo visível sem JavaScript.
- 21st.dev, Accordion de shadcn/ui: https://21st.dev/@shadcn/components/accordion — licença MIT. Padrão implementado com a versão já incluída no projeto, baseada em Radix. Aplicado à área de transparência.
- Dialog, Sheet e Select do catálogo incluído no projeto: foco, teclado e semântica dos componentes preservados. Botões de fechar localizados em português.

## Pendências para a versão pública

Conectar formulário a destinatário confirmado; decidir tratamento de dados; substituir Pix, e-mail e WhatsApp; confirmar permissões de imagens; revisão institucional final. Não há estatísticas de atendimento, promessas de incentivo fiscal, planos de patrocínio, depoimentos ou logos de parceiros inventados.

## Reformulação visual solicitada

- Fonte de títulos: Baloo 2 ExtraBold; texto: Nunito, arquivos locais obtidos do Google Fonts. Licenças OFL incluídas em public/fonts. Escolha tipográfica digital solicitada pelo usuário, sem alegação de tipografia institucional oficial.
- Hero centralizado com título grosso; cartaz retirado da abertura. Faixa superior com cidade e telefone retirada. Navegação recolhida em painel acionado pelo botão Menu em todas as telas. Ícones decorativos removidos, preservando controles funcionais.
- Fundo `public/images/lar-ambiente.jpg`: recorte estritamente fotográfico, sem geração ou preenchimento, da parte superior esquerda de uma montagem na página 88 de https://avisala.org.br/wp-content/uploads/2025/02/0_2025_02_02_publicacao-com-formatacao_revisado.pdf. A seção é intitulada “Espaços brincantes da EMEI Diva Zacura e Creche Fermino Magnani”. Fonte pública de 2025; não afirmar que a imagem retrata o estado atual de 2026. O usuário autorizou continuar após a proposta explícita do recorte sem IA.
- Somente a sala vazia foi exportada ao diretório público. A montagem e o PDF com crianças permanecem em work, fora dos arquivos publicados e do ZIP de entrega. Recorte 474×358, sem pessoas visíveis. Uso apenas no protótipo privado; a autorização para divulgação pública e uma foto original de maior resolução continuam pendentes.

## GridDistortion — solicitação de 10/09/2026

Código JS-CSS e CSS copiados integralmente do registro https://reactbits.dev/r/GridDistortion-JS-CSS.json para components/GridDistortion.jsx e components/GridDistortion.css. Comparação de conteúdo confirmou correspondência exata. Dependência declarada three@^0.180.0 instalada; versão resolvida 0.180.0.

Integração separada em components/LarHeroBackground.jsx com imageSrc=/images/lar-ambiente.jpg, grid=6, mouse=0.11, strength=0.15, relaxation=0.9, className=custom-class. Mantém o mesmo fundo real recortado anteriormente, sem fotografia genérica. O wrapper preserva proporção e recorte cover, carrega o componente sob demanda, respeita movimento reduzido e mantém fotografia estática em dispositivos sem ponteiro fino/hover ou sem WebGL. O componente é desmontado quando a abertura sai da tela. Texto e botões ficam acima do fundo; a camada visual não interfere na leitura assistiva.

## Correção do efeito e nova foto — 10/09/2026

A inspeção da prévia confirmou prefers-reduced-motion: reduce, que impedia a montagem do canvas. O usuário autorizou explicitamente ativar o efeito mesmo assim. O wrapper agora exige apenas ponteiro fino com hover; demais animações preservam suas regras de movimento reduzido. Código original de GridDistortion e parâmetros permanecem intactos. Verificação no navegador: canvas presente, nenhuma mensagem de erro e distorção visível após interação real do cursor.

O fundo anterior foi substituído por public/images/lar-fachada.png: foto original de 929×619 extraída sem ampliação ou IA da página 70 do PDF (página impressa 137) do livro da Secretaria Municipal de Educação: https://www.santacruzdoriopardo.sp.gov.br/assets/uploads/livros/Livro-Sec-Educacao.pdf. Inspeção visual confirma a placa Lar da Criança Fermino Magnani / E.M.E.I. Profª Diva Zacura, sem pessoas. Uso de referência no protótipo; não afirmar que representa o estado atual do prédio. A proporção do wrapper foi ajustada para 929/619.
