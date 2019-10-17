# Unstated Retro

> Retrofit your `unstated` container to feel like `unstated-next` until you can fully swap

|                    | [unstated](https://github.com/jamiebuilds/unstated)                                                | [unstated-next](https://github.com/jamiebuilds/unstated-next) | **unstated-retro**                 |
| ------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------- |
| `Container`        | Class                                                                                              | Hooks                                                         | **Class**                          |
| Inject an instance | [yes](https://github.com/jamiebuilds/unstated#passing-your-own-instances-directly-to-subscribe-to) | no                                                            | **yes**                            |
| `<Provider/>`      | - Provide any `Container`                                                                          | Provides only a `Container`                                   | Provides only a single `Container` |
| `<Consumer/>`      | Provides all containers                                                                            | Provides only a single container                              | Provides only a single container   |
| Consumer API       | Render Props                                                                                       | Hooks                                                         | **Hooks OR Render Props**          |

### Motivation

[unstated-next](https://github.com/jamiebuilds/unstated-next) is great for new containers, but if you've been using [unstated](https://github.com/jamiebuilds/unstated) for awhile, you probably already have some super sticky containers that percolate throughout your code.

This package seeks to bridge that gap so that you can.

> **If you are working on a new project please use [unstated-next](https://github.com/jamiebuilds/unstated-next).**

### Migration From Unstated

The purpose of this library it to gracefully migrate people from Unstated to Unstated Next, and then to die.

There are three challenges with migrating from Unstated to Unstated Next.

- Containers are written as classes
- Consumers use the render props API

To solve this, we need to first move all the consumers, and then move over the containers. Unfortunately, sometimes we can't refactor all of our code, so we might need some consumers render props, while new consumers use hooks, until finally every consumer uses hooks. Once every consumer uses hooks, then the container can be migrated.

## Install

```sh
npm install --save unstated-retro
```

## Example

```js
import React, { useState } from "react"
import { createContainer } from "../src/unstated-retro"
import { render } from "react-dom"
import { Container } from "unstated"

type CounterState = {
  count: number,
}

// This container may also be used via the old API
class CounterContainer extends Container<CounterState> {
  state = {
    count: 0,
  }

  increment() {
    this.setState({ count: this.state.count + 1 })
  }

  decrement() {
    this.setState({ count: this.state.count - 1 })
  }
}

let Counter = createContainer(CounterContainer)

// But new component can use the new API
function CounterDisplay() {
  let counter = Counter.useContainer()
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}

function App() {
  return (
    <Counter.Provider>
      <CounterDisplay />
      <Counter.Provider initialState={2}>
        <div>
          <div>
            <CounterDisplay />
          </div>
        </div>
      </Counter.Provider>
    </Counter.Provider>
  )
}

render(<App />, document.getElementById("root"))
```

## API

### `createContainer(useHook)`

```js
// This container may also be used via the old API
class CounterContainer extends Container<CounterState> {
  state = {
    count: 0,
  }

  increment() {
    this.setState({ count: this.state.count + 1 })
  }

  decrement() {
    this.setState({ count: this.state.count - 1 })
  }
}

let Container = createContainer(CounterContainer)
// Container === { Provider, useContainer }
```

### `<Container.Provider>`

```js
function ParentComponent() {
  return (
    <Container.Provider>
      <ChildComponent />
    </Container.Provider>
  )
}
```

### `Container.useContainer()`

```js
function ChildComponent() {
  let input = Container.useContainer()
  return <input value={input.value} onChange={input.onChange} />
}
```
