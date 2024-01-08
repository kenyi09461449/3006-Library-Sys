<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    // ES6赋值写法
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon') || icon.includes('fa')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{title}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.el-menu-item [class^="fa"] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}

.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
