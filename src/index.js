import GingerHTMLHead from './head'

export default function({capabilities, options}){

  const head = new GingerHTMLHead(options);

  capabilities.router.beforeEach((to, from, next) => {
    head.setCurrentRoute(to);
    next();
  })

  return {}
}