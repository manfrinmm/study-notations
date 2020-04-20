# Display: flex

<!-- fazer o documento ocupar 100% da tela(altura):
html,body,#app{ height:100%; margin:0; } -->

<!-- ### Fazer o documento ocupar 100% do espaço contido

```css
height: 100%;
``` -->

## PROPRIEDADES

- `flex-direction: row;` -> itens sempre seguir na mesma linha (Padrão).
- `flex-direction: row-reverse;` -> itens sempre seguir na mesma linha, porém inverso.
- `flex-direction: column;` -> itens sempre seguir na mesma coluna.
- `flex-direction: column-reverse;` -> itens sempre seguir na mesma coluna, porém inverso.

## Alinhamento

- `flex-direction: row;`
  - `align-items` -> alinhar verticalmente.
  - `justify-content` -> alinhar horizontalmente.
- `flex-direction: column;`
  - `align-items` -> alinhar horizontalmente.
  - `justify-content` -> alinhar verticalmente.
  - `align-self` -> alinha próprio elemento.

---

- `align-items: flex-start` -> alinhar conteúdo ao começo do espaço disponível (Padrão).
- `justify-content: flex-start` -> alinhar conteúdo ao começo do espaço disponível (Padrão).

---

- `align-items: flex-end` -> alinhar conteúdo ao final do espaço disponível.
- `justify-content: flex-end` -> alinhar conteúdo ao final do espaço disponível.

---

- `align-items: center` -> alinhar conteúdo ao centro do espaço disponível.
- `justify-content: center` -> alinhar conteúdo ao centro do espaço disponível.

---

- `align-items: baseline` -> alinhar todo o texto na mesma linha, ou seja, todos ficam na altura da mesma linha. Geralmente utilizado para alinhar textos.

---

- `justify-content: space-between` -> coloca um espaço igual entre os itens.

---

- `justify-content: space-around;` -> coloca um espaço igual entre os itens com espaço no começo e fim.

---

## Redimensionamento

- `flex-grow: 1;` -> aceita ser aumentado para caber no container dele (ocupa toda largura disponível em tela) (padrão).
- `flex-shrink: 1;` -> aceita ser espremido para caber no container (padrão).
- `flex-basis: 20px` -> Define qual é o tamanho padrão de um elemento antes de aumentar ou diminuir. Valor `auto` é o padrão dessa propriedade.
- `flex: 1 0 20px;` -> agrupamento de grow, shrink e basis, nessa ordem.
- `flex: 1;` -> permite aumentar e espremer.

## Quebra de linhas

- `flex-wrap: wrap;` -> permite quebrar linha, primeiro elemento começa no início do espaço disponível.
- `flex-wrap: wrap-reverse;` -> permite quebrar linha, primeiro elemento começa no fim do espaço disponível.

  Alinhamento :

  - `align-content` -> Alinhar elementos que estão em mais de uma linha. Recebe as mesmas propriedades que o `justify-content`.

## Espaçamento

- `padding: 0 12px;` -> primeiro valor `vertical` segundo valor `horizontal`.
- `padding: 0 12px 10px 5px;` -> sentido horário.
- `box-shadow: 0 1px 3px` -> primeiro valor quantos px a direita se posicionar horizontalmente, segundo verticalmente, terceiro blur

## PROPRIEDADES-ORDEM:

### Exemplo: Colocar/Mudar em order elementos

```css
.red {
  order: 1;
}

.blue {
  order: 2;
}

.green {
  order: 0;
}
```

# Aplicação

### Propriedades em geral

- `box-sizing: border-box;` -> Faz com que o padding não aumente a largura e altura de um elemento.

- `text-rendering: optimizeLegibility !important` -> Renderizar a fonte com uma melhor qualidade. `!important`, serve para que esse valor sobrescreva qualquer outro valor.

- `-webkit-font-smoothing: antialiased !important` -> Melhora o render das fontes.
