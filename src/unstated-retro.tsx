import React, { useState, useEffect } from "react"
import {
	Container as LegacyContainer,
	Subscribe as LegacySubscribe,
} from "unstated"

export interface RetroContainerProviderProps<State = void> {
	initialState?: State
	children: React.ReactNode
}

export interface RetroContainerTunnelProps {
	children: React.ReactNode
}

export interface RetroContainer<
	L extends LegacyContainer<State>,
	State extends object
> {
	Tunnel: React.ComponentType<RetroContainerProviderProps>
	Provider: React.ComponentType<RetroContainerProviderProps>
	useContainer: () => L
}

type InstanceOrClass<L extends LegacyContainer<State>, State extends object> =
	| L
	| {
			new (): L
	  }

export function createRetroContainer<
	L extends LegacyContainer<State>,
	State extends object
>(instanceOrClass: InstanceOrClass<L, State>): RetroContainer<L, State> {
	let Context = React.createContext<{ container: L; state: State } | null>(null)

	function Provider(props: RetroContainerProviderProps) {
		const [instance] = useState<L>(() => {
			let instance: L
			if (
				typeof instanceOrClass === "object" &&
				instanceOrClass instanceof LegacyContainer
			) {
				// @ts-ignore
				instance = instanceOrClass
			} else {
				// @ts-ignore
				if (props.initialState) {
					instance = new instanceOrClass(props.initialState)
				} else {
					instance = new instanceOrClass()
				}
			}
			return instance
		})
		const [state, setState] = useState<State>(instance.state)
		useEffect(() => {
			const listener = () => setState(instance.state)
			instance.subscribe(listener)
			return () => instance.unsubscribe(listener)
		}, [instance])
		const updateValue = { container: instance, state }
		return (
			<Context.Provider value={updateValue}>{props.children}</Context.Provider>
		)
	}

	function Tunnel(props: RetroContainerTunnelProps) {
		return (
			<LegacySubscribe to={[instanceOrClass]}>
				{(instance: L) => {
					const updateValue = { container: instance, state: instance.state }
					return (
						<Context.Provider value={updateValue}>
							{props.children}
						</Context.Provider>
					)
				}}
			</LegacySubscribe>
		)
	}

	function useContainer(): L {
		let value = React.useContext(Context)
		if (value === null) {
			throw new Error("Component must be wrapped with <Container.Provider>")
		}
		return value.container
	}

	return { Provider, Tunnel, useContainer }
}
