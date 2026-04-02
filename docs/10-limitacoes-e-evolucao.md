# Limitacoes e Evolucao

## Objetivo

Registrar de forma transparente o estado atual do sistema, suas limitacoes conhecidas e os proximos passos recomendados.

## Limitacoes identificadas no estado atual

- parte da documentacao antiga ainda nao reflete toda a estrutura real do projeto;
- a documentacao de API ainda precisa ser detalhada endpoint por endpoint;
- o processo de instalacao ainda depende de consolidacao completa dos scripts e da ordem de execucao;
- faltam evidencias visuais e testes documentados para a versao final da entrega.

## Riscos operacionais que merecem registro

- divergencia entre scripts SQL e estrutura efetiva do banco em ambientes diferentes;
- configuracoes locais inconsistentes entre backend, frontend e banco;
- dependencia de conhecimento informal do grupo para algumas tarefas administrativas.

## Melhorias sugeridas

- criar um `.env.example` oficial;
- consolidar um guia unico de setup do banco;
- documentar todos os endpoints da API com exemplos reais;
- incluir capturas de tela do sistema em uso;
- formalizar casos de teste com evidencia;
- padronizar a documentacao do backend e frontend conforme a estrutura real.

## Valor academico deste documento

Este arquivo demonstra maturidade do projeto ao explicitar o que foi concluido, o que ainda depende de refinamento e como outra equipe poderia continuar a evolucao do sistema.