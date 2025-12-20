import type { ReactNode } from 'react';
import clsx from 'clsx';
import Translate, { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.features.typeSafe.title',
      message: 'Type-Safe',
    }),
    emoji: '🎯',
    description: (
      <Translate id='homepage.features.typeSafe.description'>
        Full TypeScript support with generics for complete type safety. Catch
        errors at compile time, not runtime.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'homepage.features.zeroDependencies.title',
      message: 'Zero Dependencies',
    }),
    emoji: '📦',
    description: (
      <Translate id='homepage.features.zeroDependencies.description'>
        No external dependencies. Lightweight, secure, and minimal bundle
        impact. Only bundle what you import.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'homepage.features.performance.title',
      message: 'Performance Optimized',
    }),
    emoji: '⚡',
    description: (
      <Translate id='homepage.features.performance.description'>
        Optimized implementations with documented time complexities.
        Comprehensive test coverage ensuring reliability.
      </Translate>
    ),
  },
];

function Feature({ title, emoji, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className='text--center'>
        <span style={{ fontSize: '4rem' }} role='img' aria-label={title}>
          {emoji}
        </span>
      </div>
      <div className='text--center padding-horiz--md'>
        <Heading as='h3'>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
