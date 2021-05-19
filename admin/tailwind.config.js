module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
  },
  theme: {
    extend: {
      spacing: {
        '12px': '12px',
      },
      minWidth: {
        s: '12rem',
        sx: '14rem',
        xxs: '16rem',
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
      },
      colors: {
        primary: '#409EFF',
        success: '#67C23A',
        warning: '#E6A23C',
        danger: '#F56C6C',
        info: '#909399',
      },
    },
  },
  variants: {
    extends: {
      backgroundColor: ['hover', 'focus', 'active'],
      borderWidth: ['first', 'last'],
      padding: ['first', 'last', 'odd', 'even'],
      margin: ['first', 'last', 'odd', 'even'],
      gridColumn: ['responsive'],
    },
  },
}
