# Conceitos

Iniciando um projeto normal com `npx react-native init rnAnimated`;

- Importar do `react-native` a classe `Animated` que contem todas as propriedades para realizar as animações:

  - `<Animated.View />`
  - `<Animated.Text />`
  - `<Animated.Image />`
  - `<Animated.ScrollView />`
  - `<Animated.FlatList />`
  - `<Animated.SectionList />`

### Animações

- `new Animated.Value()` -> Para controlar os valores da animação, evitando que a view seja renderizada milhares de vezes.
- `Animated.timing(valorDaAnimação, {options})` -> Animação que decorre durante o tempo, as opções da animação.
- `Animated.spring(valorDaAnimação, {options})` -> Tem um efeito elástico quando chega ao final do ponto.
- `Animated.decay(valorDaAnimação, {options})` -> Faz uma aceleração e para quando a aceleração chegar a zero.

Base de código:

```js
import React, { Component } from "react";
import { Animated, StyleSheet, View, StatusBar } from "react-native";

export default class App extends Component {
  state = {
    ballY: new Animated.Value(0),
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.ball,
              {
                top: this.state.ballY,
              },
            ]}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  ball: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F00",
  },
});
```

## Animação de timing - Vai de um ponto até outro em um período de tempo:

```js
  componentDidMount() {
    Animated.timing(this.state.ballY, {
      toValue: 500,
      duration: 2000,

      useNativeDriver: false,
    }).start();
  }
```

## Animação de spring - Vai de um ponto até outro mas no final tem um efeito elástico:

```js
  componentDidMount() {
    Animated.spring(this.state.ballY, {
      toValue: 500,
      bounciness: 10,

      useNativeDriver: false,
    }).start();
  }
```

## Animação de decay - Vai de um ponto até outro mas no final tem um efeito elástico:

```js
    componentDidMount() {
    Animated.decay(this.state.ballY, {
      velocity: 1,

      useNativeDriver: false,
    }).start();
  }
```

## Fazendo Operações matemáticas:

- `Animated.multiply(a, b)` -> Realização a operação matemática e faz a atribuição.
- `Animated.add(a, b)` -> Realização a operação matemática e faz a atribuição.
- `Animated.subtract(a, b)` -> Realização a operação matemática e faz a atribuição.
- `Animated.divide(a, b)` -> Realização a operação matemática e faz a atribuição.

Nesse exemplo a bola se mexe no eixo X a metade do que mexe no eixo Y:

```js
import React, { Component } from "react";
import { Animated, StyleSheet, View, StatusBar } from "react-native";

const ballY = new Animated.Value(0);
const ballX = Animated.divide(ballY, 2);

export default class App extends Component {
  state = {
    ballY: ballY,
    ballX: ballX,
  };

  componentDidMount() {
    Animated.decay(this.state.ballY, {
      velocity: 0.5,

      useNativeDriver: false,
    }).start();
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.ball,
              {
                top: this.state.ballY,
                left: this.state.ballX,
              },
            ]}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  ball: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F00",
  },
});
```

## Encadeando animações:

- `Animated.sequence([])`, ele vai ser um array de animações e irá executar elas em sequência.

  ```js
  componentDidMount() {
    Animated.sequence([
      Animated.timing(this.state.ballY, {
        toValue: 200,
        duration: 500,

        useNativeDriver: false,
      }),

      Animated.timing(this.state.ballX, {
        toValue: 200,
        duration: 500,

        useNativeDriver: false,
      }),
    ]).start();
  }
  ```

- `Animated.delay(time)`, vai ter um delay de `time` em milissegundos.
  ```js
  Animated.delay(2000);
  ```
- `Animated.parallel([])`, ele vai ser um array de animações e irá executar elas em paralelo.

  ```js
  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.state.ballY, {
        toValue: 200,
        duration: 500,

        useNativeDriver: false,
      }),

      Animated.timing(this.state.ballX, {
        toValue: 200,
        duration: 500,

        useNativeDriver: false,
      }),
    ]).start();
  }
  ```

- `Animated.stagger(delay, [])`, ele vai ser um array de animações que contem um `delay` em milissegundos para realizar cada uma delas.

  ```js
  componentDidMount() {
    Animated.stagger(100, [
      Animated.timing(this.state.ballY, {
        toValue: 200,
        duration: 500,

        useNativeDriver: false,
      }),

      Animated.timing(this.state.ballX, {
        toValue: 200,
        duration: 500,

        useNativeDriver: false,
      }),
    ]).start();
  }
  ```

### Loop de animações

- `Animated.loop(animations,{options})`:
  - options:
    - iterations -> Quantas interações ele irá realizar até parar.
    - resetBeforeIteration -> Quantas interações ele irá executar até reiniciar.

## Interpolate

Criar um valor no estilo baseado em outro valor qualquer de animação:

```js
import React, { Component } from "react";
import { Animated, StyleSheet, View, StatusBar } from "react-native";

export default class App extends Component {
  state = {
    ballY: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.ballY, {
          toValue: 200,
          duration: 500,

          useNativeDriver: false,
        }),

        Animated.timing(this.state.ballY, {
          toValue: 0,
          duration: 500,

          useNativeDriver: false,
        }),
      ])
    ).start();
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.ball,
              {
                top: this.state.ballY,
                opacity: this.state.ballY.interpolate({
                  inputRange: [0, 100, 200],
                  outputRange: [1, 0.5, 0],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  ball: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F00",
  },
});
```

- `extrapolate: "clamp"` -> Significa que caso o inputRange passe do valor estabelecido o valor do outputRange não será mais alterado

## Fazendo animações no gesto do usuário:

- `PanResponder` É uma classe do `react-native` que monitora os gestos do usuário.

  ```js
  import React, { Component } from "react";
  import {
    Animated,
    PanResponder,
    StyleSheet,
    View,
    StatusBar,
  } from "react-native";

  export default class App extends Component {
    state = {
      ball: new Animated.ValueXY(0, 0),
    };

    componentWillMount() {
      this._panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (e, gestureState) => true,

        onPanResponderGrant: (e, gestureState) => {
          this.state.ball.setOffset({
            x: this.state.ball.x._value,
            y: this.state.ball.y._value,
          });

          this.state.ball.setValue({ x: 0, y: 0 });
        },

        onPanResponderMove: Animated.event([
          null,
          {
            dx: this.state.ball.x,
            dy: this.state.ball.y,
          },
        ]),

        onPanResponderRelease: () => {
          this.state.ball.flattenOffset();
        },
      });
    }

    render() {
      return (
        <>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <View style={styles.container}>
            <Animated.View
              {...this._panResponder.panHandlers}
              style={[
                styles.ball,
                {
                  transform: [
                    { translateX: this.state.ball.x },
                    { translateY: this.state.ball.y },
                  ],
                },
              ]}
            />
          </View>
        </>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 30,
    },
    ball: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#F00",
    },
  });
  ```

# [Aplicação](https://github.com/Manfrinmm/rn-animated)
