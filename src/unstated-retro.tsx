import React, { useState, useEffect } from "react";
import { Container as LegacyContainer } from "unstated";

export interface ContainerProviderProps<State extends object> {
  children: React.ReactNode;
}

export interface Container<
  L extends LegacyContainer<State>,
  State extends object
> {
  Provider: React.ComponentType<ContainerProviderProps<State>>;
  useContainer: () => L;
}

type InstanceOrClass<L extends LegacyContainer<State>, State extends object> =
  | L
  | {
      new (): L;
    };

export function createRetroContainer<
  Cls extends InstanceOrClass<L, State>,
  L extends LegacyContainer<State>,
  State extends object
>(instanceOrClass: Cls): Container<LegacyContainer<State>, State> {
  let instance;
  if (
    typeof instanceOrClass === "object" &&
    instanceOrClass instanceof LegacyContainer
  ) {
    instance = instanceOrClass;
  } else {
    // @ts-ignore
    instance = new instanceOrClass();
  }
  let initialValue = { container: instance, state: instance.state };
  let Context = React.createContext<{ container: L; state: State }>(
    initialValue
  );

  function Provider(props: ContainerProviderProps<State>) {
    const [state, setState] = useState<State>(null);
    useEffect(() => {
      const listener = () => setState(instance.state);
      instance.subscribe(listener);
      return () => instance.unsubscribe(listener);
    }, []);
    const updateValue = { container: instance, state };
    return (
      <Context.Provider value={updateValue}>{props.children}</Context.Provider>
    );
  }

  function useContainer(): L {
    let value = React.useContext(Context);
    if (value === null) {
      throw new Error("Component must be wrapped with <Container.Provider>");
    }
    return value.container;
  }

  return { Provider, useContainer };
}
