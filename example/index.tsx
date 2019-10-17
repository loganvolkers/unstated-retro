import React, { useState } from "react"
import { createContainer } from "../src/unstated-retro"
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

let Counter = createContainer(CounterContainer)

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
