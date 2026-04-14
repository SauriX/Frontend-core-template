module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/ban-types': 'off',
        'no-empty': 'off',
        'vue/require-v-for-key': 'off',
    },
}
