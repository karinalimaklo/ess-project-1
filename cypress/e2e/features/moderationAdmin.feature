Feature: Painel de Moderação e Ações do Administrador

Background:
  Given Admin logado como "Admin Teste"
  And o administrador acessa a página de moderação através do menu lateral
  And o denunciado "Utilizador Denunciado" tem reviews denunciadas
  And o admin clica no utilizador "Utilizador Denunciado"
  And o modal de detalhes do utilizador deve abrir
  And ele deve ver a lista de reviews denunciadas

Scenario: Administrador oculta e reexibe uma review
  And o admin expande a primeira review denunciada
  And ele deve ver o botão "Ocultar review"
  And o admin aperta no botão "Ocultar review"
  Then o botão do ocultar deve mudar para "Reexibir review"
  When o admin aperta no botão "Reexibir review"
  Then o botão do ocultar deve mudar para "Ocultar review"
