### Criando uma função dentro de um componente, recomenda-se:

- `useCallback` -> É uma forma de criar funções dentro do componente para que a cada renderização a função não seja criada do zero na memória.
  ```ts
  const handleInputBlur = useCallback(() => {}, ["Array de dependências"]);
  ```
  - Agora a função `handleInputBlur` será apenas criada novamente casa algum dado dentro do `Array de dependências` seja alterado. Caso o array seja vázio, a função será criada uma única vez.

### Criar uma interface dinâmica:

```ts
interface Errors {
  [key: string]: string;
}
```

- `key` -> Fala que toda chave será uma `string` e ela terá um valor do tipo `string`.

Essa forma de fazer facilita quando é necessário construir uma interface, mas não sabe a quantidade de atributos ela pode conter.

### Context API

Permite acessar essa informação em vários locais da aplicação.

Criar um arquivo `src/context/AuthContext.ts`:

```ts
import { createContext } from "react";

interface AuthContext {
  name: string;
}

const authContext = createContext<AuthContext>({} as AuthContext);

export default authContext;
```

Com a nossa context criada vamos importa-lá no arquivo `App.tsx`:

E o `AuthContext` terá um `propriedade` chamado `provider`, nele vamos colocar em volta de todos os componentes em que queremos ter acesso à context. Nesse caso a aplicação toda. Também iremos falar qual é o valor do nosso contexto

```tsx
const App: React.FC = () => (
  <>
    <GlobalStyle />
    <AuthContext.Provider value={{name:"matheus"}}>
      <Routes>
    <AuthContext.Provider/>
  </>
);
```

Para acessar o context em um componente:

```tsx
import AuthContext from "../../context/AuthContext";

const SignIn: React.FC = () => {
  const auth = useContext(AuthContext);
};
```

#### Adicionando métodos de autenticação pelo contexto:

```tsx
import React, { createContext } from "react";

interface AuthContextData {
  name: string;
  signIn(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const signIn = useCallback(() => {}, []);

  return (
    <AuthContext.Provider value={{ name: "Matheus", signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
```

Vamos modificar o `App.tsx`:

```tsx
import {AuthProvider} from "./context/AuthContext";

const App: React.FC = () => (
  <>
    <GlobalStyle />
    <AuthProvider>
      <Routes>
    <AuthProvider/>
  </>
);
```

Para acessar o contexto dentro de outros componentes continuam da mesma forma.

#### Criando um hook de autenticação:

Dentro do arquivo `src/context/AuthContext.tsx`:

```tsx
import { useContext } from "react";

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
```

Usando esse hook criado dentro de um componente que esteja dentro do escopo do `AuthProvider`:

```tsx
import { useAuth } from "../../context/AuthContext";

const { user, signIn } = useAuth();
```

Dessa forma não é mais necessário exportar o AuthContext do arquivo `src/context/AuthContext.tsx`, ficando apenas:

```ts
export { AuthProvider, useAuth };
```
