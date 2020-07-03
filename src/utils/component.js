import deepmerge from 'deepmerge'
import { isObject, isUndefined, keyName, rootConfigKey } from './index'

export function getComponentOption(component, result){
  result = result || {};

  if (component._inactive){
    return result;
  }

  const { $headInfo, $options, $children } = component;

  if ($options[keyName]){

    // if $headInfo exists then [keyName] was defined as a function
    // and set to the computed prop $headInfo in the mixin
    // using the computed prop should be a small performance increase
    // because Vue caches those internally
    const data = $headInfo || $options[keyName];

    // only merge data with result when its an object
    // eg it could be a function when metaInfo() returns undefined
    // due to the or statement above
    if (isObject(data)) {
      result = merge(result, data)
    }
  }

  if ($children.length){
    $children.forEach((child) => {
      if (!inBranch(child)){
        return;
      }

      result = getComponentOption(child, result);
    })
  }

  return result;
}

export function inBranch(vm){
  vm = vm || this;
  return vm && !isUndefined(vm[rootConfigKey]);
}

export function merge(target, source, options){
  options = options || {};

  // remove properties explicitly set to false so child components can
  // optionally _not_ overwrite the parents content
  // (for array properties this is checked in arrayMerge)
  if (source.title === undefined) {
    delete source.title
  }

  return deepmerge(target, source, {
    arrayMerge: (t, s) => arrayMerge(options, t, s)
  })
}