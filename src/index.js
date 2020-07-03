import createMixin from './mixin'

export default function({capabilities, options}){
  console.group('GingerHeadPlugin');
  console.log('Plugin capabilities', capabilities);
  console.log('Plugin options', options);
  console.groupEnd('GingerHeadPlugin');

  return {
    mixin: createMixin
  }
}