/**
 * Kujera Design Token to CSS Variables Converter
 * ------------------------------------------------
 * Converts `kujera-design-tokens-v2.json` into CSS custom properties (:root).
 *
 * Architecture & System Rules:
 * 1. Tier 1 (Primitives): Internal palette tones & key seeds (prefixed with `--primitive-`).
 *    DO NOT use directly in UI components.
 * 2. Tier 2 (Semantic Roles): Purpose-driven tokens (`--primary`, `--surface`, `--on-primary`, etc.)
 *    that reference Tier 1 primitives via `var()`.
 *    ALWAYS consume these directly in UI components.
 * 3. Single Source of Truth: Edits to `kujera-design-tokens-v2.json` automatically
 *    propagate through this script to keep the design system in sync.
 *
 * Default Output:
 *   Writes to `./token.css` in the project root (as required by AGENTS.md and .agents/design-system/README.md).
 *
 * Usage:
 *   node convert-design-tokens.js
 *   node convert-design-tokens.js --input ./kujera-design-tokens-v2.json --output ./token.css
 *   node convert-design-tokens.js --stdout
 */

const fs = require('fs');
const path = require('path');

/**
 * Formats a hex color string into standard CSS format.
 * - Trims trailing 'ff' for 100% opaque 8-digit hex values (#rrggbbaa -> #RRGGBB).
 * - Converts semi-transparent 8-digit hex to rgba(r, g, b, a).
 */
function formatColor(hex) {
  if (typeof hex !== 'string' || !hex.startsWith('#')) return hex;
  const cleanHex = hex.trim();
  if (cleanHex.length === 9) {
    const alphaHex = cleanHex.slice(7, 9).toLowerCase();
    if (alphaHex === 'ff') {
      return cleanHex.slice(0, 7).toUpperCase();
    }
    const r = parseInt(cleanHex.slice(1, 3), 16);
    const g = parseInt(cleanHex.slice(3, 5), 16);
    const b = parseInt(cleanHex.slice(5, 7), 16);
    const a = parseFloat((parseInt(alphaHex, 16) / 255).toFixed(2));
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return cleanHex.toUpperCase();
}

/**
 * Formats dimension / number values with units.
 */
function formatDimension(val) {
  if (typeof val === 'number') {
    return val === 0 ? '0' : `${val}px`;
  }
  return val;
}

/**
 * Formats custom shadow objects into CSS box-shadow syntax.
 */
function formatShadow(shadowObj) {
  if (!shadowObj || typeof shadowObj !== 'object') return shadowObj;
  const offsetX = formatDimension(shadowObj.offsetX || 0);
  const offsetY = formatDimension(shadowObj.offsetY || 0);
  const radius = formatDimension(shadowObj.radius || 0);
  const spread = formatDimension(shadowObj.spread || 0);
  const color = formatColor(shadowObj.color || '#000000');
  return `${offsetX} ${offsetY} ${radius} ${spread} ${color}`;
}

/**
 * Maps token reference paths (e.g. "{primitive collection.color palette.primary.primary-40}")
 * to the corresponding CSS variable name (e.g. "var(--primitive-primary-40)").
 */
function resolveTokenRef(refString) {
  if (typeof refString !== 'string' || !refString.startsWith('{') || !refString.endsWith('}')) {
    return refString;
  }
  const cleanPath = refString.slice(1, -1);
  const parts = cleanPath.split('.');

  if (parts[0] === 'primitive collection') {
    if (parts[1] === 'key colors') {
      return `var(--primitive-${parts[2]})`;
    }
    if (parts[1] === 'color palette') {
      return `var(--primitive-${parts[3]})`;
    }
    if (parts[1] === 'chart') {
      return `var(--${parts[2]})`;
    }
  } else if (parts[0] === 'color roles') {
    return `var(--${parts[1]})`;
  } else if (parts[0] === 'spacing') {
    return `var(--${parts[1]})`;
  } else if (parts[0] === 'font settings') {
    return `var(--${parts[1]})`;
  }

  return `var(--${parts.join('-')})`;
}

/**
 * Resolves token value either directly or via reference.
 */
function resolveValue(token) {
  if (token === null || token === undefined) return '';
  const val = typeof token === 'object' && 'value' in token ? token.value : token;

  if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
    return resolveTokenRef(val);
  }

  if (typeof token === 'object' && token.type === 'color') {
    return formatColor(val);
  }

  if (typeof token === 'object' && token.type === 'dimension') {
    return formatDimension(val);
  }

  if (typeof token === 'object' && token.type === 'custom-shadow') {
    return formatShadow(val);
  }

  return val;
}

