# Responsividade

## Forma de análisar

- A cada quebra, ou seja, a cada distorção no layout da página é necessário fazer uma quebra.

- Quebra significa que precisa fazer uma adaptação no layout.

- Sempre colocar esse meta para que aplica-se a responsividade no html:

  `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`

- Separando arquivos de media:
  `<link rel="stylesheet" href="./media-print.css" media="print" />`

  - A propriedade `media` identifica qual media será aplicado. `print | screen | media-groups`.

- Sites responsivos dificilmente irá utilizar unidades fixas.

## Unidades de metidas (CSS Units)

Layout fixo

- `px` -> Pixel.

Layout fluido

- `%` -> Porcentagem.
- `auto` -> Automática. Se adaptada automaticamente na altura ou largura.
- `vh` -> Viewport Hight. Aplica-se em relação ao tamanho da altura da tela.
- `vw` -> Viewport Width. Aplica-se em relação ao tamanho da largura da tela.

Textos fixos

- `1px` = `0.75pt`.
- `16px` = `12pt`.

Textos fluidos

- `em` -> Fonte multiplicada pela fonte do elemento pai.
- `rem` -> Fonte multiplicada pela fonte do elemento root (html) - Por padrão ele tem 16px.

Tip

- Mudar tamanho dos elementos que estiverem em ralação ao `rem` de acordo com o tamanho da tela:

  - Calcular os rem com relação aos pixels:

    - Colocar textos fluidos.
    - Colocar margens, paddings, etc...

  ```css
  html {
    /* A cada '1 rem' = '10 px' */
    font-size: 62.5%;

    /* Coloca-se em porcentagem para manter a flexibilidade para o usuário, caso ele tenha um valor diferente de fonte para o navegador, o layout ainda continuaria flexível */
  }

  span {
    /* Isso quer dizer que o spam terá uma font size de 26px */
    font-size: 2.6rem;

    /* Isso quer dizer que a margem terá 8px */
    margin: 0.8rem;
  }

  @media (max-width: 620px) {
    html {
      /* Isso fará que todos os elementos sejam diminuídos proporcionalmente em relação ao tamanho da tela. */
      font-size: 50%;
    }
  }
  ```

## CSS media queries

- Ela que irá observar os breakpoints.
- A ordem das medias queries importam.
- Será considerado a ultima média query que estiver com o valor `verdadeiro` dentro da sua expressão (`parenteses`).

- Organização:
  - styled-components
    - Irá criar uma media query por componente.
  - Ir criando as medias queries modificando o minímo para funcionar.
- Screen, modificações aplicadas somente à tela:

```css
@media (max-width: 768px) {
  /* Todo css que estiver dentro dessa media query será aplicado */

  html {
    font-size: 50%;
  }
}

@media (max-width: 630px) {
  /* Todo css que estiver dentro dessa media query será aplicado */

  section.hero .container {
    flex-direction: column;

    text-align: center;

    order: -1;
  }

  section.hero .container img {
    order: -1;
  }
}
```

- Print, modificações aplicados somente à impressão da página:
- Definindo:
  `<link rel="stylesheet" href="./media-print.css" media="print" />`

  - Arquivo `media-print.css`:

    ```css
    header,
    .hero,
    .image {
      display: none;
      padding: 0;
      margin: 0;
    }

    .cards {
      display: block;
    }
    ```

## Imagens

Escolhendo a resolução da imagem de acordo com tamanho da tela de cada dispositivo:

```html
<picture>
  <source
    media="min-width: 768px"
    srcset="Better quality, url imagem / path to image"
  />
  <source
    media="min-width: 320px"
    srcset="Low quality, url imagem / path to image"
  />
  <img src="Better url imagem / path to image" />
</picture>
```

Caso o `media` não funcione, a imagem será a que estiver dentro da tag `img`.

Isso possibilita economizar os dados do usuário.

Imagens com formato `SVG` não perdem a qualidade, não importa em qual resolução ela se encontra.

## Mobile first

- Geralmente é definindo como expressão da media querie o `min-width`.

## Web first

- Geralmente é definindo como expressão da media querie o `max-width`.

# Aplicação

- Deixar responsivo o site do [repositório](https://github.com/Rocketseat/youtube-masterclass-responsividade)

- Deixar responsivo o site do [repositório](https://github.com/Rocketseat/live-layout-responsivo)

# Maiores referências

- [CSS-Tricks](https://css-tricks.com/).
- [Codrops](https://tympanus.net/codrops/).
