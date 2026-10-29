# SPECS — Palavra Secreta

**Versão:** 0.2
**Data:** 2026-10-29

## 1. Arquitetura

A primeira versão será uma aplicação web estática.

Tecnologias:
- HTML5 para estrutura.
- CSS3 para aparência e responsividade.
- JavaScript para regras e estado do jogo.

Não será necessário instalar bibliotecas ou configurar um
processo de compilação.

## 2. Organização lógica

A aplicação terá quatro áreas:

1. Menu principal.
2. Motor do modo Termo.
3. Motor do modo Charadas.
4. Motor do modo Palavra Misteriosa.

Cada modo terá suas próprias regras, mas compartilhará
componentes visuais e mecanismos de navegação.

## 3. Modelo de dados

### Termo

Puzzle:
- answer: palavra secreta.
- length: quantidade de letras.
- maxAttempts: número máximo de tentativas.

Guess:
- word: palavra digitada.
- feedback: resultado de cada letra.

### Charadas

Riddle:
- question: texto da charada.
- answer: resposta correta.
- hints: lista de pistas.
- category: categoria opcional.

### Palavra Misteriosa

MysteryPuzzle:
- answer: palavra secreta.
- hints: pistas em ordem progressiva.
- category: categoria opcional.

## 4. Regras do Termo

A comparação deve considerar letras repetidas.

Procedimento:
1. Normalizar a entrada conforme a política linguística.
2. Marcar as letras corretas nas posições corretas.
3. Contabilizar as letras restantes da resposta.
4. Marcar letras presentes em outras posições.
5. Marcar as letras ausentes.
6. Atualizar a interface com o resultado.

Uma letra correta já consumida não deve ser reutilizada
para indicar incorretamente outra ocorrência da mesma letra.

A validação do dicionário é uma responsabilidade separada
da comparação entre tentativa e resposta.

## 5. Regras das charadas

- Remover espaços no início e no final.
- Comparar sem distinguir maiúsculas e minúsculas.
- Manter uma lista explícita de respostas alternativas válidas
  quando necessário.
- Não revelar a resposta antes de o jogador acertar ou pedir
  para revelá-la.
- Não contabilizar entradas vazias.

## 6. Regras da Palavra Misteriosa

- Exibir a primeira pista no início.
- Revelar uma pista por solicitação.
- Manter o histórico de tentativas.
- Encerrar a rodada ao acertar ou revelar a resposta.
- Não simular um algoritmo de proximidade semântica.

## 7. Navegação

O menu permite iniciar qualquer modo implementado.

Cada partida oferece:
- Voltar ao menu.
- Reiniciar a rodada.
- Consultar as regras.
- Visualizar o resultado.

A navegação deve manter uma ordem de foco previsível.

## 8. Acessibilidade

- Associar rótulos aos campos.
- Usar botões HTML nativos.
- Fornecer foco visível.
- Comunicar os resultados por texto.
- Usar regiões de status acessíveis.
- Não depender apenas de cores.
- Respeitar prefers-reduced-motion.
- Verificar contraste e funcionamento com leitores de tela.

## 9. Persistência

Na primeira versão, o progresso pode permanecer apenas
na memória da página.

Se o produto exigir estatísticas persistentes, poderá ser
adicionado localStorage, após definir quais dados serão
salvos e como reiniciar o progresso.

## 10. Testes

Termo:
- Acerto de letra na posição correta.
- Letra existente em posição errada.
- Letra ausente.
- Letras repetidas.
- Palavra inválida.
- Vitória e esgotamento das tentativas.

Charadas:
- Resposta correta.
- Resposta incorreta.
- Resposta alternativa válida.
- Pistas adicionais.
- Revelação da resposta.

Palavra Misteriosa:
- Avanço das pistas.
- Esgotamento das pistas.
- Tentativas duplicadas.
- Acerto e revelação.

Interface:
- Navegação por teclado.
- Foco visível.
- Layout em telas estreitas.
- Feedback acessível.
- Retorno ao menu após uma rodada.

## 11. Limitações

A aplicação não terá inicialmente:
- Dicionário abrangente de português.
- Backend.
- Multiplayer.
- Ranking online.
- Motor semântico.
- Geração automática de conteúdo.

Essas funcionalidades devem ser tratadas como evoluções
futuras e documentadas antes de serem implementadas.