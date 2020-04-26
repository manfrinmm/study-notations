## Iniciando um projeto React Native com template de Typescript

- run `npx react-native init appname --template react-native-template-typescript`.

## Eslint

- Será as mesmas configurações do `Eslint` do GoBarber-web.
- Apenas na pergunta do `Where does your code run?`: Não deixar nenhum selecionado.
- Lembrar de conferir o arquivo `.eslintrc.json` e tirar a opção de `browser`

- Instalando dev dependencies:
  - `eslint-import-resolver-typescript`
  - `prettier`
  - `eslint-config-prettier`
  - `eslint-plugin-prettier`

## Navegação

- Utilizando `react-navigation`

- Utilize a documentação para fazer a instalação.

Criando as rotas:

Instalando o pacote de `@react-navigation/stack`

Para cada navegação, usa-se um `navigator` (variável) diferente.

```tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Auth.Navigator>
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SIgnUp" component={SignUp} />
  </Auth.Navigator>
);

export default AuthRoutes;
```

Ativando rotas:

```tsx

import {NavigationContainer} from "@react-navigation/native";

import Routes from "./routes";

const App:React.FC = ()=>(
  <NavigationContainer>
    <Routes>
  </NavigationContainer>
)
```

### Navegando de uma rota para outra:

```ts
import {useNavigation} from "@react-navigation/native";

const navigation.navigate("RouteName");
```

## Importando imagens

- Criar um arquivo `@types/index.d.ts`:
  ```ts
  declare module "*.png";
  ```

Agora basta importar a imagem com extensão png.

## Importando fonts externas para a aplicação:

Baixar a fonte.

Importe as fontes para a pasta `assets/fonts`.

**Atenção - Android** o nome do arquivo é o que será utilizado na hora de declarar o `font-family`

Crie o arquivo `react-native.config.js`:

```js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ["./assets/fonts/"],
};
```

Depois rode `yarn react-native link` e `yarn react-native run-android`.

Para usar a fonte basta:

```css
 {
  font-family: "RobotoSlab-Medium";
}
```

Nesse caso estamos utilizando a `RobotoSlab-Medium`

## Testando aplicação em outros devices:

Isso é útil para saber como nosso layout e aplicação se comporta em diferentes dispositivos.

Alguns apps:

- `Device form`
- `Microsoft app center`
