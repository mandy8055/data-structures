import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

type Props = {
  packageName?: string;
  importName?: string;
};

export default function InstallTabs({
  packageName = '@msnkr/data-structures',
  importName = 'MyImport',
}: Props) {
  return (
    <Tabs>
      <TabItem value='npm' label='npm' default>
        <pre>
          <code className='language-bash'>{`npm install ${packageName}`}</code>
        </pre>
      </TabItem>
      <TabItem value='pnpm' label='pnpm'>
        <pre>
          <code className='language-bash'>{`pnpm install ${packageName}`}</code>
        </pre>
      </TabItem>
      <TabItem value='yarn' label='yarn'>
        <pre>
          <code className='language-bash'>{`yarn add ${packageName}`}</code>
        </pre>
      </TabItem>
      <TabItem value='deno' label='Deno (JSR)'>
        <pre>
          <code className='language-ts'>{`import { ${importName} } from 'jsr:@mskr/data-structures';`}</code>
        </pre>
      </TabItem>
      <TabItem value='browser' label='Browser (CDN)'>
        <pre>
          <code className='language-html'>{`<script type="module">\n  import { ${importName} } from 'https://esm.sh/jsr/@mskr/data-structures';\n</script>`}</code>
        </pre>
      </TabItem>
    </Tabs>
  );
}
