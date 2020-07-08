import GingerHTMLHead from './head'

export default function({capabilities, options}){

  const head = new GingerHTMLHead(options);

  capabilities.eventbus.$on('ginger:view:mount', ({route, routes, component, instance, view}) => {
    head.setCurrentRoute(route);
  })

  capabilities.eventbus.$on('ginger:head:update', () => {
    head.update();
  })

  return {}
}