import React, { useState, useEffect } from "react";
import { Container as LegacyContainer } from "unstated";

export interface ContainerProviderProps {
  children: React.ReactNode;
}

export interface Container<
  L extends LegacyContainer<State>,
  State extends object
> {
  Provider: React.ComponentType<ContainerProviderProps>;
  useContainer: () => L;
}

type InstanceOrClass<L extends LegacyContainer<State>, State extends object> =
  | L
  | {
      new (): L;
    };

export function createRetroContainer<
  L extends LegacyContainer<State>,
  State extends object
>(instanceOrClass: InstanceOrClass<L, State>): Container<L, State> {
  let Context = React.createContext<{ container: L; state: State }>(null);

  function Provider(props: ContainerProviderProps) {
    const [instance] = useState<L>(() => {
      let instance: L;
      if (
        typeof instanceOrClass === "object" &&
        instanceOrClass instanceof LegacyContainer
      ) {
        // @ts-ignore
        instance = instanceOrClass;
      } else {
        // @ts-ignore
        instance = new instanceOrClass();
      }
      return instance;
    });
    const [state, setState] = useState<State>(null);
    useEffect(() => {
      const listener = () => setState(instance.state);
      instance.subscribe(listener);
      return () => instance.unsubscribe(listener);
    }, [instance]);
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
