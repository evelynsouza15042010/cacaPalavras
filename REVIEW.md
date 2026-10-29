# Revisão do projeto — Palavra Secreta

Data: 2026-10-29
Tipo: revisão simulada por dois papéis especialistas.

## Agente 1 — Conformidade com o PRD

### Verificações

- [x] Menu com seleção de modos.
- [x] Modo Termo com comparação de letras.
- [x] Modo Charadas com respostas digitadas.
- [x] Modo Palavra Misteriosa com pistas.
- [x] Feedback de acerto e erro.
- [x] Reiniciar desafio.
- [x] Retornar ao menu.
- [x] Layout responsivo básico.
- [x] Uso sem cadastro ou serviços externos.

### Pendências

- [ ] Validar palavras do Termo usando dicionário.
- [ ] Adicionar mais palavras e charadas.
- [ ] Criar testes automatizados.
- [ ] Testar com leitores de tela.
- [ ] Medir contraste com ferramenta de acessibilidade.
- [ ] Testar em dispositivos reais.
- [ ] Implementar estatísticas, se aprovadas no PRD.

Conclusão: o protótipo cobre os fluxos essenciais, mas não
deve ser considerado pronto para produção.

## Agente 2 — Revisão do código

### Pontos positivos

- Implementação sem dependências externas.
- Uso de elementos HTML nativos.
- Comparação de letras repetidas no Termo.
- Mensagens de estado anunciadas por aria-live.
- Código concentrado em um arquivo fácil de executar.

### Melhorias necessárias

1. Separar regras de jogo, dados e interface em módulos.
2. Adicionar testes para letras repetidas e acentos.
3. Criar uma lista de respostas alternativas para charadas.
4. Validar tentativas contra um vocabulário português.
5. Revisar os botões e mensagens com leitor de tela.
6. Adicionar testes de regressão para reiniciar e trocar de modo.

Conclusão: adequado para protótipo local, com melhorias
necessárias antes de publicação.