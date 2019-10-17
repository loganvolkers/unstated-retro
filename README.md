# Unstated Retro

> Retrofit your existing `unstated` container. Feels like `unstated-next`. Bridge the gap until you can swap.

### Motivation

[unstated-next](https://github.com/jamiebuilds/unstated-next) is great for new projects, but if you've been using [unstated](https://github.com/jamiebuilds/unstated) for awhile, you probably already have some containers that aren't quick to rewrite and replace.

This package seeks to bridge that gap via a "child-first" migration. You can start rewriting child components to use hooks, and then eventually rewrite your container in the style of `unstated-next`. It aims to be API compatible with `unstated-next` for a smooth migration from (unstated + retro) to pure `unstated-next`.


### Comparison to `unstated` and `unstated-next`

|               | [unstated](https://github.com/jamiebuilds/unstated)     | [unstated-next](https://github.com/jamiebuilds/unstated-next)  | [unstated-retro](https://github.com/loganvolkers/unstated-retro)        |
|---------------|--------------|---------------|-----------------------|
| `Container` | `class CounterContainer extends Container`        | `let Container = createContainer(customHook)`         | `let RetroContainer = createRetroContainer(CounterContainer)`               |
| Provide | `<Provider>` | `createContainer(customHook)` | `createContainer()` |
| Subscribe | `<Subscribe>` | `Container.useContainer()` |  `RetroContainer.useContainer()`  |
| React Version | `^15.0` | `^16.8` | `^16.8` |

The way to inject containers in `unstated-retro` matches the style of `unstated-next`.

|               | [unstated](https://github.com/jamiebuilds/unstated)     | [unstated-next](https://github.com/jamiebuilds/unstated-next)  | [unstated-retro](https://github.com/loganvolkers/unstated-retro)        |
| What is provided |  Any `Container` class | The `customHook` passed to `createContainer` |  The `Container` passed to `createRetroContainer` |
| Inject an instance | `<Provider inject={[instance]}>` [docs](https://github.com/jamiebuilds/unstated#passing-your-own-instances-directly-to-subscribe-to) | - | `createContainer(instance)` |


## Install

```sh
npm install --save unstated-retro
```

## Example

```js
import React, { useState } from "react"
import { render } from "react-dom"
import { Container } from 'unstated';
import { createRetroContainer } from "unstated-retro"

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
	<CounterDisplay />
	<CounterDisplay />
      </RetroContainer.Tunnel>
      <CounterDisplay />
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
      	<CounterDisplay />
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
      <CounterDisplay />
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

 1. Create a `RetroContainer` with `createRetroContainer(LegacyContainer)`
 2. Add `<RetroContainer.Tunnel>` from `unstated-retro` in your **existing** parent components
 3. Start writing **new** child components using `useContainer`.
 4. Migrate **existing** child components from `<Subscribe/>` to `useContainer`.
 5. Confirm all child components use `useContainer` instead of `<Subscribe/>`
 6. Swap from `<Provider><RetroContainer.Tunnel>` to just `<RetroContainer.Provider>`
 7. Confirm all parent components use `<RetroContainer.Provider>` instead of `<Provider>`
 8. Migrate from `createRetroContainer` to `createContainer`

**I'm building something completely new**

Don't use this library, use `unstated-next`. Celebrate that you're not bogged down by supporting legacy `unstated` containers.
