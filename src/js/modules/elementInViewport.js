const checkIfBottomInViewport = (elm) => {
  const bounding = elm.getBoundingClientRect();
  if (bounding.top < 1) {
    const top = bounding.top * -1;
    let bottomInViewport = bounding.height < (top + window.innerHeight);
    if (top > bounding.height) { bottomInViewport = false; }
    return bottomInViewport;
  }
};

export {
  checkIfBottomInViewport 
}