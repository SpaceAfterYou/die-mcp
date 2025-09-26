import process from 'node:process'
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : ['warn', { allow: ['warn', 'error', 'info'] }],
  },
})
