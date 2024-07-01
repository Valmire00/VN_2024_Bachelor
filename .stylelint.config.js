module.exports = {
    extends: 'stylelint-config-standard',
    rules: {
      'at-rule-no-unknown': [
        true,
        {
          ignoreAtRules: [
            'extends',
            'tailwind',
          ],
        },
      ],
      'declaration-block-no-duplicate-properties': [
        true,
        {
          ignore: ['consecutive-duplicates-with-different-values'],
        },
      ],
      'block-no-empty': null,
      'unit-whitelist': ['em', 'rem', 's', 'px', '%', 'ms'],
    },
  };
  