/**
 * Validates all references in the tokens object against known paths.
 */
function validateReferences(tokens) {
  const allRefs = [];
  function collectRefs(obj, path = '') {
    for (const key in obj) {
      const val = obj[key];
      const curPath = path ? `${path}.${key}` : key;
      if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
        allRefs.push({ path: curPath, ref: val });
      } else if (val && typeof val === 'object') {
        collectRefs(val, curPath);
      }
    }
  }
  collectRefs(tokens);

  const errors = [];
  for (const item of allRefs) {
    const rawRef = item.ref.slice(1, -1);
    const parts = rawRef.split('.');
    let cur = tokens;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p];
      } else {
        cur = null;
        break;
      }
    }
    if (!cur) {
      errors.push(`Unresolved reference "${item.ref}" at ${item.path}`);
    }
  }
  return { valid: errors.length === 0, errors, totalRefs: allRefs.length };
}

/**
 * Main conversion function. Generates complete CSS stylesheet.
 */
function convertTokensToCSS(tokens, options = {}) {
  const lines = [];

  function addLine(line = '') {
    lines.push(line);
  }

  function addHeader(title, description = '') {
    addLine();
    addLine('  /* ==========================================================================');
    addLine(`     ${title}`);
    if (description) {
      description.split('\n').forEach((d) => addLine(`     ${d}`));
    }
    addLine('     ========================================================================== */');
  }

  // File header
  addLine('/**');
  addLine(' * Kujera Design System - CSS Custom Properties');
  addLine(' * Source of truth: kujera-design-tokens-v2.json');
  addLine(' *');
  addLine(' * IMPORTANT ARCHITECTURE RULES:');
  addLine(' * 1. PRIMITIVES (Tier 1, prefixed with --primitive-):');
  addLine(' *    Raw color palette tones and key seeds. DO NOT USE DIRECTLY IN UI COMPONENTS.');
  addLine(' * 2. SEMANTIC COLOR ROLES (Tier 2, --primary, --surface, etc.):');
  addLine(' *    Purpose-driven semantic roles referencing primitives via var().');
  addLine(' *    ALWAYS USE THESE DIRECTLY IN UI COMPONENTS.');
  addLine(' * 3. STATUS COLORS:');
  addLine(' *    Use --success, --pending, --error, --neutral-status only for their defined meanings.');
  addLine(' * 4. LIGHT MODE ONLY:');
  addLine(' *    Version one is locked to light mode.');
  addLine(' */');
  addLine();
  addLine(':root {');

  // ==========================================================================
  // 1. PRIMITIVE COLLECTION (TIER 1 - PALETTES & KEY SEEDS)
  // ==========================================================================
  if (tokens['primitive collection']) {
    addHeader(
      '1. PRIMITIVE COLLECTION (TIER 1 - PALETTES & KEY SEEDS)',
      'DO NOT CONSUME DIRECTLY IN UI COMPONENTS.\nUse Semantic Color Roles (Tier 2) below instead.'
    );

    // 1.1 Key Colors
    if (tokens['primitive collection']['key colors']) {
      addLine();
      addLine('  /* --- Primitive Key Colors (Seed Values) --- */');
      for (const [key, token] of Object.entries(tokens['primitive collection']['key colors'])) {
        if (token.description) {
          addLine(`  /* ${token.description} */`);
        }
        addLine(`  --primitive-${key}: ${formatColor(token.value)};`);
      }
    }

    // 1.2 Color Palette Tones
    if (tokens['primitive collection']['color palette']) {
      addLine();
      addLine('  /* --- Primitive Color Palette Tones --- */');
      for (const [groupName, tones] of Object.entries(tokens['primitive collection']['color palette'])) {
        addLine();
        addLine(`  /* Palette: ${groupName} */`);
        for (const [toneKey, token] of Object.entries(tones)) {
          addLine(`  --primitive-${toneKey}: ${formatColor(token.value)};`);
        }
      }
    }

    // 1.3 Chart Colors
    if (tokens['primitive collection']['chart']) {
      addLine();
      addLine('  /* --- Primitive Chart Palette --- */');
      for (const [chartKey, token] of Object.entries(tokens['primitive collection']['chart'])) {
        if (token.description) {
          addLine(`  /* ${token.description} */`);
        }
        addLine(`  --${chartKey}: ${formatColor(token.value)};`);
        addLine(`  --primitive-${chartKey}: ${formatColor(token.value)};`);
      }
    }
  }

  // ==========================================================================
  // 2. COLOR ROLES (TIER 2 - SEMANTIC UI TOKENS)
  // ==========================================================================
  if (tokens['color roles']) {
    addHeader(
      '2. COLOR ROLES (TIER 2 - SEMANTIC UI TOKENS)',
      'USE THESE DIRECTLY IN UI COMPONENTS.\nThese reference primitive variables via var().'
    );

    const roles = tokens['color roles'];

    function printRole(roleKey) {
      if (!roles[roleKey]) return;
      const token = roles[roleKey];
      if (token.description) {
        addLine(`  /* ${token.description} */`);
      }
      addLine(`  --${roleKey}: ${resolveValue(token)};`);
    }

    const groups = [
      {
        title: 'Brand Roles: Primary',
        keys: [
          'primary',
          'on-primary',
          'primary-container',
          'on-primary-container',
          'primary-fixed',
          'primary-fixed-dim',
          'on-primary-fixed',
          'on-primary-fixed-variant'
        ]
      },
      {
        title: 'Brand Roles: Secondary',
        keys: [
          'secondary',
          'on-secondary',
          'secondary-container',
          'on-secondary-container',
          'secondary-fixed',
          'secondary-fixed-dim',
          'on-secondary-fixed',
          'on-secondary-fixed-variant'
        ]
      },
      {
        title: 'Brand Roles: Tertiary',
        keys: [
          'tertiary',
          'on-tertiary',
          'tertiary-container',
          'on-tertiary-container',
          'tertiary-fixed',
          'tertiary-fixed-dim',
          'on-tertiary-fixed',
          'on-tertiary-fixed-variant'
        ]
      },
      {
        title: 'Status Roles: Success (Active, Paid, Allowed, Invite Accepted)',
        keys: ['success', 'on-success', 'success-container', 'on-success-container']
      },
      {
        title: 'Status Roles: Pending (Provisional, Pending Confirmation, Expiring)',
        keys: ['pending', 'on-pending', 'pending-container', 'on-pending-container']
      },
      {
        title: 'Status Roles: Error (Expired, Denied, Payment Failed, Transfer > 24h)',
        keys: ['error', 'on-error', 'error-container', 'on-error-container']
      },
      {
        title: 'Status Roles: Neutral Status (Scheduled, Cancelled, No Plan, Unpaid)',
        keys: [
          'neutral-status',
          'on-neutral-status',
          'neutral-status-container',
          'on-neutral-status-container'
        ]
      },
      {
        title: 'Surfaces, Backgrounds & Outlines',
        keys: [
          'surface',
          'on-surface',
          'surface-variant',
          'on-surface-variant',
          'surface-container-lowest',
          'surface-container-low',
          'surface-container',
          'surface-container-high',
          'surface-container-highest',
          'surface-dim',
          'surface-bright',
          'inverse-surface',
          'inverse-on-surface',
          'inverse-primary',
          'surface-tint',
          'outline',
          'outline-variant',
          'scrim',
          'shadow'
        ]
      }
    ];

    const printedKeys = new Set();
    for (const grp of groups) {
      addLine();
      addLine(`  /* --- ${grp.title} --- */`);
      for (const k of grp.keys) {
        printRole(k);
        printedKeys.add(k);
      }
    }

    const remaining = Object.keys(roles).filter((k) => !printedKeys.has(k));
    if (remaining.length > 0) {
      addLine();
      addLine('  /* --- Additional Color Roles --- */');
      for (const k of remaining) {
        printRole(k);
      }
    }
  }

  // ==========================================================================
  // 3. FONT SETTINGS & TYPOGRAPHY
  // ==========================================================================
  addHeader('3. FONT SETTINGS & TYPOGRAPHY', 'Plus Jakarta Sans, locked scale (15 styles)');

  if (tokens['font settings']) {
    addLine('  /* --- Font Settings --- */');
    for (const [key, token] of Object.entries(tokens['font settings'])) {
      if (token.description) {
        addLine(`  /* ${token.description} */`);
      }
      addLine(`  --${key}: ${token.value};`);
    }
    addLine('  --font-variant-numeric: var(--numeric-figures);');
  }

  if (tokens['typography']) {
    addLine();
    addLine('  /* --- Typography Scale (Base / Expanded) --- */');
    for (const [styleName, styleObj] of Object.entries(tokens['typography'])) {
      const fontSize = styleObj.fontSize?.value;
      const lineHeight = styleObj.lineHeight?.value;
      const fontWeight = styleObj.fontWeight?.value;
      const letterSpacing = styleObj.letterSpacing?.value;

      if (styleObj.fontSize?.description) {
        addLine(`  /* ${styleName}: ${styleObj.fontSize.description} */`);
      }
      addLine(`  --font-size-${styleName}: ${formatDimension(fontSize)};`);
      addLine(`  --line-height-${styleName}: ${formatDimension(lineHeight)};`);
      addLine(`  --font-weight-${styleName}: ${fontWeight};`);
      addLine(`  --letter-spacing-${styleName}: ${formatDimension(letterSpacing)};`);
      addLine(
        `  --font-${styleName}: var(--font-weight-${styleName}) var(--font-size-${styleName}) / var(--line-height-${styleName}) var(--font-family);`
      );
      addLine();
    }

    // Explicit compact styles definitions
    if (tokens['typography compact']) {
      addLine('  /* --- Explicit Compact Typography Tokens (For direct compact styling) --- */');
      for (const [styleName, styleObj] of Object.entries(tokens['typography compact'])) {
        const fontSize = styleObj.fontSize?.value;
        const lineHeight = styleObj.lineHeight?.value;
        addLine(`  --font-size-${styleName}-compact: ${formatDimension(fontSize)};`);
        addLine(`  --line-height-${styleName}-compact: ${formatDimension(lineHeight)};`);
        addLine(
          `  --font-${styleName}-compact: var(--font-weight-${styleName}) var(--font-size-${styleName}-compact) / var(--line-height-${styleName}-compact) var(--font-family);`
        );
      }
      addLine();
    }
  }

  // ==========================================================================
  // 4. SPACING
  // ==========================================================================
  if (tokens['spacing']) {
    addHeader('4. SPACING SCALE', 'Fixed spacing grid steps');
    for (const [key, token] of Object.entries(tokens['spacing'])) {
      addLine(`  --${key}: ${formatDimension(token.value)};`);
    }
  }

  // ==========================================================================
  // 5. SPACING ROLES (LAYOUT INTENT)
  // ==========================================================================
  if (tokens['spacing roles']) {
    addHeader(
      '5. SPACING ROLES (LAYOUT INTENT)',
      'Provides explicit compact and expanded tokens, plus dynamic responsive variables.'
    );

    const compactRoles = tokens['spacing roles']['compact'] || {};
    const expandedRoles = tokens['spacing roles']['expanded'] || {};

    // 5.1 Explicit Compact Layout Tokens
    addLine('  /* --- Explicit Compact Layout Tokens (< 840px) --- */');
    for (const [key, token] of Object.entries(compactRoles)) {
      addLine(`  --${key}-compact: ${resolveValue(token)};`);
    }
    addLine();

    // 5.2 Explicit Expanded Layout Tokens
    addLine('  /* --- Explicit Expanded Layout Tokens (>= 840px) --- */');
    for (const [key, token] of Object.entries(expandedRoles)) {
      addLine(`  --${key}-expanded: ${resolveValue(token)};`);
    }
    addLine();

    // 5.3 Dynamic Responsive Tokens (default compact on mobile)
    addLine('  /* --- Dynamic Responsive Tokens (Default: Compact / Mobile-first) --- */');
    for (const [key, token] of Object.entries(compactRoles)) {
      if (token.description) {
        addLine(`  /* ${token.description} */`);
      }
      addLine(`  --${key}: var(--${key}-compact);`);
    }
  }

  // ==========================================================================
  // 6. SIZES
  // ==========================================================================
  if (tokens['sizes']) {
    addHeader('6. SIZES & TARGETS', 'Minimum touch targets, heights and structural widths');
    for (const [key, token] of Object.entries(tokens['sizes'])) {
      if (token.description) {
        addLine(`  /* ${token.description} */`);
      }
      addLine(`  --${key}: ${formatDimension(token.value)};`);
    }
  }

  // ==========================================================================
  // 7. RADIUS
  // ==========================================================================
  if (tokens['radius']) {
    addHeader('7. BORDER RADIUS');
    for (const [key, token] of Object.entries(tokens['radius'])) {
      addLine(`  --${key}: ${formatDimension(token.value)};`);
    }
  }

  // ==========================================================================
  // 8. BREAKPOINTS
  // ==========================================================================
  if (tokens['breakpoints']) {
    addHeader('8. BREAKPOINTS');
    for (const [key, token] of Object.entries(tokens['breakpoints'])) {
      addLine(`  --breakpoint-${key}: ${formatDimension(token.value)};`);
    }
  }

  // ==========================================================================
  // 9. BORDERS & FOCUS
  // ==========================================================================
  addHeader('9. BORDERS & FOCUS RINGS');
  if (tokens['border']) {
    for (const [key, token] of Object.entries(tokens['border'])) {
      if (token.description) {
        addLine(`  /* ${token.description} */`);
      }
      addLine(`  --${key}: ${formatDimension(token.value)};`);
    }
  }
  if (tokens['focus']) {
    for (const [key, token] of Object.entries(tokens['focus'])) {
      if (token.description) {
        addLine(`  /* ${token.description} */`);
      }
      addLine(`  --${key}: ${resolveValue(token)};`);
    }
  }

  // ==========================================================================
  // 10. OPACITY
  // ==========================================================================
  if (tokens['opacity']) {
    addHeader('10. OPACITY & STATES', 'Interaction state layers and content disabling');
    for (const [key, token] of Object.entries(tokens['opacity'])) {
      if (token.description) {
        addLine(`  /* ${token.description} */`);
      }
      const prefixed = key.startsWith('opacity-') ? key : `opacity-${key}`;
      addLine(`  --${prefixed}: ${token.value};`);
      if (!key.startsWith('opacity-')) {
        addLine(`  --${key}: var(--${prefixed});`);
      }
    }
  }

  // ==========================================================================
  // 11. MOTION
  // ==========================================================================
  if (tokens['motion']) {
    addHeader('11. MOTION', 'Durations & easing curve. Respect prefers-reduced-motion.');
    for (const [key, token] of Object.entries(tokens['motion'])) {
      if (token.description) {
        addLine(`  /* ${token.description} */`);
      }
      addLine(`  --${key}: ${token.value};`);
    }
  }

  // ==========================================================================
  // 12. ICONOGRAPHY
  // ==========================================================================
  if (tokens['iconography']) {
    addHeader('12. ICONOGRAPHY');
    for (const [key, token] of Object.entries(tokens['iconography'])) {
      const formatted = typeof token.value === 'string' ? `"${token.value}"` : token.value;
      addLine(`  --${key}: ${formatted};`);
    }
  }

  // ==========================================================================
  // 13. ELEVATION & SHADOWS
  // ==========================================================================
  if (tokens['effect']) {
    addHeader('13. ELEVATION & SHADOWS', 'Flat cards with borders by default; shadows only for floating elements.');
    for (const [key, token] of Object.entries(tokens['effect'])) {
      if (token.description) {
        addLine(`  /* ${token.description} */`);
      }
      addLine(`  --${key}: ${formatShadow(token.value)};`);
    }
  }

  addLine('}');
  addLine();

  // ==========================================================================
  // RESPONSIVE OVERRIDES: COMPACT TYPOGRAPHY (< 600px)
  // ==========================================================================
  if (tokens['typography compact']) {
    addLine('/* ==========================================================================');
    addLine('   RESPONSIVE TYPOGRAPHY (< 600px / Compact Viewports)');
    addLine('   Under 600px wide, display and headline styles step down to compact sizes.');
    addLine('   ========================================================================== */');
    addLine('@media (max-width: 599.98px) {');
    addLine('  :root {');
    for (const [styleName, styleObj] of Object.entries(tokens['typography compact'])) {
      addLine(`    --font-size-${styleName}: var(--font-size-${styleName}-compact);`);
      addLine(`    --line-height-${styleName}: var(--line-height-${styleName}-compact);`);
      addLine(`    --font-${styleName}: var(--font-${styleName}-compact);`);
    }
    addLine('  }');
    addLine('}');
    addLine();
  }

  // ==========================================================================
  // RESPONSIVE OVERRIDES: EXPANDED SPACING ROLES (>= 840px)
  // ==========================================================================
  if (tokens['spacing roles'] && tokens['spacing roles']['expanded']) {
    addLine('/* ==========================================================================');
    addLine('   RESPONSIVE SPACING ROLES (>= 840px / Expanded Viewports)');
    addLine('   840px wide and up: page-margin, gaps and paddings scale up to expanded values.');
    addLine('   ========================================================================== */');
    addLine('@media (min-width: 840px) {');
    addLine('  :root {');
    const compactRoles = tokens['spacing roles']['compact'] || {};
    const expandedRoles = tokens['spacing roles']['expanded'] || {};

    for (const [key, token] of Object.entries(expandedRoles)) {
      const compactVal = compactRoles[key] ? resolveValue(compactRoles[key]) : null;
      const expandedVal = resolveValue(token);
      if (compactVal !== expandedVal) {
        addLine(`    --${key}: var(--${key}-expanded);`);
      }
    }
    addLine('  }');
    addLine('}');
    addLine();
  }

  return lines.join('\n');
}

