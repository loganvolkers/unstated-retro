# Unstated Retro

> Retrofit your existing `unstated` container. Feels like `unstated-next`. Bridge the gap until you can swap.

|               | [unstated](https://github.com/jamiebuilds/unstated)     | [unstated-next](https://github.com/jamiebuilds/unstated-next)  | [unstated-retro](https://github.com/loganvolkers/unstated-retro)        |
|---------------|--------------|---------------|-----------------------|
| `Container` | `class CounterContainer extends Container`        | `function useCustomHook(){`         | `class CounterContainer extends Container`               |
| `<Provider/>` |  Provide any `Container` | Provides only a `Container` |  Provides only a single `Container` |
| Inject an instance | `<Provider inject={[instance]}>` [docs](https://github.com/jamiebuilds/unstated#passing-your-own-instances-directly-to-subscribe-to) | - | `createContainer(instance)` |
|  | `<Provider>` | `createContainer(customHook)` | `createContainer()` |
| `<Consumer/>` | Provides all containers | Provides only a single container |  Provides only a single container |
| Consumer API  | Render Props | Hooks         | **Hooks OR Render Props** |
| React Version | `^15.0` | `^16.8` | `^16.8` |


### Motivation

[unstated-next](https://github.com/jamiebuilds/unstated-next) is great for new containers, but if you've been using [unstated](https://github.com/jamiebuilds/unstated) for awhile, you probably already have some super sticky containers that percolate throughout your code.

This package seeks to bridge that gap so that you can.

> **If you are working on a new project please use [unstated-next](https://github.com/jamiebuilds/unstated-next).**

### Migration From Unstated

The purpose of this library it to gracefully migrate people from Unstated to Unstated Next, and then to die.

There are three challenges with migrating from Unstated to Unstated Next.

 * Containers are written as classes
 * Consumers use the render props API

To solve this, we need to first move all the consumers, and then move over the containers. Unfortunately, sometimes we can't refactor all of our code, so we might need some consumers render props, while new consumers use hooks, until finally every consumer uses hooks. Once every consumer uses hooks, then the container can be migrated.


## Install

```sh
npm install --save unstated-retro
```

## Example

```js
import React, { useState } from "react"
import { createRetroContainer } from "unstated-retro"
import { render } from "react-dom"
import { Container } from 'unstated';

type CounterState = {
  count: number
};

class CounterContainer extends Container<CounterState> {
  state = {
    count: 0
  };

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  decrement() {
    this.setState({ count: this.state.count - 1 });
  }
}

let RetroContainer = createRetroContainer(CounterContainer)

function CounterDisplay() {
	let counter = RetroContainer.useContainer()
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
		<RetroContainer.Provider>
			<CounterDisplay />
			<CounterDisplay />
		</RetroContainer.Provider>
	)
}

render(<App />, document.getElementById("root"))
```

## API

### `createRetroContainer(ContainerOrInstance)`

```js
class CounterContainer extends Container<CounterState> {
  state = {
    count: 0
  };

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  decrement() {
    this.setState({ count: this.state.count - 1 });
  }
}

let RetroContainer = createRetroContainer(CounterContainer)
// RetroContainer === { Provider, Tunnel, useContainer }
```

### `Container.useContainer()`

```js
function ChildComponent() {
  let input = RetroContainer.useContainer()
  return <input value={input.value} onChange={input.onChange} />
}
```

`useContainer` is designed to match the style of `unstated-next`

### `<Container.Tunnel>`

```js
let RetroContainer = createRetroContainer(CounterContainer)
// RetroContainer === { Provider, Tunnel, useContainer }

function ParentComponent() {
  return (
    <Provider>
      <RetroContainer.Tunnel>
        <ChildComponent />
      </RetroContainer.Tunnel>
    </Provider>
  )
}
```

Bridges the context from a wrapper `Provider` via a `Tunnel` to a child using `useContainer`

### `<Container.Provider>`

```js
function ParentComponent() {
  return (
    <RetroContainer.Provider>
      <ChildComponent />
    </RetroContainer.Provider>
  )
}
```

Replaces `<Provider/>` from `unstated`.


### `<Container.Provider>` injected instance

```js
const counter = new CounterContainer(); // Global instance
let RetroContainer = createRetroContainer(counter)
// RetroContainer === { Provider, Tunnel, useContainer }

function ParentComponent() {
  return (
    <RetroContainer.Provider>
      <ChildComponent />
    </RetroContainer.Provider>
  )
}
```
> See also [passing your own instances in `unstated`](https://github.com/jamiebuilds/unstated#passing-your-own-instances-directly-to-subscribe-to)



### How do I use an existing `unstated` container?

**I need new shared state using an existing container**

Use `<RetroContainer.Provider>` from `unstated-retro` in your **new** parent components, and `useContainer` in your **new** child components.

**I am building a new child component**

Use `<RetroContainer.Tunnel>` from `unstated-retro` in your **existing** parent components, and `useContainer` in your **new** child components.

**I want to slowly migrate**

 0. Create a `RetroContainer` with `createRetroContainer`
 1. Add `<RetroContainer.Tunnel>` from `unstated-retro` in your **existing** parent components
 2. Start writing **new** child components using `useContainer`.
 3. Migrate **existing** child components from `<Subscribe/>` to `useContainer`.
 4. Confirm all child components use `useContainer` instead of `<Subscribe/>`
 5. Swap from `<Provider><RetroContainer.Tunnel>` to just `<RetroContainer.Provider>`
 6. Confirm all parent components use `<RetroContainer.Provider>` instead of `<Provider>`
 7. Migrate from `unstated
 
**I'm building something completely new**

Don't use this library, use `unstated-next`. Celebrate that you're not bogged down by supporting legacy `unstated` containers.
