export const CollapsedReducer = (prevState = {
  isCollapsed: false
}, action) => {
  let newState = {...prevState}
  switch (action.type) {
    case 'change_collapsed':
      newState.isCollapsed = !newState.isCollapsed
      return newState
    default:
      return prevState
  }
}