function runCLI() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Kujera Design Tokens Converter
------------------------------
Converts kujera-design-tokens-v2.json into CSS Custom Properties (:root).

Options:
  --input, -i <path>   Input tokens JSON file (default: ./kujera-design-tokens-v2.json)
  --output, -o <path>  Output CSS file (default: ./token.css)
  --stdout             Print generated CSS to standard output
  --check              Validate references without writing output
  --help, -h           Show this help message
`);
    process.exit(0);
  }

  let inputPath = path.resolve(process.cwd(), 'kujera-design-tokens-v2.json');
  let outputPath = path.resolve(process.cwd(), 'token.css');
  let isStdout = args.includes('--stdout');
  let isCheck = args.includes('--check');

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--input' || args[i] === '-i') && args[i + 1]) {
      inputPath = path.resolve(process.cwd(), args[i + 1]);
      i++;
    } else if ((args[i] === '--output' || args[i] === '-o') && args[i + 1]) {
      outputPath = path.resolve(process.cwd(), args[i + 1]);
      i++;
    }
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found at: ${inputPath}`);
    process.exit(1);
  }

  let tokens;
  try {
    tokens = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } catch (err) {
    console.error(`Error: Failed to parse JSON at ${inputPath}:`, err.message);
    process.exit(1);
  }

  const validation = validateReferences(tokens);
  if (!validation.valid) {
    console.error(`Validation Failed! Found ${validation.errors.length} unresolved reference(s):`);
    validation.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  if (isCheck) {
    console.log(`Validation succeeded! All ${validation.totalRefs} references are valid.`);
    process.exit(0);
  }

  const css = convertTokensToCSS(tokens);

  if (isStdout) {
    process.stdout.write(css);
  } else {
    fs.writeFileSync(outputPath, css, 'utf8');
    console.log(`Successfully converted ${inputPath} -> ${outputPath}`);
    console.log(`Total references validated: ${validation.totalRefs}`);
  }
}

if (require.main === module) {
  runCLI();
}

module.exports = {
  convertTokensToCSS,
  validateReferences,
  formatColor,
  formatDimension,
  formatShadow,
  resolveTokenRef,
  resolveValue
};
