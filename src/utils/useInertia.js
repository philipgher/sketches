import { useCallback } from 'react';
import { useSpring } from 'react-spring';

// https://codesandbox.io/s/inertia-fake-scroll-wjz5s

const useInertia = (initialProps) => {
  const [props, set] = useSpring(() => initialProps);

  const setInertia = useCallback(
    ({ config = {}, ...to }) => {
      const {
        inertia, bounds, velocities, ...rest
      } = config;

      if (inertia) {
        set({
          ...to,
          config: k => ({
            decay: true,
            velocity: velocities[k],
          }),
          onChange: (values) => {
            Object.entries(values).forEach(([key, v]) => {
              const vel = props[key].velocity;

              const bound =
				// eslint-disable-next-line no-nested-ternary
				v >= bounds[key][1]
				  ? bounds[key][1]
				  : v <= bounds[key][0]
				    ? bounds[key][0]
				    : undefined;

              if (bound !== undefined) {
                props[key].stop();

                set({
                  config: {
                    decay: false,
                    velocity: vel,
                  },
                  [key]: bound,
                });
              }
            });
          },
        });
      } else {
        set({
          ...to,
          config: rest,
        });
      }
    },
    [props, set],
  );

  return [props, setInertia];
};

export default useInertia;
