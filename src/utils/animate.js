export function animate (bgCtx, entities, height, width, requestAnimationFrame) {
  bgCtx.fillStyle = '#000000';
  bgCtx.fillRect(0,0,width,height);
  bgCtx.fillStyle = '#ffffff';
  bgCtx.strokeStyle = '#ffffff';

  let entLen = entities.length;

  while(entLen--){
    if (entities[entLen].type === 'shooting') {
      entities[entLen].update(bgCtx, height);
    } else if (entities[entLen].type === 'star') {
      entities[entLen].update(bgCtx);
    }
  }
  requestAnimationFrame(this.animate)
}