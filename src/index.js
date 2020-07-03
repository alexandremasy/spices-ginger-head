import createMixin from './mixin'
import GingerHTMLHead from './head'

export default function({capabilities, options}){

  capabilities.vue.prototype.$head = new GingerHTMLHead(options);

  return {
    mixin: createMixin
  }
}