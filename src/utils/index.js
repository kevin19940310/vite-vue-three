import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
const loader = new FBXLoader();
export const loadFBX = (url) => {
  return new Promise((resolve, reject) => {
    loader.load(url, (object) => {
      resolve(object);
    }, () => { }, (error) => {
      reject(error)
    })
  })
}