import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Type-Safe',
    emoji: '🎯',
    description: (
      <>
        Full TypeScript support with generics for complete type safety.
        Catch errors at compile time, not runtime.
      </>
    ),
  },
  {
    title: 'Zero Dependencies',
    emoji: '📦',
    description: (
      <>
        No external dependencies. Lightweight, secure, and minimal bundle impact.
        Only bundle what you import.
      </>
    ),
  },
  {
    title: 'Performance Optimized',
    emoji: '⚡',
    description: (
      <>
        Optimized implementations with documented time complexities.
        Comprehensive test coverage ensuring reliability.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <span style={{fontSize: '4rem'}} role="img" aria-label={title}>
          {emoji}
        </span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
