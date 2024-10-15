<script>
export default {
  name: 'LinkTag',
  functional: true,
  render (h, { props, children }) {
    const tag = props.router ? 'router-link' : 'a'
    if (!props.router) {
      props.href = props.to
    }
    props.style = `height: ${props.height}px; width: ${props.width}px`
    return props.homeLink ? h(
      tag,
      { attrs: props },
      children) : h('span', children)
  }
}
</script>
