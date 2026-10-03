// Every lint or Svelte warning suppression in src/ must say why, after ` -- `.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const directive = /(oxlint-disable|eslint-disable|svelte-ignore)\b/;
const withReason = / -- \S/;

const offenders = [];
for (const entry of readdirSync('src', { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !/\.(ts|js|svelte)$/.test(entry.name)) continue;
  const file = join(entry.parentPath, entry.name);
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (directive.test(line) && !withReason.test(line)) {
        offenders.push(`${file}:${i + 1}: ${line.trim()}`);
      }
    });
}

if (offenders.length > 0) {
  console.error('Suppressions need a reason after " -- ":');
  for (const offender of offenders) console.error(`  ${offender}`);
  process.exit(1);
}
